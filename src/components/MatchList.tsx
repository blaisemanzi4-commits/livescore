import React from 'react';
import { ChevronDown, ChevronRight, Trophy, ShieldAlert } from 'lucide-react';
import { Match, Competition } from '../types/sports';
import { MatchCard } from './MatchCard';

interface MatchListProps {
  matches: Match[];
  competitions: Competition[];
  favouriteMatches: string[];
  onToggleFavourite: (e: React.MouseEvent, matchId: string) => void;
  onSelectMatch: (match: Match) => void;
  onSelectCompetition?: (compId: string) => void;
  isLiveOnly: boolean;
  onResetFilters: () => void;
}

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  competitions,
  favouriteMatches,
  onToggleFavourite,
  onSelectMatch,
  onSelectCompetition,
  isLiveOnly,
  onResetFilters,
}) => {
  // Collapsed competitions state
  const [collapsedComps, setCollapsedComps] = React.useState<Record<string, boolean>>({});

  const toggleCollapse = (compId: string) => {
    setCollapsedComps((prev) => ({
      ...prev,
      [compId]: !prev[compId],
    }));
  };

  // Group matches by competitionId
  const groupedMatches = React.useMemo(() => {
    const map = new Map<string, Match[]>();
    matches.forEach((m) => {
      const list = map.get(m.competitionId) || [];
      list.push(m);
      map.set(m.competitionId, list);
    });
    return map;
  }, [matches]);

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-[#14151a] rounded-2xl border border-[#23252d] m-4">
        <ShieldAlert className="w-12 h-12 text-gray-500 mb-3" />
        <h3 className="text-base font-bold text-white mb-1">No Matches Found</h3>
        <p className="text-xs text-gray-400 max-w-sm mb-4">
          {isLiveOnly
            ? 'There are currently no live matches matching your criteria. Check upcoming fixtures or turn off the LIVE filter.'
            : 'No fixtures scheduled for this date.'}
        </p>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-[#ee4036] hover:bg-[#ff4e00] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          View All Today&apos;s Matches
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2 sm:p-4">
      {Array.from(groupedMatches.entries()).map(([compId, compMatches]) => {
        const comp = competitions.find((c) => c.id === compId);
        const isCollapsed = collapsedComps[compId];
        const roundTitle = compMatches[0]?.competitionRound || compMatches[0]?.competitionName;
        const liveCountInGroup = compMatches.filter((m) => m.status === 'LIVE').length;

        return (
          <div
            key={compId}
            className="rounded-xl overflow-hidden border border-[#22242c] bg-[#14151a] shadow-sm"
          >
            {/* Competition Header (matching screenshot 1) */}
            <div
              onClick={() => toggleCollapse(compId)}
              className="flex items-center justify-between px-4 py-2.5 bg-[#17181f] hover:bg-[#1e2029] border-b border-[#22242c] cursor-pointer select-none transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{comp?.flag || '🏆'}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                      {comp?.name || compId}
                    </span>
                    {liveCountInGroup > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-[#ee4036] text-white">
                        {liveCountInGroup} LIVE
                      </span>
                    )}
                  </div>
                  {roundTitle && roundTitle !== comp?.name && (
                    <div className="text-[11px] text-gray-400 font-medium">
                      {roundTitle}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onSelectCompetition && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCompetition(compId);
                    }}
                    className="text-[11px] font-semibold text-gray-400 hover:text-white px-2 py-0.5 rounded hover:bg-[#252834] transition-colors"
                  >
                    Table
                  </button>
                )}
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            {/* Match Cards */}
            {!isCollapsed && (
              <div className="divide-y divide-[#20222a]">
                {compMatches.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    isFavourite={favouriteMatches.includes(m.id)}
                    onToggleFavourite={onToggleFavourite}
                    onSelectMatch={onSelectMatch}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
