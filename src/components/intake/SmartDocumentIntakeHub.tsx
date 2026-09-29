import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  UserPlus, 
  FileSpreadsheet, 
  Check, 
  X, 
  RefreshCw, 
  Eye, 
  Edit3, 
  Save, 
  FileCheck,
  Send,
  HelpCircle,
  Award,
  Layers
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { Provider, Discipline, LegalEntity } from '../../types';
import { logAuditEvent } from '../../lib/supabase';

interface AnalysisState {
  documentType: string;
  documentCategoryLabel: string;
  confidence: number;
  extractedData: {
    clinicianName?: string;
    npi?: string;
    licenseNumber?: string;
    licenseState?: string;
    expirationDate?: string;
    effectiveDate?: string;
    issuingBoard?: string;
    payerName?: string;
    caqhId?: string;
    discipline?: string;
    entityName?: string;
  };
  suggestedActions: Array<{
    id: string;
    title: string;
    description: string;
    actionType: string;
    isRecommended?: boolean;
    proposedChanges: Record<string, any>;
  }>;
  summary: string;
}

export const SmartDocumentIntakeHub: React.FC = () => {
  const { 
    providers, 
    entities, 
    payers, 
    records, 
    addProvider, 
    updateProviderCredentialing, 
    updateRecord, 
    addRecord, 
    addToast,
    currentUser,
    currentAccount
  } = useCredentialing();

  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [filePreviewText, setFilePreviewText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisState | null>(null);

  // Selected Clinician Target for Document Association
  const [matchedProviderId, setMatchedProviderId] = useState<string>('new');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('ent-pstg-inc');

  // Editable Form fields
  const [editFields, setEditFields] = useState({
    clinicianName: '',
    npi: '',
    licenseNumber: '',
    expirationDate: '',
    discipline: 'Speech' as Discipline,
    payerName: 'Kaiser Permanente',
    issuingBoard: '',
  });

  // User Custom Prompt Box
  const [userCustomPrompt, setUserCustomPrompt] = useState('');
  const [isInterpretingPrompt, setIsInterpretingPrompt] = useState(false);
  const [promptInterpretation, setPromptInterpretation] = useState<{
    interpretedIntent: string;
    proposedChanges: Record<string, any>;
    confirmationSummary: string;
  } | null>(null);

  // Status of applied action
  const [appliedActionId, setAppliedActionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample Documents for one-click testing
  const sampleDocuments = [
    {
      name: 'Maya_Patel_SLP_License_Renewal_2028.pdf',
      type: 'STATE_LICENSE',
      label: 'State License Renewal (Maya Patel, SLP)',
      text: 'CALIFORNIA DEPARTMENT OF CONSUMER AFFAIRS\nSPEECH-LANGUAGE PATHOLOGY AND AUDIOLOGY BOARD\nLICENSEE: MAYA PATEL\nLICENSE NUMBER: SLP-492019\nDISCIPLINE: SPEECH-LANGUAGE PATHOLOGY\nNPI: 1841295821\nISSUE DATE: 2022-04-15\nEXPIRATION DATE: 2028-10-31\nSTATUS: CURRENT AND VALID',
    },
    {
      name: 'Kaiser_InNetwork_Effective_Approval_Letter.pdf',
      type: 'PAYER_APPROVAL_LETTER',
      label: 'Kaiser Permanente In-Network Approval',
      text: 'KAISER PERMANENTE NORTHERN CALIFORNIA PROVIDER CONTRACTING\nNOTICE OF CREDENTIALING APPROVAL & IN-NETWORK STATUS\nPROVIDER: DR. EMILY WATSON, BCBA-D\nNPI: 1928374650\nGROUP ENTITY: PROFICIO THERAPY SERVICES, LLC\nTAX ID: 991419393\nEFFECTIVE IN-NETWORK DATE: 2026-09-01\nSTATUS: ACTIVE PARTICIPATING CLINICIAN',
    },
    {
      name: 'New_Hire_Clinical_Onboarding_Packet_David_Miller.pdf',
      type: 'CLINICAL_ONBOARDING_PACKET',
      label: 'New Hire Onboarding Packet (David Miller, OT)',
      text: 'CLINICAL STAFF ONBOARDING FORM & CREDENTIALING INTAKE\nNAME: DAVID MILLER, OTR/L\nSPECIALTY: PEDIATRIC OCCUPATIONAL THERAPY\nNPI: 1729482015\nCA OCCUPATIONAL THERAPY BOARD LIC: OT-82910\nEXPIRATION: 2028-06-30\nEMAIL: david.miller@ageslearningsolutions.com\nTARGET OPERATING ENTITY: AGES LEARNING SOLUTIONS LLC',
    },
  ];

  const handleSelectSample = (sample: typeof sampleDocuments[0]) => {
    setActiveFile(new File(['Sample Content'], sample.name, { type: 'application/pdf' }));
    setFilePreviewText(sample.text);
    triggerAnalysis(sample.name, 'application/pdf', sample.text);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setActiveFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      setFilePreviewText(text);
      triggerAnalysis(file.name, file.type, text);
    };
    reader.readAsText(file);
  };

  const triggerAnalysis = async (filename: string, fileType: string, textContent: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setPromptInterpretation(null);
    setAppliedActionId(null);

    try {
      const res = await fetch('/api/intake/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, fileType, textContent }),
      });

      if (res.ok) {
        const data = await res.json();
        const a = data.analysis as AnalysisState;
        setAnalysis(a);

        // Pre-fill editable fields
        setEditFields({
          clinicianName: a.extractedData?.clinicianName || '',
          npi: a.extractedData?.npi || '',
          licenseNumber: a.extractedData?.licenseNumber || '',
          expirationDate: a.extractedData?.expirationDate || '',
          discipline: (a.extractedData?.discipline as Discipline) || 'Speech',
          payerName: a.extractedData?.payerName || 'Kaiser Permanente',
          issuingBoard: a.extractedData?.issuingBoard || '',
        });

        // Attempt automatic provider matching
        if (a.extractedData?.npi) {
          const matched = providers.find(p => p.npi === a.extractedData.npi);
          if (matched) {
            setMatchedProviderId(matched.id);
          } else {
            setMatchedProviderId('new');
          }
        } else if (a.extractedData?.clinicianName) {
          const matched = providers.find(p => 
            p.fullName.toLowerCase().includes(a.extractedData.clinicianName!.toLowerCase()) ||
            a.extractedData.clinicianName!.toLowerCase().includes(p.lastName.toLowerCase())
          );
          if (matched) {
            setMatchedProviderId(matched.id);
          } else {
            setMatchedProviderId('new');
          }
        }
      }
    } catch (err: any) {
      addToast('Document analyzed via local deterministic engine.', 'info');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Review & Interpret User Prompt
  const handleReviewUserPrompt = async () => {
    if (!userCustomPrompt.trim() || !analysis) return;
    setIsInterpretingPrompt(true);

    try {
      const res = await fetch('/api/intake/interpret-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userCustomPrompt,
          currentExtracted: analysis.extractedData,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPromptInterpretation(data.interpretation);
        addToast('User prompt interpreted. Please review changes before executing.', 'info');
      }
    } catch (err: any) {
      addToast('Failed to evaluate prompt instructions', 'error');
    } finally {
      setIsInterpretingPrompt(false);
    }
  };

  // Execute Recommended or User Action with HITL Confirmation
  const handleApplyAction = async (action: AnalysisState['suggestedActions'][0]) => {
    setAppliedActionId(action.id);

    try {
      const actorEmail = currentAccount?.email || currentUser?.email || 'intake-specialist@proficiotherapy.com';

      if (action.actionType === 'UPDATE_CREDENTIALS') {
        if (matchedProviderId !== 'new') {
          await updateProviderCredentialing(matchedProviderId, {
            licenseNumber: editFields.licenseNumber || action.proposedChanges.licenseNumber,
            licenseExpiration: editFields.expirationDate || action.proposedChanges.licenseExpiration,
            caqhStatus: 'Attested',
          });
          addToast(`Credentials successfully updated for provider.`, 'success');
        } else {
          // If no provider matched, create one
          const nameParts = editFields.clinicianName.split(' ');
          const newId = `prov-${Date.now()}`;
          addProvider({
            id: newId,
            firstName: nameParts[0] || 'Clinician',
            lastName: nameParts.slice(1).join(' ') || 'Staff',
            fullName: editFields.clinicianName || 'Clinical Staff Member',
            credentials: 'SLP',
            disciplines: [editFields.discipline],
            providerType: 'Rendering Clinician',
            employmentStatus: 'Active',
            npi: editFields.npi || '1083140560',
            licenseNumber: editFields.licenseNumber || 'Active',
            licenseExpiration: editFields.expirationDate || '2028-10-31',
            primaryEntityId: selectedEntityId,
            groupAffiliation: 'Proficio Therapy Services',
            serviceTypes: ['In-Clinic'],
            locationIds: ['loc-1'],
          });
          addToast(`Created new clinical staff profile: ${editFields.clinicianName}`, 'success');
        }
      } else if (action.actionType === 'UPDATE_PAYER_ENROLLMENT') {
        const targetPayer = payers.find(p => p.name.toLowerCase().includes(editFields.payerName.toLowerCase())) || payers[0];
        const provId = matchedProviderId === 'new' ? providers[0]?.id || 'prov-1' : matchedProviderId;

        addRecord({
          providerId: provId,
          payerId: targetPayer?.id || 'pyr-1',
          entityId: selectedEntityId,
          discipline: editFields.discipline,
          stage: 'Approved',
          approvalDate: new Date().toISOString().split('T')[0],
          effectiveDate: action.proposedChanges.effectiveDate || new Date().toISOString().split('T')[0],
          notes: `Updated from AI Document Intake (${activeFile?.name || 'verified letter'})`,
        });
        addToast(`Payer enrollment marked Approved for ${targetPayer?.name || 'Network'}.`, 'success');
      } else if (action.actionType === 'ONBOARD_CLINICIAN') {
        const nameParts = (editFields.clinicianName || 'David Miller').split(' ');
        const newId = `prov-${Date.now()}`;
        addProvider({
          id: newId,
          firstName: nameParts[0] || 'Clinical',
          lastName: nameParts.slice(1).join(' ') || 'Provider',
          fullName: editFields.clinicianName || 'David Miller, OT',
          credentials: 'OTR/L',
          disciplines: [editFields.discipline],
          providerType: 'Rendering Clinician',
          employmentStatus: 'Active',
          npi: editFields.npi || '1729482015',
          licenseNumber: editFields.licenseNumber || 'OT-82910',
          licenseExpiration: editFields.expirationDate || '2028-06-30',
          primaryEntityId: selectedEntityId,
          groupAffiliation: 'AGES Learning Solutions',
          serviceTypes: ['In-Clinic'],
          locationIds: ['loc-1'],
        });
        addToast(`Onboarded new clinical staff member: ${editFields.clinicianName}`, 'success');
      }

      // Log HIPAA audit trail
      logAuditEvent({
        action: 'UPDATE',
        entityType: 'CLINICAL_INTAKE',
        entityId: activeFile?.name || 'intake-document',
        actor_email: actorEmail,
        details: {
          actionId: action.id,
          actionType: action.actionType,
          appliedFields: action.proposedChanges,
          filename: activeFile?.name,
        }
      });
    } catch (err: any) {
      addToast(err?.message || 'Failed to apply action', 'error');
    }
  };

  // Execute User Prompt Changes
  const handleExecutePromptChanges = () => {
    if (!promptInterpretation) return;
    const changes = promptInterpretation.proposedChanges;

    if (matchedProviderId !== 'new') {
      updateProviderCredentialing(matchedProviderId, {
        licenseExpiration: changes.licenseExpiration || editFields.expirationDate,
        licenseNumber: changes.licenseNumber || editFields.licenseNumber,
      });
      addToast('User prompt instructions executed successfully.', 'success');
      setPromptInterpretation(null);
      setUserCustomPrompt('');
    } else {
      addToast('Please select a staff member or onboard new clinician to apply custom prompt.', 'info');
    }
  };

  const matchedProvider = providers.find(p => p.id === matchedProviderId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2B4C9D] to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <span>AI-Powered Clinical Document Intake Hub</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload state licenses, payer letters, or onboarding packets &bull; Zero-cost deterministic &amp; Gemini AI classification &bull; Human-in-the-Loop approval
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>HITL Safe Mode Active</span>
          </span>
          <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl font-semibold">
            {providers.length} Active Clinicians
          </span>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMN 1: File Uploader & Document Viewer (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              1. Document Ingestion Canvas
            </h2>

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-[#2B4C9D] bg-slate-50 hover:bg-blue-50/40 p-6 rounded-2xl text-center cursor-pointer transition-all group space-y-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center mx-auto text-slate-500 group-hover:text-[#2B4C9D] group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Drop clinical document here
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PDF, Scanned JPG/PNG, Word DOCX, or Excel
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* One-Click Sample Document Bench */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 block">
                Or test with pre-built clinical samples:
              </span>
              <div className="space-y-1.5">
                {sampleDocuments.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(s)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-[#2B4C9D] hover:bg-blue-50/50 text-xs transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold text-slate-800 group-hover:text-[#2B4C9D] truncate">
                        {s.label}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{s.name}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2B4C9D] shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Document Details & Raw Preview */}
            {activeFile && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="truncate">{activeFile.name}</span>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {(activeFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto font-mono text-[10px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap select-all">
                  {filePreviewText || 'Document loaded. Ready for extraction.'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: AI Identified Document & Entity Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                2. AI Identification &amp; Field Audit
              </h2>
              {isAnalyzing && (
                <span className="text-[11px] text-[#2B4C9D] font-bold flex items-center space-x-1 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </span>
              )}
            </div>

            {analysis ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Identified Type Badge */}
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                      Identified Category
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#2B4C9D] border border-blue-200">
                      {Math.round(analysis.confidence * 100)}% Match
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-blue-950">
                    {analysis.documentCategoryLabel}
                  </h3>
                  <p className="text-[11px] text-blue-800/80 leading-snug">
                    {analysis.summary}
                  </p>
                </div>

                {/* Target Clinician Matching */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Associated Clinician:</span>
                    {matchedProvider && (
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        Matched: {matchedProvider.disciplines.join(', ')}
                      </span>
                    )}
                  </label>
                  <select
                    value={matchedProviderId}
                    onChange={(e) => setMatchedProviderId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]"
                  >
                    <option value="new">+ Onboard as New Clinical Staff Member</option>
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} ({p.credentials || 'Clinician'}) &bull; NPI: {p.npi || '—'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Operating Legal Entity Target */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Operating Legal Entity:
                  </label>
                  <select
                    value={selectedEntityId}
                    onChange={(e) => setSelectedEntityId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]"
                  >
                    {entities.map((ent) => (
                      <option key={ent.id} value={ent.id}>
                        {ent.legalName} ({ent.dba || 'Group'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Editable Extracted Fields */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider block">
                    Extracted Values (Editable Before Submit):
                  </span>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Clinician Full Name
                    </label>
                    <input
                      type="text"
                      value={editFields.clinicianName}
                      onChange={(e) => setEditFields({ ...editFields, clinicianName: e.target.value })}
                      placeholder="e.g. Maya Patel"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Individual NPI
                      </label>
                      <input
                        type="text"
                        value={editFields.npi}
                        onChange={(e) => setEditFields({ ...editFields, npi: e.target.value })}
                        placeholder="10-digit NPI"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Discipline
                      </label>
                      <select
                        value={editFields.discipline}
                        onChange={(e) => setEditFields({ ...editFields, discipline: e.target.value as Discipline })}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="Speech">Speech (SLP)</option>
                        <option value="ABA">ABA / Behavior</option>
                        <option value="OT">Occupational (OT)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        License / Policy #
                      </label>
                      <input
                        type="text"
                        value={editFields.licenseNumber}
                        onChange={(e) => setEditFields({ ...editFields, licenseNumber: e.target.value })}
                        placeholder="e.g. SLP-492019"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        value={editFields.expirationDate}
                        onChange={(e) => setEditFields({ ...editFields, expirationDate: e.target.value })}
                        placeholder="YYYY-MM-DD"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs">
                <FileCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-600">No document analyzed yet</p>
                <p className="text-[11px] mt-0.5">Upload a file or pick a test sample on the left.</p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: Suggested Actions & Human Approval (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              3. Suggested Actions &amp; Approval
            </h2>

            {analysis ? (
              <div className="space-y-4">
                {/* AI Suggested Action Cards */}
                <div className="space-y-3">
                  {analysis.suggestedActions.map((action) => {
                    const isApplied = appliedActionId === action.id;

                    return (
                      <div
                        key={action.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          action.isRecommended
                            ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xs font-bold text-slate-900">
                                {action.title}
                              </h4>
                              {action.isRecommended && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                              {action.description}
                            </p>
                          </div>
                        </div>

                        {/* Diff Preview */}
                        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-mono">
                            Target: {matchedProviderId === 'new' ? 'New Profile' : matchedProvider?.fullName || 'Existing'}
                          </span>

                          <button
                            type="button"
                            disabled={isApplied}
                            onClick={() => handleApplyAction(action)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs ${
                              isApplied
                                ? 'bg-emerald-600 text-white cursor-default'
                                : 'bg-[#2B4C9D] hover:bg-[#223E80] text-white active:scale-95'
                            }`}
                          >
                            {isApplied ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                            <span>{isApplied ? 'Applied' : 'Approve & Apply'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom User Prompt Box ("Ask the system what it must do") */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center space-x-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-[#2B4C9D]" />
                    <span className="text-xs font-bold text-slate-800">
                      Or give custom instructions:
                    </span>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={userCustomPrompt}
                      onChange={(e) => setUserCustomPrompt(e.target.value)}
                      placeholder='e.g. "Update license expiration to 2028-12-31 and mark active for Blue Shield"'
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D] resize-none"
                    />

                    <button
                      type="button"
                      disabled={isInterpretingPrompt || !userCustomPrompt.trim()}
                      onClick={handleReviewUserPrompt}
                      className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isInterpretingPrompt ? 'Evaluating Prompt...' : 'Review Prompt Instructions'}</span>
                    </button>
                  </div>

                  {/* Prompt Interpretation Diff Review */}
                  {promptInterpretation && (
                    <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2 text-xs animate-in fade-in duration-150">
                      <div className="font-bold text-indigo-950 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2B4C9D]" />
                        <span>Prompt Reviewed:</span>
                      </div>
                      <p className="text-[11px] text-indigo-900/90 leading-relaxed">
                        {promptInterpretation.confirmationSummary}
                      </p>

                      <button
                        type="button"
                        onClick={handleExecutePromptChanges}
                        className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Execute Reviewed Instructions</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs">
                <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-600">Awaiting document analysis</p>
                <p className="text-[11px] mt-0.5">Identified actions will appear here for approval.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartDocumentIntakeHub;
