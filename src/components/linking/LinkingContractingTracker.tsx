import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  CheckCircle2, 
  Clock, 
  Link2, 
  Search, 
  ShieldCheck 
} from 'lucide-react';

interface LinkingContractingTrackerProps {
  onSelectRecord: (recordId: string) => void;
}

export const LinkingContractingTracker: React.FC<LinkingContractingTrackerProps> = ({ onSelectRecord }) => {
  const { records, providers, payers, entities } = useCredentialing();

  const [searchQuery, setSearchQuery] = useState('');

  // Linking records
  const approvedRecords = records.filter((r) => 
    ['Approved', 'Linking Pending', 'Linked', 'Effective'].includes(r.stage) ||
    r.linkingStatus !== 'Not Applicable'
  );

  const filteredLinking = approvedRecords.filter((r) => {
    if (!searchQuery.trim()) return true;
    const provider = providers.find((p) => p.id === r.providerId);
    const payer = payers.find((p) => p.id === r.payerId);
    const q = searchQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      `${provider?.firstName} ${provider?.lastName}`.toLowerCase().includes(q) ||
      payer?.name.toLowerCase().includes(q)
    );
  });

  const linkingPendingCount = records.filter((r) => r.linkingStatus === 'Pending Approval' || r.stage === 'Linking Pending').length;
  const linkedCount = records.filter((r) => r.linkingStatus === 'Linked' || r.stage === 'Linked' || r.stage === 'Effective').length;

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Link2 className="w-5 h-5 text-[#2B4C9D]" />
            <span>Staff-to-Group Linking</span>
          </h2>
          <p className="text-xs text-slate-500">
            Track rendering clinical staff enrollment, group NPI affiliations, and billing readiness.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          <span>{approvedRecords.length} Approved Records for Linking</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#2B4C9D] font-semibold">
            <span>Approved & Active</span>
            <CheckCircle2 className="w-4 h-4 text-[#2B4C9D]" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{approvedRecords.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Approved by payer committees</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-700 font-semibold">
            <span>Linking Pending (Hold Billing)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{linkingPendingCount}</div>
          <div className="text-[11px] text-amber-800 font-medium mt-0.5">Approved but not yet linked to Group NPI</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
            <span>Fully Linked & Billable</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{linkedCount}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Active in payer billing systems</div>
        </div>
      </div>

      {/* PROVIDER LINKING TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter approved records for linking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing <strong>{filteredLinking.length}</strong> records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-3">Clinical Staff</th>
                <th className="py-3 px-3">Discipline</th>
                <th className="py-3 px-3">Payer</th>
                <th className="py-3 px-3">Legal Entity & Group NPI</th>
                <th className="py-3 px-3">Approval Date</th>
                <th className="py-3 px-3">Linking Status</th>
                <th className="py-3 px-3">Link Effective Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLinking.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Link2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600 text-xs">No Linking Records Found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Approved applications ready to be linked to group NPIs will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredLinking.map((rec) => {
                  const provider = providers.find((p) => p.id === rec.providerId);
                  const payer = payers.find((p) => p.id === rec.payerId);
                  const entity = entities.find((e) => e.id === rec.entityId);

                  return (
                    <tr
                      key={rec.id}
                      onClick={() => onSelectRecord(rec.id)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#2B4C9D]">{rec.id}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {provider?.firstName} {provider?.lastName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {rec.discipline}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">{payer?.name}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{entity?.dba || entity?.legalName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Group NPI: {entity?.npiType2}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-600">
                        {rec.approvalDate || 'In Review'}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.linkingStatus === 'Linked'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.linkingStatus === 'Pending Approval'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {rec.linkingStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {rec.linkEffectiveDate || <span className="text-slate-400 font-normal">Pending Link</span>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRecord(rec.id);
                          }}
                          className="px-2.5 py-1 rounded bg-indigo-50 text-[#2B4C9D] hover:bg-indigo-100 font-semibold text-xs cursor-pointer"
                        >
                          Manage Link
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
