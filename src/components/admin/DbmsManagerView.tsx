import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Check, 
  Download, 
  AlertTriangle, 
  ShieldCheck, 
  Table, 
  ArrowUpDown, 
  ExternalLink,
  Code2,
  Terminal,
  FileJson,
  Layers,
  ChevronRight,
  Eye,
  Copy
} from 'lucide-react';
import { supabase, fetchCollection, saveDocument, deleteDocument } from '../../lib/supabase';
import { useCredentialing } from '../../context/CredentialingContext';
import { isDeveloper, isSuperAdmin } from '../../utils/rbac';

interface DbmsTableMeta {
  id: string;
  name: string;
  label: string;
  description: string;
  primaryKey: string;
}

const TABLES: DbmsTableMeta[] = [
  { id: 'providers', name: 'providers', label: 'Providers', description: 'Active clinicians, BCBAs, SLPs, OTs & RBTs credentials', primaryKey: 'id' },
  { id: 'clinical_staff', name: 'clinical_staff', label: 'Clinical Staff', description: 'Healthcare clinical personnel roster and license records', primaryKey: 'id' },
  { id: 'employees', name: 'employees', label: 'Employees', description: 'Corporate employees across operating entities', primaryKey: 'id' },
  { id: 'entities', name: 'entities', label: 'Legal Entities', description: 'AGES, Proficio Speech Therapy & Child’s Play Therapy orgs', primaryKey: 'id' },
  { id: 'payers', name: 'payers', label: 'Insurance Payers', description: 'Commercial & Medicaid payer panel configurations', primaryKey: 'id' },
  { id: 'locations', name: 'locations', label: 'Clinic Locations', description: 'Operating service centers and therapy facilities', primaryKey: 'id' },
  { id: 'records', name: 'credentialing_records', label: 'Credentialing Records', description: 'Application workflow tracking and enrollment records', primaryKey: 'id' },
  { id: 'users', name: 'users', label: 'User Accounts', description: 'System credentials, RBAC permissions, and authentication', primaryKey: 'id' },
  { id: 'tickets', name: 'system_tickets', label: 'System Tickets', description: 'Issue tickets, bug reports, and credentialing requests', primaryKey: 'id' },
  { id: 'savepoints', name: 'system_savepoints', label: 'Savepoints & Snapshots', description: 'Immutable system snapshots and rollback restore points', primaryKey: 'id' },
  { id: 'system_config', name: 'system_config', label: 'System Config', description: 'Global settings, CC roster, SLA targets, and templates', primaryKey: 'id' },
  { id: 'audit_logs', name: 'audit_logs', label: 'Audit Logs', description: 'HIPAA & ISO 27001 immutable security audit entries', primaryKey: 'id' },
];

export const DbmsManagerView: React.FC = () => {
  const { currentAccount, addToast } = useCredentialing();

  const [activeTableId, setActiveTableId] = useState<string>('providers');
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tableCounts, setTableCounts] = useState<Record<string, number>>({});

  // Record Modals
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editJson, setEditJson] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newRecordJson, setNewRecordJson] = useState<string>('{}');
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const activeMeta = TABLES.find((t) => t.id === activeTableId) || TABLES[0];
  const isDev = isDeveloper(currentAccount);

  // Load Table Data from Supabase
  const loadTableData = async (collectionKey: string) => {
    setIsLoading(true);
    try {
      const data = await fetchCollection(collectionKey);
      setTableData(data || []);
      setTableCounts((prev) => ({ ...prev, [collectionKey]: (data || []).length }));
    } catch (err: any) {
      console.error('Error fetching table:', err);
      addToast(`Error loading table ${collectionKey}: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-load all counts
  useEffect(() => {
    const fetchCounts = async () => {
      for (const t of TABLES) {
        try {
          if (supabase) {
            const { count } = await supabase.from(t.name).select('*', { count: 'exact', head: true });
            if (count !== null) {
              setTableCounts((prev) => ({ ...prev, [t.id]: count }));
            }
          }
        } catch {}
      }
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    loadTableData(activeTableId);
    setSelectedRecord(null);
    setIsEditing(false);
  }, [activeTableId]);

  // Filtered Rows
  const filteredRows = tableData.filter((row) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const str = JSON.stringify(row).toLowerCase();
    return str.includes(q);
  });

  // Handle Save Record
  const handleSaveEdit = async () => {
    try {
      const parsed = JSON.parse(editJson);
      if (!parsed.id) {
        addToast('Record must contain an "id" field.', 'error');
        return;
      }
      setIsSaving(true);
      await saveDocument(activeTableId, parsed.id, parsed);
      addToast(`Record ${parsed.id} successfully updated in ${activeMeta.label}!`, 'success');
      setIsEditing(false);
      setSelectedRecord(parsed);
      loadTableData(activeTableId);
    } catch (err: any) {
      addToast(`Invalid JSON: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Create Record
  const handleCreateRecord = async () => {
    try {
      const parsed = JSON.parse(newRecordJson);
      if (!parsed.id) {
        addToast('New record must have an "id" property.', 'error');
        return;
      }
      setIsSaving(true);
      await saveDocument(activeTableId, parsed.id, parsed);
      addToast(`Record ${parsed.id} successfully created in ${activeMeta.label}!`, 'success');
      setIsCreating(false);
      loadTableData(activeTableId);
    } catch (err: any) {
      addToast(`Invalid JSON format: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Record
  const handleConfirmDelete = async () => {
    if (!deleteRecordId) return;
    setIsSaving(true);
    try {
      await deleteDocument(activeTableId, deleteRecordId);
      addToast(`Record ${deleteRecordId} deleted from ${activeMeta.label}.`, 'success');
      setDeleteRecordId(null);
      if (selectedRecord?.id === deleteRecordId) setSelectedRecord(null);
      loadTableData(activeTableId);
    } catch (err: any) {
      addToast(`Failed to delete record: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Export Table to JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(tableData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supabase_${activeTableId}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Exported ${tableData.length} records from ${activeMeta.label}`, 'success');
  };

  // Generate Sample columns for Table view
  const sampleColumns = React.useMemo(() => {
    if (tableData.length === 0) return ['id'];
    const keys = new Set<string>();
    tableData.slice(0, 10).forEach((item) => {
      Object.keys(item).forEach((k) => {
        if (typeof item[k] !== 'object' && k !== 'raw_data' && k !== 'raw_profile' && k !== 'raw_record') {
          keys.add(k);
        }
      });
    });
    return Array.from(keys).slice(0, 7);
  }, [tableData]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/30 text-blue-400 rounded-2xl border border-blue-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">Supabase DBMS Studio</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Direct Live Database
                </span>
                {isDev && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Developer Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Full-fidelity visual PostgreSQL data explorer, record editor, and administrative database console.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={() => loadTableData(activeTableId)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNewRecordJson(JSON.stringify({ id: `${activeTableId}-${Date.now()}` }, null, 2));
              setIsCreating(true);
            }}
            className="px-4 py-2 bg-[#2B4C9D] hover:bg-[#223E80] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Insert Record</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Tables List (3 cols) */}
        <div className="lg:col-span-3 space-y-2 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs h-fit">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center justify-between">
            <span>Database Tables</span>
            <span className="text-[10px] text-slate-400 font-mono">{TABLES.length} tables</span>
          </div>

          <div className="space-y-1">
            {TABLES.map((t) => {
              const isActive = t.id === activeTableId;
              const count = tableCounts[t.id] ?? (t.id === activeTableId ? tableData.length : '...');
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTableId(t.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#2B4C9D] text-white shadow-xs font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Table className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{t.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 px-2">
            Active schema: <span className="font-mono font-bold text-slate-700">public.{activeMeta.name}</span>
          </div>
        </div>

        {/* Center / Right: Table Data Explorer (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          {/* Table Header Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">{activeMeta.label}</h2>
                <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                  public.{activeMeta.name}
                </span>
                <span className="text-xs text-slate-400">({filteredRows.length} rows matching)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{activeMeta.description}</p>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeMeta.label}...`}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
              />
            </div>
          </div>

          {/* Table Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto max-h-[640px]">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold tracking-wider z-10">
                  <tr>
                    {sampleColumns.map((col) => (
                      <th key={col} className="py-3 px-4 font-mono">
                        {col}
                      </th>
                    ))}
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={sampleColumns.length + 1} className="py-12 text-center text-slate-400">
                        <div className="flex items-center justify-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-[#2B4C9D]" />
                          <span>Streaming rows from Supabase PostgreSQL...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={sampleColumns.length + 1} className="py-12 text-center text-slate-400">
                        No rows found in <span className="font-mono">{activeMeta.name}</span>.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, idx) => (
                      <tr 
                        key={row.id || idx} 
                        className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${
                          selectedRecord?.id === row.id ? 'bg-blue-50/80 font-medium' : ''
                        }`}
                        onClick={() => setSelectedRecord(row)}
                      >
                        {sampleColumns.map((col) => {
                          const val = row[col];
                          const displayStr = val === null || val === undefined ? '—' : String(val);
                          return (
                            <td key={col} className="py-2.5 px-4 font-mono text-[11px] text-slate-800 max-w-[200px] truncate">
                              {displayStr}
                            </td>
                          );
                        })}
                        <td className="py-2.5 px-4 text-right shrink-0" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRecord(row);
                                setEditJson(JSON.stringify(row, null, 2));
                                setIsEditing(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                              title="Edit Record JSON"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteRecordId(row.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Record Inspector Drawer (if selected) */}
          {selectedRecord && !isEditing && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <FileJson className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">Record Inspector: {selectedRecord.id}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditJson(JSON.stringify(selectedRecord, null, 2));
                      setIsEditing(true);
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Live</span>
                  </button>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <pre className="font-mono text-xs text-blue-200 bg-slate-950 p-4 rounded-2xl overflow-x-auto max-h-72 border border-slate-800">
                {JSON.stringify(selectedRecord, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: EDIT RECORD JSON */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-[#2B4C9D] rounded-xl">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit Record in <span className="font-mono">{activeMeta.name}</span>
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Direct JSON editor with instant schema validation and atomic Supabase commit:
            </p>

            <textarea
              value={editJson}
              onChange={(e) => setEditJson(e.target.value)}
              rows={16}
              className="w-full font-mono text-xs p-4 bg-slate-950 text-emerald-400 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Committing...' : 'Save & Commit to Supabase'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INSERT NEW RECORD */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-[#2B4C9D] rounded-xl">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Insert New Record into <span className="font-mono">{activeMeta.name}</span>
                </h3>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Provide the valid JSON payload for the new record. Ensure unique <span className="font-mono font-bold">id</span> is set:
            </p>

            <textarea
              value={newRecordJson}
              onChange={(e) => setNewRecordJson(e.target.value)}
              rows={14}
              className="w-full font-mono text-xs p-4 bg-slate-950 text-blue-300 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleCreateRecord}
                className="px-5 py-2 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Inserting...' : 'Insert Record into Supabase'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteRecordId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2.5 bg-rose-50 rounded-2xl border border-rose-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Delete Record Confirmation</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete record <span className="font-mono font-bold text-slate-900">{deleteRecordId}</span> from table <span className="font-mono font-bold text-slate-900">{activeMeta.name}</span>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteRecordId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
