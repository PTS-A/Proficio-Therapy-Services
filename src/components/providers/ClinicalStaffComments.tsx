import React, { useState } from 'react';
import { Provider, ProviderCommentLog } from '../../types';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  MessageSquare, 
  Send, 
  UserCheck, 
  Search, 
  Clock, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

interface ClinicalStaffCommentsProps {
  provider: Provider;
}

export const ClinicalStaffComments: React.FC<ClinicalStaffCommentsProps> = ({ provider }) => {
  const { 
    addProviderCommentLog, 
    updateProvider, 
    currentUser, 
    currentAccount
  } = useCredentialing();

  const [newComment, setNewComment] = useState('');
  const [commentTargetPerson, setCommentTargetPerson] = useState('');
  const [authorName, setAuthorName] = useState(currentAccount?.name || currentUser.name || 'Sanjay Tom');
  const [commentStatusTo, setCommentStatusTo] = useState('');
  const [commentCategory, setCommentCategory] = useState<ProviderCommentLog['category']>('Status Update');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const currentStatus = provider.currentStatus || 'Active';

  // Common quick comment templates for fast clinical staff workflows
  const quickTemplates = [
    {
      label: 'CAQH Attested',
      category: 'Status Update' as const,
      statusTo: 'In Credentialing',
      text: 'CAQH ProView re-attestation confirmed and verified. Document PDF uploaded to profile.'
    },
    {
      label: 'Roster Submitted',
      category: 'Payer Review' as const,
      statusTo: 'Payer Linking',
      text: 'Provider roster application sent to contracted payer networks for group linking.'
    },
    {
      label: 'License Expiry Reminder',
      category: 'Document Missing' as const,
      statusTo: 'Pending Documents',
      text: 'Notified clinician regarding upcoming state license expiration. Awaiting renewal certificate.'
    },
    {
      label: 'Manager Sign-Off',
      category: 'Follow-up' as const,
      statusTo: 'Active',
      text: 'Credentialing manager quality audit completed. All payer enrollments and credentials verified active.'
    }
  ];

  const handleApplyTemplate = (tmpl: typeof quickTemplates[0]) => {
    setCommentCategory(tmpl.category);
    setCommentStatusTo(tmpl.statusTo);
    setNewComment(tmpl.text);
    if (!commentTargetPerson) {
      setCommentTargetPerson(`${provider.firstName} ${provider.lastName} (Clinical Staff)`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert('Please enter a comment or status log description.');
      return;
    }

    const target = commentTargetPerson.trim() || `${provider.firstName} ${provider.lastName} (Clinical Staff)`;
    const newStatus = commentStatusTo.trim() || currentStatus;

    addProviderCommentLog(provider.id, {
      comment: newComment.trim(),
      targetPerson: target,
      statusFrom: currentStatus,
      statusTo: newStatus,
      category: commentCategory,
    });

    // If status changed, update provider state
    if (newStatus && newStatus !== currentStatus) {
      updateProvider(provider.id, {
        currentStatus: newStatus,
      });
    }

    setNewComment('');
    setCommentTargetPerson('');
    setCommentStatusTo('');
  };

  const logs = provider.commentLogs || [];

  const filteredLogs = logs.filter((log) => {
    if (filterCategory !== 'All' && log.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchComment = log.comment.toLowerCase().includes(q);
      const matchAuthor = log.authorName.toLowerCase().includes(q);
      const matchTarget = log.targetPerson?.toLowerCase().includes(q) || false;
      const matchStatus = log.statusTo?.toLowerCase().includes(q) || false;
      if (!matchComment && !matchAuthor && !matchTarget && !matchStatus) return false;
    }
    return true;
  });

  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case 'Status Update':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Follow-up':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Payer Review':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Document Missing':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Clinical Team':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Collaboration Header */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-sky-600" />
            <div>
              <span className="font-bold text-slate-900 text-sm">
                Status Logs & Multi-Staff Comment Thread
              </span>
              <p className="text-[11px] text-slate-500">
                Detailed audit trail tracking updates <strong>by who</strong> (Author) and <strong>whom</strong> (Assigned / Targeted Clinical Staff).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-500">Current Status:</span>
            <span className="font-bold px-2.5 py-1 rounded-md text-xs bg-sky-100 text-sky-800 border border-sky-200">
              {currentStatus}
            </span>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Quick Templates:</span>
          </span>
          {quickTemplates.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyTemplate(t)}
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 transition-colors cursor-pointer"
            >
              + {t.label}
            </button>
          ))}
        </div>

        {/* New Status Log & Comment Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
              <UserCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Log Status Update / Comment for {provider.firstName} {provider.lastName}</span>
            </span>

            <div className="flex items-center space-x-2 text-[11px]">
              <label className="text-slate-500 font-medium">Logged By (Who):</label>
              <select
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-800"
              >
                <option value={currentAccount?.name || currentUser.name}>
                  {currentAccount?.name || currentUser.name} ({currentAccount?.systemRole || currentUser.role})
                </option>
                <option value="Sanjay Tom">Sanjay Tom (Credentialing Specialist)</option>
                <option value="Namitha Narayanan">Namitha Narayanan (Credentialing Lead / Manager)</option>
                <option value="Dr. Rachel Green">Dr. Rachel Green (Clinical Team)</option>
                <option value="HR Coordinator">HR / Onboarding Team</option>
                <option value="Billing Specialist">Billing & Claims Dept</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Log Category *
              </label>
              <select
                value={commentCategory}
                onChange={(e) => setCommentCategory(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:bg-white"
              >
                <option value="Status Update">Status Update</option>
                <option value="Follow-up">Follow-up Task</option>
                <option value="Payer Review">Payer Review</option>
                <option value="Document Missing">Document Missing</option>
                <option value="Clinical Team">Clinical Team Communication</option>
                <option value="General Note">General Note</option>
              </select>
            </div>

            {/* Whom (Assigned / Targeted Clinical Staff) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Whom in Clinical Staff (Target / Assignee) *
              </label>
              <input
                type="text"
                required
                placeholder={`e.g. ${provider.firstName} ${provider.lastName}, Namitha, Specialist`}
                value={commentTargetPerson}
                onChange={(e) => setCommentTargetPerson(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            {/* Status Transition */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Transition Status To:
              </label>
              <select
                value={commentStatusTo}
                onChange={(e) => setCommentStatusTo(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white font-medium"
              >
                <option value="">Keep Current ({currentStatus})</option>
                <option value="Active">Active / In-Network</option>
                <option value="In Credentialing">In Credentialing</option>
                <option value="Payer Linking">Payer Linking</option>
                <option value="Pending Documents">Pending Documents</option>
                <option value="Re-attestation Due">Re-attestation Due</option>
                <option value="Under Review">Under Review</option>
                <option value="Follow-up Needed">Follow-up Needed</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Comment & Status Notes *
            </label>
            <textarea
              rows={2}
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Type update description, instructions, or coordination notes for ${provider.firstName} ${provider.lastName}...`}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Logged entries are visible to all credentialing and clinical staff members.
            </span>
            <button
              type="submit"
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Log & Comment</span>
            </button>
          </div>
        </form>

        {/* Audit Timeline & Filter Controls */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 text-xs">
                Activity & Status History ({logs.length} entries)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 pr-2.5 py-1 bg-white border border-slate-200 rounded-md text-[11px] w-36 focus:w-48 transition-all"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-semibold text-slate-600"
              >
                <option value="All">All Categories</option>
                <option value="Status Update">Status Updates</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Payer Review">Payer Review</option>
                <option value="Document Missing">Document Missing</option>
                <option value="Clinical Team">Clinical Team</option>
              </select>
            </div>
          </div>

          {/* Timeline List */}
          <div className="space-y-2.5">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* By Who */}
                      <span className="font-bold text-slate-900 text-xs flex items-center space-x-1.5 bg-slate-100 px-2 py-0.5 rounded-md">
                        <span className="w-2 h-2 rounded-full bg-sky-600 inline-block"></span>
                        <span>By Who:</span>
                        <span className="text-sky-900">{log.authorName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({log.authorRole})</span>
                      </span>

                      {/* Whom in Clinical Staff */}
                      {log.targetPerson && (
                        <span className="font-semibold text-xs flex items-center space-x-1 bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-md">
                          <span className="font-bold text-amber-700">Whom:</span>
                          <span>{log.targetPerson}</span>
                        </span>
                      )}

                      {/* Category */}
                      {log.category && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryColor(log.category)}`}>
                          {log.category}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp}</span>
                    </span>
                  </div>

                  {/* Status Change Flow Banner */}
                  {(log.statusTo && log.statusTo !== log.statusFrom) && (
                    <div className="flex items-center space-x-2 text-[11px] bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-md">
                      <span className="text-slate-500 font-medium">Status Updated:</span>
                      {log.statusFrom && (
                        <>
                          <span className="font-medium text-slate-600">{log.statusFrom}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </>
                      )}
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {log.statusTo}
                      </span>
                    </div>
                  )}

                  {/* Comment Message */}
                  <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {log.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-700">No status logs or comments found.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Use the form above to record status progression, assign follow-up items, and coordinate between team members.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
