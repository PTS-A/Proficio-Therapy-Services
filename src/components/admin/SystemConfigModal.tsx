import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  Bell, 
  Check, 
  Clock, 
  Lock, 
  Save, 
  Settings, 
  ShieldAlert, 
  Sliders, 
  Users, 
  X 
} from 'lucide-react';

interface SystemConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemConfigModal: React.FC<SystemConfigModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, users } = useCredentialing();

  const [slaSubmissionDays, setSlaSubmissionDays] = useState(5);
  const [slaFollowUpMinDays, setSlaFollowUpMinDays] = useState(7);
  const [slaFollowUpMaxDays, setSlaFollowUpMaxDays] = useState(10);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold">FR-027 & FR-031: System Configuration & SLA Policies</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5 text-xs overflow-y-auto flex-1">
          {/* SLA Thresholds */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>SLA Target Thresholds</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 font-medium">SLA-001: Max Submission Days</label>
                <input
                  type="number"
                  value={slaSubmissionDays}
                  onChange={(e) => setSlaSubmissionDays(parseInt(e.target.value) || 5)}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                />
                <span className="text-[10px] text-slate-400">Target: 5 Business Days</span>
              </div>

              <div>
                <label className="text-slate-600 font-medium">SLA-002: Follow-up Cadence (Days)</label>
                <div className="flex items-center space-x-1.5 mt-1">
                  <input
                    type="number"
                    value={slaFollowUpMinDays}
                    onChange={(e) => setSlaFollowUpMinDays(parseInt(e.target.value) || 7)}
                    className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={slaFollowUpMaxDays}
                    onChange={(e) => setSlaFollowUpMaxDays(parseInt(e.target.value) || 10)}
                    className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>
                <span className="text-[10px] text-slate-400">Target: 7–10 Business Days</span>
              </div>
            </div>
          </div>

          {/* User Access & Roles (FR-027) */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-sky-600" />
              <span>System Role-Based Access Control (RBAC)</span>
            </h4>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {users.map((u) => (
                <div key={u.id} className="p-2.5 flex items-center justify-between bg-white text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[10px] text-slate-400">{u.email}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-bold flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>System configuration updated successfully!</span>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
