import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';
import { Toast, useCredentialing } from '../../context/CredentialingContext';

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const duration = toast.duration || 5000;
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isHovered) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remainingPct);
      if (remainingPct <= 0) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [duration, isHovered]);

  const getThemeConfig = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          badge: 'Success',
          badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          barColor: 'bg-emerald-500',
          borderClass: 'border-emerald-500/40',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          badge: 'Alert',
          badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
          barColor: 'bg-rose-500',
          borderClass: 'border-rose-500/40',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          badge: 'Warning',
          badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          barColor: 'bg-amber-500',
          borderClass: 'border-amber-500/40',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
          badge: 'Notice',
          badgeClass: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
          barColor: 'bg-sky-500',
          borderClass: 'border-sky-500/40',
        };
    }
  };

  const theme = getThemeConfig();

  return (
    <div
      id={`toast-item-${toast.id}`}
      role="alert"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto w-full bg-slate-900/95 text-white rounded-xl shadow-2xl border ${theme.borderClass} overflow-hidden backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-right-6 duration-200`}
    >
      <div className="p-3.5 sm:p-4 flex items-start space-x-3">
        <div className="pt-0.5">{theme.icon}</div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center space-x-2 mb-1">
            {toast.title ? (
              <h4 className="text-xs font-bold text-slate-100 truncate">{toast.title}</h4>
            ) : (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${theme.badgeClass}`}>
                {theme.badge}
              </span>
            )}
            <span className="text-[10px] text-slate-400 font-mono">
              5s
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed break-words font-medium">
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer shrink-0 -mr-1 -mt-1"
          title="Dismiss notification"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 5-Second Countdown Progress Bar */}
      <div className="w-full h-1 bg-slate-800/80 overflow-hidden">
        <div
          className={`h-full ${theme.barColor} transition-all ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useCredentialing();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      id="global-toast-notification-container"
      aria-live="assertive"
      aria-atomic="true"
      className="fixed top-6 right-6 z-[99999] flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};
