import React from 'react';
import { LucideIcon, Database, Plus } from 'lucide-react';

interface EmptyStateSkeletonProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  badge?: string;
  className?: string;
}

export const EmptyStateSkeleton: React.FC<EmptyStateSkeletonProps> = ({
  icon: Icon = Database,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  badge = 'Ready for Data Entry',
  className = '',
}) => {
  return (
    <div
      id="empty-state-skeleton-container"
      className={`bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto shadow-xs ${className}`}
    >
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#2B4C9D] shadow-xs">
          <Icon className="w-8 h-8 text-[#2B4C9D]" />
        </div>
        {badge && (
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-base font-bold text-slate-900 tracking-tight">
        {title}
      </h3>

      <p className="text-xs text-slate-500 max-w-md mt-1.5 leading-relaxed">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <button
            id="empty-state-primary-action"
            type="button"
            onClick={onAction}
            className="px-4 py-2 bg-[#2B4C9D] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{actionLabel}</span>
          </button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <button
            id="empty-state-secondary-action"
            type="button"
            onClick={onSecondaryAction}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
