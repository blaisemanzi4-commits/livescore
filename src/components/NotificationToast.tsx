import React from 'react';
import { X, Bell, Zap } from 'lucide-react';

export interface AlertMessage {
  id: string;
  type: 'goal' | 'card' | 'var' | 'whistle' | 'info';
  title: string;
  subtitle: string;
  score?: string;
  matchTitle?: string;
  timestamp: string;
}

interface NotificationToastProps {
  alerts: AlertMessage[];
  onDismiss: (id: string) => void;
  onOpenMatch?: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  alerts,
  onDismiss,
  onOpenMatch,
}) => {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {alerts.slice(0, 3).map((alert) => (
        <div
          key={alert.id}
          className="pointer-events-auto bg-[#171822] border-2 border-[#ee4036] shadow-2xl rounded-2xl p-4 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold shrink-0 ${
                alert.type === 'goal'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : alert.type === 'card'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : alert.type === 'var'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              }`}
            >
              {alert.type === 'goal' && '⚽'}
              {alert.type === 'card' && '🟥'}
              {alert.type === 'var' && '⚡'}
              {alert.type === 'whistle' && '📢'}
              {alert.type === 'info' && '🔔'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white tracking-wide">
                  {alert.title}
                </span>
                {alert.score && (
                  <span className="px-1.5 py-0.2 rounded bg-black/60 text-emerald-400 font-black text-xs tabular-nums border border-emerald-500/30">
                    {alert.score}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 mt-0.5 line-clamp-2">
                {alert.subtitle}
              </p>
              {alert.matchTitle && (
                <span className="text-[10px] text-gray-500 block mt-1 font-medium">
                  {alert.matchTitle} · {alert.timestamp}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onDismiss(alert.id)}
            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
