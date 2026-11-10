import React from 'react';
import { SportType } from '../types/sports';

interface SportsBarProps {
  activeSport: SportType;
  onSelectSport: (sport: SportType) => void;
  sportCounts: Record<SportType, { total: number; live: number }>;
}

export const SportsBar: React.FC<SportsBarProps> = ({
  activeSport,
  onSelectSport,
  sportCounts,
}) => {
  const sports: { id: SportType; label: string; icon: string }[] = [
    { id: 'football', label: 'Football', icon: '⚽' },
    { id: 'hockey', label: 'Hockey', icon: '🏒' },
    { id: 'basketball', label: 'Basketball', icon: '🏀' },
    { id: 'tennis', label: 'Tennis', icon: '🎾' },
    { id: 'cricket', label: 'Cricket', icon: '🏏' },
  ];

  return (
    <div className="w-full bg-[#0c0d0e] border-b border-[#1c1d22] py-2 px-4 lg:px-8 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        {sports.map((sport) => {
          const isActive = activeSport === sport.id;
          const liveCount = sportCounts[sport.id]?.live || 0;

          return (
            <button
              key={sport.id}
              onClick={() => onSelectSport(sport.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#0c0d0e] shadow-md font-bold'
                  : 'bg-[#18191e] hover:bg-[#22242c] text-gray-300 border border-[#2a2c36]'
              }`}
            >
              <span className="text-sm">{sport.icon}</span>
              <span>{sport.label}</span>
              {liveCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#ee4036] text-white' : 'bg-[#ee4036]/20 text-[#ff6655]'
                  }`}
                >
                  {liveCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
