import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { LinkingStatus } from '../../types';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText, 
  Layers, 
  Link2, 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  X 
} from 'lucide-react';

interface LinkingContractingTrackerProps {
  onSelectRecord: (recordId: string) => void;
}

export const LinkingContractingTracker: React.FC<LinkingContractingTrackerProps> = ({ onSelectRecord }) => {
  const { records, providers, payers, entities, locations, updateProviderLinking, kpis } = useCredentialing();

  const [activeTab, setActiveTab] = useState<'linking' | 'contracting'>('linking');
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
            <Link2 className="w-5 h-5 text-purple-600" />
            <span>FR-014: Provider-to-Group Linking & FR-030: Contracting Oversight</span>
          </h2>
          <p className="text-xs text-slate-500">
            Ensure approved providers are formally linked to group NPIs and locations before releasing claims for billing.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('linking')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'linking'
                ? 'bg-white text-purple-800 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Provider-to-Group Linking ({approvedRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('contracting')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'contracting'
                ? 'bg-white text-purple-800 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Payer Master Contracts (FR-030)
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-purple-700 font-semibold">
            <span>Approved & Active</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
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

      {/* TAB 1: PROVIDER LINKING TABLE (FR-014) */}
      {activeTab === 'linking' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter approved records for linking..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  <th className="py-3 px-3">Provider</th>
                  <th className="py-3 px-3">Discipline</th>
                  <th className="py-3 px-3">Payer</th>
                  <th className="py-3 px-3">Legal Entity & Group NPI</th>
                  <th className="py-3 px-3">Approval Date</th>
                  <th className="py-3 px-3">Linking Status (FR-014)</th>
                  <th className="py-3 px-3">Link Effective Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLinking.map((rec) => {
                  const provider = providers.find((p) => p.id === rec.providerId);
                  const payer = payers.find((p) => p.id === rec.payerId);
                  const entity = entities.find((e) => e.id === rec.entityId);

                  return (
                    <tr
                      key={rec.id}
                      onClick={() => onSelectRecord(rec.id)}
                      className="hover:bg-purple-50/30 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-purple-900">{rec.id}</td>
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
                              : 'bg-purple-100 text-purple-800'
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
                          className="px-2.5 py-1 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-xs"
                        >
                          Manage Link
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PAYER MASTER CONTRACTING (FR-030) */}
      {activeTab === 'contracting' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {payers.map((payer) => {
            const payerRecords = records.filter((r) => r.payerId === payer.id);
            return (
              <div key={payer.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{payer.name}</h3>
                    <span className="text-[10px] text-slate-400">{payer.type} • {payer.statesServed.join(', ')}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Master Agreement Active
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contract Scope:</span>
                    <span className="font-semibold text-slate-700">ABA, Speech & OT Multi-Discipline</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fee Schedule:</span>
                    <span className="font-semibold text-emerald-700">Standard In-Network Commercial</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contract Effective:</span>
                    <span className="font-semibold text-slate-800">2024-01-01 (Auto-Renewing)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
                  <span>{payerRecords.length} Active Provider Enrollments</span>
                  <span className="text-purple-600 font-semibold">Contract Managed</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
