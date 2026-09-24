import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Building2, 
  User, 
  Calendar, 
  Plus, 
  Clock, 
  Tag, 
  CheckCircle2, 
  Send,
  ArrowRight
} from 'lucide-react';
import { useCredentialing } from '../../context/CredentialingContext';
import { Provider, ProviderCommentLog } from '../../types';

interface FlattenedComment extends ProviderCommentLog {
  providerId: string;
  providerName: string;
  providerCredentials?: string;
  providerDisciplines?: string[];
  entityId: string;
  entityName: string;
}

export const CommentsRosterView: React.FC = () => {
  const { providers, entities, currentAccount, updateProviderCredentialing, addToast } = useCredentialing();

  // Filters
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<string>('ALL');
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Add Note Modal / Drawer state
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [targetProviderId, setTargetProviderId] = useState<string>('');
  const [noteCategory, setNoteCategory] = useState<string>('General');
  const [noteContent, setNoteContent] = useState<string>('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Helper to map entity name
  const getEntityName = (entityId?: string) => {
    if (!entityId) return 'AGES Group';
    const found = entities.find((e) => e.id === entityId);
    return found?.dba || found?.legalName || 'AGES Group';
  };

  // Extract and flatten all comments across all providers
  const allComments: FlattenedComment[] = useMemo(() => {
    const list: FlattenedComment[] = [];
    (providers || []).forEach((prov) => {
      const pEntityId = prov.primaryEntityId || prov.entityIds?.[0] || 'ent-1';
      const pEntityName = getEntityName(pEntityId);
      const comments = prov.commentLogs || [];

      comments.forEach((c) => {
        list.push({
          ...c,
          providerId: prov.id,
          providerName: `${prov.firstName} ${prov.lastName}`,
          providerCredentials: prov.credentials,
          providerDisciplines: prov.disciplines || [(prov as any).discipline].filter(Boolean),
          entityId: pEntityId,
          entityName: pEntityName,
        });
      });
    });

    // Sort newest first
    return list.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return isNaN(timeB) || isNaN(timeA) ? 0 : timeB - timeA;
    });
  }, [providers, entities]);

  // Providers filtered by selected entity for employee filter dropdown
  const entityFilteredProviders = useMemo(() => {
    if (selectedEntityFilter === 'ALL') return providers;
    return providers.filter(
      (p) =>
        p.primaryEntityId === selectedEntityFilter ||
        p.entityIds?.includes(selectedEntityFilter) ||
        (p as any).renderingEntityIds?.includes(selectedEntityFilter)
    );
  }, [providers, selectedEntityFilter]);

  // Filtered comments list
  const filteredComments = useMemo(() => {
    return allComments.filter((item) => {
      if (selectedEntityFilter !== 'ALL' && item.entityId !== selectedEntityFilter) {
        return false;
      }
      if (selectedEmployeeFilter !== 'ALL' && item.providerId !== selectedEmployeeFilter) {
        return false;
      }
      if (selectedCategoryFilter !== 'ALL' && item.category !== selectedCategoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNotes = (item.notes || item.comment || '').toLowerCase().includes(q);
        const matchName = item.providerName.toLowerCase().includes(q);
        const matchAuthor = item.authorName.toLowerCase().includes(q);
        if (!matchNotes && !matchName && !matchAuthor) return false;
      }
      return true;
    });
  }, [allComments, selectedEntityFilter, selectedEmployeeFilter, selectedCategoryFilter, searchQuery]);

  // Submit new note
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProviderId) {
      addToast('Please choose an employee.', 'error');
      return;
    }
    if (!noteContent.trim()) {
      addToast('Please enter note text.', 'error');
      return;
    }

    const provider = providers.find((p) => p.id === targetProviderId);
    if (!provider) return;

    setIsSubmittingNote(true);
    try {
      const newComment: ProviderCommentLog = {
        id: `pcl-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        authorId: currentAccount?.id || 'admin',
        authorName: currentAccount?.name || 'Credentialing Specialist',
        authorRole: currentAccount?.roleTitle || currentAccount?.systemRole || 'Credentialing Specialist',
        category: noteCategory as any,
        comment: noteContent.trim(),
        notes: noteContent.trim(),
      };

      const existingLogs = provider.commentLogs || [];
      const updatedLogs = [newComment, ...existingLogs];

      await updateProviderCredentialing(provider.id, {
        commentLogs: updatedLogs,
      });

      addToast(`Note added to ${provider.firstName} ${provider.lastName}'s roster log.`, 'success');
      setNoteContent('');
      setIsAddingNote(false);
    } catch (err: any) {
      addToast('Failed to save note', 'error');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 text-[#2B4C9D] rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Comments &amp; Activity Roster
            </h1>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Unified notes archive across AGES Learning Solutions, Proficio Therapy Services, and Child&apos;s Play Therapy Services. Filter by employee, operating entity, or credentialing stage.
          </p>
        </div>

        <button
          onClick={() => {
            setTargetProviderId(providers[0]?.id || '');
            setIsAddingNote(true);
          }}
          className="px-4 py-2.5 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee Note</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search comments, clinician, author..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
            />
          </div>

          {/* Filter 1: Entity Filter */}
          <div>
            <select
              value={selectedEntityFilter}
              onChange={(e) => {
                setSelectedEntityFilter(e.target.value);
                setSelectedEmployeeFilter('ALL'); // Reset employee filter when entity changes
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 font-medium"
            >
              <option value="ALL">All 3 Entities</option>
              {entities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.dba || e.legalName}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 2: Employee Filter (Dynamic based on selected entity) */}
          <div>
            <select
              value={selectedEmployeeFilter}
              onChange={(e) => setSelectedEmployeeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 font-medium"
            >
              <option value="ALL">All Employees ({entityFilteredProviders.length})</option>
              {entityFilteredProviders.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.credentials || 'Clinician'})
                </option>
              ))}
            </select>
          </div>

          {/* Filter 3: Category Filter */}
          <div>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="General">General</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Payer Follow-up">Payer Follow-up</option>
              <option value="Document Request">Document Request</option>
              <option value="Re-credentialing">Re-credentialing</option>
              <option value="Compliance">Compliance</option>
            </select>
          </div>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing <strong>{filteredComments.length}</strong> comments across{' '}
            <strong>{providers.length}</strong> total clinicians.
          </span>
          {(selectedEntityFilter !== 'ALL' || selectedEmployeeFilter !== 'ALL' || selectedCategoryFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedEntityFilter('ALL');
                setSelectedEmployeeFilter('ALL');
                setSelectedCategoryFilter('ALL');
                setSearchQuery('');
              }}
              className="text-[#2B4C9D] font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Comments Feed / Table */}
      <div className="space-y-3">
        {filteredComments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-slate-600">No comments found matching your filters.</p>
            <p className="mt-1">Try resetting the employee or entity filters, or click &quot;Add Employee Note&quot; above.</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#2B4C9D] font-bold text-xs flex items-center justify-center shrink-0">
                    {(comment.providerName || 'P').charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">{comment.providerName}</span>
                      {comment.providerCredentials && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          &bull; {comment.providerCredentials}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {comment.entityName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-slate-400 shrink-0">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2B4C9D] font-semibold text-[10px]">
                    {comment.category || 'General'}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{comment.timestamp}</span>
                  </span>
                </div>
              </div>

              {/* Note Content */}
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs text-slate-800 leading-relaxed">
                {comment.notes || comment.comment}
              </div>

              {/* Author Attribution */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>
                  Logged by: <strong className="text-slate-600">{comment.authorName}</strong> ({comment.authorRole || 'Specialist'})
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* QUICK ADD NOTE MODAL */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#2B4C9D]" />
                <h3 className="text-base font-bold text-slate-900">Add Employee Activity Note</h3>
              </div>
              <button
                onClick={() => setIsAddingNote(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Employee <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={targetProviderId}
                  onChange={(e) => setTargetProviderId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 font-medium"
                >
                  <option value="">Select an employee...</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}, {p.credentials || 'Clinician'} ({getEntityName(p.primaryEntityId)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note Classification Category
                </label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 font-medium"
                >
                  <option value="General">General</option>
                  <option value="Onboarding">Onboarding</option>
                  <option value="Payer Follow-up">Payer Follow-up</option>
                  <option value="Document Request">Document Request</option>
                  <option value="Re-credentialing">Re-credentialing</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Type credentialing progress, phone conversation summary, or document status..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNote}
                  className="px-5 py-2 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingNote ? 'Saving...' : 'Post to Roster'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default CommentsRosterView;
