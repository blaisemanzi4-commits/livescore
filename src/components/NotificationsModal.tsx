import React from 'react';
import { X, Bell, Volume2, ShieldCheck, Check } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [goalsAlert, setGoalsAlert] = React.useState(true);
  const [redCardsAlert, setRedCardsAlert] = React.useState(true);
  const [varAlert, setVarAlert] = React.useState(true);
  const [lineupsAlert, setLineupsAlert] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(soundEffects.isSoundEnabled());

  if (!isOpen) return null;

  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundEffects.setSoundEnabled(enabled);
    if (enabled) {
      soundEffects.playWhistle();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#13141a] border border-[#272935] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#181922] border-b border-[#242632]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#ee4036]" />
            <h3 className="text-sm font-black text-white">Alert Preferences</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-[#252834]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-gray-400 leading-relaxed">
            Customize real-time push notifications for live matches, favourite teams, and competitions.
          </p>

          <div className="space-y-3">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#191a24] border border-[#262835]">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold text-white block">Sound Alerts</span>
                  <span className="text-[10px] text-gray-400">Play referee whistles & goal chimes</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => handleToggleSound(e.target.checked)}
                className="w-4 h-4 accent-[#ee4036] cursor-pointer"
              />
            </div>

            {/* Goals Alert */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#191a24] border border-[#262835]">
              <div>
                <span className="font-bold text-white block">Goal & Scorer Alerts</span>
                <span className="text-[10px] text-gray-400">Immediate toaster alerts when score changes</span>
              </div>
              <input
                type="checkbox"
                checked={goalsAlert}
                onChange={(e) => setGoalsAlert(e.target.checked)}
                className="w-4 h-4 accent-[#ee4036] cursor-pointer"
              />
            </div>

            {/* Red Cards */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#191a24] border border-[#262835]">
              <div>
                <span className="font-bold text-white block">Red Cards & Dismissals</span>
                <span className="text-[10px] text-gray-400">Notify when a player is sent off</span>
              </div>
              <input
                type="checkbox"
                checked={redCardsAlert}
                onChange={(e) => setRedCardsAlert(e.target.checked)}
                className="w-4 h-4 accent-[#ee4036] cursor-pointer"
              />
            </div>

            {/* VAR */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#191a24] border border-[#262835]">
              <div>
                <span className="font-bold text-white block">VAR Decisions</span>
                <span className="text-[10px] text-gray-400">Goal checks and penalty reviews</span>
              </div>
              <input
                type="checkbox"
                checked={varAlert}
                onChange={(e) => setVarAlert(e.target.checked)}
                className="w-4 h-4 accent-[#ee4036] cursor-pointer"
              />
            </div>

            {/* Lineups */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#191a24] border border-[#262835]">
              <div>
                <span className="font-bold text-white block">Starting Line-ups</span>
                <span className="text-[10px] text-gray-400">60 mins before kickoff for favourite clubs</span>
              </div>
              <input
                type="checkbox"
                checked={lineupsAlert}
                onChange={(e) => setLineupsAlert(e.target.checked)}
                className="w-4 h-4 accent-[#ee4036] cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                soundEffects.playGoalCelebration();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-[#ee4036] hover:bg-[#ff4e00] text-white font-bold text-xs transition-colors cursor-pointer shadow-lg"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
