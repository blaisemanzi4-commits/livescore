import React from 'react';
import { X, Star, Trophy, Award, Activity } from 'lucide-react';
import { PLAYERS } from '../data/mockSportsData';
import { Player } from '../types/sports';

interface PlayerDetailModalProps {
  playerId: string | null;
  onClose: () => void;
  isFavourite: boolean;
  onToggleFavourite: (playerId: string) => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  playerId,
  onClose,
  isFavourite,
  onToggleFavourite,
}) => {
  if (!playerId) return null;
  const player = PLAYERS.find((p) => p.id === playerId);
  if (!player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#121319] border border-[#272935] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#1e1f2b] to-[#121319] border-b border-[#232530] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center text-xl font-bold text-white shadow-lg">
              {player.photo ? (
                <img
                  src={player.photo}
                  alt={player.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                player.name.slice(0, 2)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{player.name}</h2>
                <span className="text-sm font-black text-orange-400">#{player.shirtNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <span className="font-semibold text-gray-300">{player.teamName}</span>
                <span>·</span>
                <span>{player.position}</span>
                <span>·</span>
                <span>{player.nationality}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavourite(player.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isFavourite
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-400'
                  : 'bg-[#1b1c25] border-[#292b37] text-gray-400 hover:text-white'
              }`}
              title={isFavourite ? 'Remove favourite' : 'Add favourite'}
            >
              <Star className={`w-4 h-4 ${isFavourite ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1b1c25] border border-[#292b37] text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-[#181922] border border-[#242633] rounded-xl text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">
                Goals
              </span>
              <span className="text-xl font-black text-white tabular-nums">
                {player.goals}
              </span>
            </div>

            <div className="p-3 bg-[#181922] border border-[#242633] rounded-xl text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">
                Assists
              </span>
              <span className="text-xl font-black text-white tabular-nums">
                {player.assists}
              </span>
            </div>

            <div className="p-3 bg-[#181922] border border-[#242633] rounded-xl text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">
                Rating
              </span>
              <span className="text-xl font-black text-emerald-400 tabular-nums">
                {player.rating}
              </span>
            </div>

            <div className="p-3 bg-[#181922] border border-[#242633] rounded-xl text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">
                Apps
              </span>
              <span className="text-xl font-black text-white tabular-nums">
                {player.appearances}
              </span>
            </div>
          </div>

          <div className="bg-[#181922] border border-[#242633] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between py-1 border-b border-[#242633]">
              <span className="text-gray-400">Market Value</span>
              <span className="font-black text-white">{player.marketValue || '€100M+'}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-[#242633]">
              <span className="text-gray-400">Discipline</span>
              <span className="font-semibold text-gray-300">
                🟨 {player.yellowCards} Yellow · 🟥 {player.redCards} Red
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-400">Age</span>
              <span className="font-semibold text-white">{player.age} years old</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
