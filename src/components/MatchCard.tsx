import React from 'react';
import { Star } from 'lucide-react';
import { Match } from '../types/sports';

interface MatchCardProps {
  match: Match;
  isFavourite: boolean;
  onToggleFavourite: (e: React.MouseEvent, matchId: string) => void;
  onSelectMatch: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  isFavourite,
  onToggleFavourite,
  onSelectMatch,
}) => {
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FULL_TIME';
  const isHalfTime = match.status === 'HALF_TIME';

  return (
    <div
      onClick={() => onSelectMatch(match)}
      className="group relative flex items-center justify-between px-4 py-3 bg-[#18191e] hover:bg-[#20222a] border-b border-[#23252d] transition-colors cursor-pointer"
    >
      {/* Home Team */}
      <div className="flex-1 flex items-center justify-end gap-2.5 text-right pr-3">
        <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-orange-400 transition-colors truncate">
          {match.homeTeam.name}
        </span>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold border border-white/10"
          style={{ backgroundColor: `${match.homeTeam.color}33`, color: match.homeTeam.color }}
        >
          {match.homeTeam.logo || match.homeTeam.name.slice(0, 2)}
        </div>
      </div>

      {/* Center Status / Score / Time */}
      <div className="w-24 sm:w-28 flex flex-col items-center justify-center shrink-0">
        {isLive ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-base sm:text-lg font-black text-white tabular-nums tracking-wider">
              <span>{match.homeScore}</span>
              <span className="text-gray-500">-</span>
              <span>{match.awayScore}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ee4036] animate-pulse" />
              <span className="text-[11px] font-bold text-[#ff5544] tabular-nums">
                {match.minute}&apos;
                {match.addedTime ? `+${match.addedTime}` : ''}
              </span>
            </div>
          </div>
        ) : isHalfTime ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-base sm:text-lg font-black text-white tabular-nums">
              <span>{match.homeScore}</span>
              <span className="text-gray-500">-</span>
              <span>{match.awayScore}</span>
            </div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              HT
            </span>
          </div>
        ) : isFinished ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-base sm:text-lg font-black text-gray-200 tabular-nums">
              <span>{match.homeScore}</span>
              <span className="text-gray-500">-</span>
              <span>{match.awayScore}</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              FT
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="px-2.5 py-1 rounded bg-[#252732] text-white text-xs font-bold tabular-nums">
              {match.time}
            </span>
            <span className="text-[9px] text-gray-500 font-medium mt-0.5">Kickoff</span>
          </div>
        )}
      </div>

      {/* Away Team */}
      <div className="flex-1 flex items-center justify-start gap-2.5 text-left pl-3">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold border border-white/10"
          style={{ backgroundColor: `${match.awayTeam.color}33`, color: match.awayTeam.color }}
        >
          {match.awayTeam.logo || match.awayTeam.name.slice(0, 2)}
        </div>
        <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-orange-400 transition-colors truncate">
          {match.awayTeam.name}
        </span>
      </div>

      {/* Favourite Star button */}
      <div className="pl-2 shrink-0">
        <button
          onClick={(e) => onToggleFavourite(e, match.id)}
          className={`p-1.5 rounded-md transition-all cursor-pointer ${
            isFavourite
              ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
              : 'text-gray-500 hover:text-gray-300 hover:bg-[#252732]'
          }`}
          title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          aria-label="Toggle favourite"
        >
          <Star className={`w-4 h-4 ${isFavourite ? 'fill-amber-400' : ''}`} />
        </button>
      </div>
    </div>
  );
};
