import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { ApplicationType, Discipline } from '../../types';
import { 
  AlertCircle, 
  Building, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  FilePlus, 
  Layers, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  Users, 
  X 
} from 'lucide-react';
import { addBusinessDays } from '../../utils/slaCalculator';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (recordId: string) => void;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  isOpen,
  onClose,
  onSelectRecord,
}) => {
  const {
    providers,
    payers,
    entities,
    locations,
    users,
    createCredentialingRecord,
    currentUser,
  } = useCredentialing();

  const [providerId, setProviderId] = useState(providers[0]?.id || '');
  const [payerId, setPayerId] = useState(payers[0]?.id || '');
  const [entityId, setEntityId] = useState(entities[0]?.id || '');
  const [locationId, setLocationId] = useState(locations[0]?.id || '');
  const [applicationType, setApplicationType] = useState<ApplicationType>('Initial credentialing');
  const [assignedSpecialistId, setAssignedSpecialistId] = useState(currentUser.id);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const selectedProvider = providers.find((p) => p.id === providerId) || providers[0];
  const selectedPayer = payers.find((p) => p.id === payerId) || payers[0];
  const selectedEntity = entities.find((e) => e.id === entityId) || entities[0];
  const selectedLocation = locations.find((l) => l.id === locationId) || locations[0];
  const selectedSpecialist = users.find((u) => u.id === assignedSpecialistId) || currentUser;

  const discipline = selectedProvider?.disciplines[0] || 'ABA';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const created = createCredentialingRecord({
      providerId: selectedProvider.id,
      payerId: selectedPayer.id,
      entityId: selectedEntity.id,
      locationId: selectedLocation.id,
      discipline,
      applicationType,
      stage: 'Intake',
      intakeDate: new Date().toISOString().split('T')[0],
      assignedSpecialistId: selectedSpecialist.id,
      assignedSpecialistName: selectedSpecialist.name,
      linkingStatus: 'Pending Approval',
      contractStatus: 'Active Master Agreement',
      nextFollowUpDate: addBusinessDays(new Date().toISOString().split('T')[0], 5),
    });

    onClose();
    onSelectRecord(created.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Initiate Credentialing Application</h2>
              <p className="text-xs text-slate-400">Application Workflow Intake & Submission</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Provider Selection */}
          <div>
            <label className="font-bold text-slate-800">1. Select Provider</label>
            <select
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
              required
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}, {p.credentials} ({p.disciplines.join(', ')}) • NPI: {p.npi}
                </option>
              ))}
            </select>
          </div>

          {/* Payer Selection */}
          <div>
            <label className="font-bold text-slate-800">2. Target Payer / Insurance Network</label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
              required
            >
              {payers.map((payer) => (
                <option key={payer.id} value={payer.id}>
                  {payer.name} ({payer.type}) • Avg TAT: {payer.averageTatDays} days
                </option>
              ))}
            </select>
          </div>

          {/* Application Type */}
          <div>
            <label className="font-bold text-slate-800">3. Credentialing Activity / Application Type</label>
            <select
              value={applicationType}
              onChange={(e) => setApplicationType(e.target.value as ApplicationType)}
              className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
              required
            >
              <optgroup label="Core Credentialing & Enrollment">
                <option value="New provider credentialing">New provider credentialing</option>
                <option value="Recredentialing">Recredentialing (24/36 mo cycle)</option>
                <option value="Provider enrollment and participation">Provider enrollment and participation</option>
                <option value="Provider linking">Provider linking (Rendering to Group NPI / Billing)</option>
              </optgroup>
              <optgroup label="Maintenance & Affiliations">
                <option value="Provider demographic updates">Provider demographic updates</option>
                <option value="Provider address / location additions">Provider address / location additions</option>
                <option value="Taxonomy updates">Taxonomy updates</option>
                <option value="Group affiliation and rendering provider enrollment">Group affiliation and rendering provider enrollment</option>
              </optgroup>
            </select>
          </div>

          {/* Legal Entity & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800">4. Legal Entity</label>
              <select
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              >
                {entities.map((ent) => (
                  <option key={ent.id} value={ent.id}>
                    {ent.dba || ent.legalName} (NPI: {ent.npiType2})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800">5. Service Location</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.city}, {loc.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assigned Specialist */}
          <div>
            <label className="font-bold text-slate-800">6. Assigned Credentialing Specialist</label>
            <select
              value={assignedSpecialistId}
              onChange={(e) => setAssignedSpecialistId(e.target.value)}
              className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Summary Preview Box */}
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-1.5 text-xs text-sky-950">
            <div className="font-bold flex items-center space-x-1.5 text-sky-900">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Pre-Submission Workflow Initialization Preview</span>
            </div>
            <p className="text-[11px] text-sky-800">
              Target SLA: <strong>SLA-001 (Submission within 5 business days)</strong>. Automated checklist will be provisioned for {selectedPayer?.name}.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
            >
              Create & Open Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
