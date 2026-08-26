import React from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  AlertCircle, 
  AlertTriangle, 
  Bell, 
  Check, 
  CheckCheck, 
  Clock, 
  ExternalLink, 
  FileText, 
  ShieldAlert, 
  UserX, 
  X 
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (recordId: string) => void;
  onSelectProvider: (providerId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectRecord,
  onSelectProvider,
}) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useCredentialing();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-bold">Credentialing Alerts & SLA Center</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action strip */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>{notifications.filter(n => !n.isRead).length} unread notification(s)</span>
            <button
              onClick={markAllNotificationsRead}
              className="text-sky-600 hover:text-sky-800 font-semibold flex items-center space-x-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                <Check className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                <p>No active alerts. All credentialing tasks and follow-ups are up to date.</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const getSeverityStyle = () => {
                  switch (notif.severity) {
                    case 'error':
                      return 'bg-rose-50 border-rose-200 text-rose-900';
                    case 'warning':
                      return 'bg-amber-50 border-amber-200 text-amber-900';
                    case 'success':
                      return 'bg-emerald-50 border-emerald-200 text-emerald-900';
                    default:
                      return 'bg-sky-50 border-sky-200 text-sky-900';
                  }
                };

                const getIcon = () => {
                  switch (notif.type) {
                    case 'OVERDUE_FOLLOWUP':
                    case 'ESCALATION':
                      return <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />;
                    case 'LICENSE_EXPIRING':
                      return <UserX className="w-5 h-5 text-amber-600 shrink-0" />;
                    case 'CAQH_ATTESTATION':
                      return <Clock className="w-5 h-5 text-amber-600 shrink-0" />;
                    case 'LINKING_PENDING':
                      return <AlertCircle className="w-5 h-5 text-sky-600 shrink-0" />;
                    default:
                      return <FileText className="w-5 h-5 text-slate-500 shrink-0" />;
                  }
                };

                return (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-xl border transition-all ${getSeverityStyle()} ${
                      notif.isRead ? 'opacity-70 bg-white border-slate-200 text-slate-700' : 'shadow-xs'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getIcon()}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold truncate">{notif.title}</h4>
                          <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs mt-1 text-slate-700 leading-relaxed">{notif.message}</p>

                        <div className="mt-2.5 flex items-center space-x-2 pt-2 border-t border-slate-200/60">
                          {notif.recordId && (
                            <button
                              onClick={() => {
                                onSelectRecord(notif.recordId!);
                                markNotificationRead(notif.id);
                                onClose();
                              }}
                              className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center space-x-1"
                            >
                              <span>View Application ({notif.recordId})</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                          {notif.providerId && !notif.recordId && (
                            <button
                              onClick={() => {
                                onSelectProvider(notif.providerId!);
                                markNotificationRead(notif.id);
                                onClose();
                              }}
                              className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center space-x-1"
                            >
                              <span>View Provider Profile</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}

                          <div className="flex-1"></div>

                          {!notif.isRead && (
                            <button
                              onClick={() => markNotificationRead(notif.id)}
                              className="text-[11px] text-slate-500 hover:text-slate-900 font-medium"
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
