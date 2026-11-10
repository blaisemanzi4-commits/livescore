import React from 'react';
import { X, Star, Clock, Trophy, MapPin, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Match, MatchEvent } from '../types/sports';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
  isFavourite: boolean;
  onToggleFavourite: (e: React.MouseEvent, matchId: string) => void;
  onTriggerEvent?: (type: 'goal' | 'yellow_card' | 'red_card' | 'var', team: 'home' | 'away') => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  onClose,
  isFavourite,
  onToggleFavourite,
  onTriggerEvent,
}) => {
  const [activeTab, setActiveTab] = React.useState<
    'timeline' | 'stats' | 'lineups' | 'h2h' | 'commentary' | 'prediction'
  >('timeline');

  if (!match) return null;

  const isLive = match.status === 'LIVE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111217] border border-[#262832] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#171820] border-b border-[#262832] shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="text-base">{match.countryFlag || '🏆'}</span>
            <span className="font-bold text-gray-300">{match.competitionName}</span>
            {match.competitionRound && (
              <>
                <span>·</span>
                <span>{match.competitionRound}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleFavourite(e, match.id)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isFavourite
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'bg-[#1f2029] border-[#2c2e3a] text-gray-400 hover:text-white'
              }`}
              title="Bookmark match"
            >
              <Star className={`w-4 h-4 ${isFavourite ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#1f2029] hover:bg-[#2a2c3a] border border-[#2c2e3a] text-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Scoreboard Hero */}
        <div className="p-6 bg-gradient-to-b from-[#171821] to-[#121319] border-b border-[#232530] shrink-0">
          <div className="grid grid-cols-7 items-center gap-2">
            {/* Home Team */}
            <div className="col-span-3 flex flex-col items-center sm:items-end text-center sm:text-right">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-2 shadow-lg border border-white/10"
                style={{ backgroundColor: `${match.homeTeam.color}33`, color: match.homeTeam.color }}
              >
                {match.homeTeam.logo || match.homeTeam.name.slice(0, 2)}
              </div>
              <h2 className="text-base sm:text-xl font-black text-white">{match.homeTeam.name}</h2>
              {match.homeTeam.leaguePosition && (
                <span className="text-[11px] text-gray-400 font-medium">
                  {match.homeTeam.leaguePosition}th in League
                </span>
              )}
            </div>

            {/* Score & Match Status */}
            <div className="col-span-1 flex flex-col items-center justify-center text-center">
              {match.status === 'NOT_STARTED' ? (
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-black text-white tabular-nums px-3 py-1 bg-[#1f212c] rounded-xl border border-[#2c2f3d]">
                    {match.time}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Kickoff</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 text-2xl sm:text-4xl font-black text-white tabular-nums tracking-wider">
                    <span>{match.homeScore}</span>
                    <span className="text-gray-500">-</span>
                    <span>{match.awayScore}</span>
                  </div>

                  {isLive ? (
                    <div className="flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-[#ee4036]/20 border border-[#ee4036]/40">
                      <span className="w-2 h-2 rounded-full bg-[#ee4036] animate-pulse" />
                      <span className="text-xs font-black text-[#ff5544] tabular-nums">
                        {match.minute}&apos;
                        {match.addedTime ? `+${match.addedTime}` : ''}
                      </span>
                    </div>
                  ) : match.status === 'HALF_TIME' ? (
                    <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 mt-1">
                      HALF TIME
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-gray-300 px-2 py-0.5 rounded bg-gray-700/30 border border-gray-600/30 mt-1">
                      FULL TIME
                    </span>
                  )}
                  {match.halfTimeScore && (
                    <span className="text-[10px] text-gray-400 font-medium mt-1">
                      HT: {match.halfTimeScore.home} - {match.halfTimeScore.away}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="col-span-3 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-2 shadow-lg border border-white/10"
                style={{ backgroundColor: `${match.awayTeam.color}33`, color: match.awayTeam.color }}
              >
                {match.awayTeam.logo || match.awayTeam.name.slice(0, 2)}
              </div>
              <h2 className="text-base sm:text-xl font-black text-white">{match.awayTeam.name}</h2>
              {match.awayTeam.leaguePosition && (
                <span className="text-[11px] text-gray-400 font-medium">
                  {match.awayTeam.leaguePosition}th in League
                </span>
              )}
            </div>
          </div>

          {/* Venue & Referee Meta */}
          <div className="mt-4 pt-3 border-t border-[#232530] flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
            {match.venue && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                <span>{match.venue}</span>
              </div>
            )}
            {match.referee && (
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-gray-500" />
                <span>Referee: {match.referee}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 bg-[#14151c] border-b border-[#232530] overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'timeline', label: 'Timeline' },
            { id: 'stats', label: 'Stats' },
            { id: 'lineups', label: 'Lineups' },
            { id: 'commentary', label: 'Commentary' },
            { id: 'h2h', label: 'H2H' },
            { id: 'prediction', label: 'AI Predict' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#ee4036] text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* TAB 1: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {match.events.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs">
                  No major match events recorded yet. Kickoff countdown underway.
                </div>
              ) : (
                <div className="relative border-l border-[#2c2f3d] ml-4 sm:ml-8 pl-4 sm:pl-6 space-y-4 py-2">
                  {match.events.map((event) => {
                    const isHome = event.team === 'home';
                    return (
                      <div key={event.id} className="relative flex items-start gap-3">
                        {/* Dot indicator on timeline */}
                        <div
                          className={`absolute -left-[27px] sm:-left-[35px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-[#111217] shadow ${
                            event.type === 'goal'
                              ? 'bg-emerald-500 text-white'
                              : event.type === 'yellow_card'
                              ? 'bg-amber-400 text-black'
                              : event.type === 'red_card'
                              ? 'bg-red-600 text-white'
                              : event.type === 'var'
                              ? 'bg-purple-600 text-white'
                              : 'bg-blue-500 text-white'
                          }`}
                        >
                          {event.type === 'goal' && '⚽'}
                          {event.type === 'yellow_card' && '🟨'}
                          {event.type === 'red_card' && '🟥'}
                          {event.type === 'var' && 'VAR'}
                          {event.type === 'substitution' && '🔄'}
                        </div>

                        {/* Event Card */}
                        <div className="flex-1 bg-[#181920] border border-[#262833] rounded-xl p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-orange-400 tabular-nums">
                                {event.minute}&apos;
                              </span>
                              <span className="text-xs font-bold text-white">
                                {event.player}
                              </span>
                              <span className="text-[10px] text-gray-400 font-medium">
                                ({isHome ? match.homeTeam.name : match.awayTeam.name})
                              </span>
                            </div>

                            {event.scoreAfter && (
                              <span className="text-xs font-black text-emerald-400 tabular-nums bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                                {event.scoreAfter.home} - {event.scoreAfter.away}
                              </span>
                            )}
                          </div>

                          {event.assist && (
                            <div className="text-[11px] text-gray-400 mt-1">
                              Assist: <span className="text-gray-300 font-medium">{event.assist}</span>
                            </div>
                          )}

                          {event.playerOut && (
                            <div className="text-[11px] text-gray-400 mt-1">
                              Off: <span className="text-gray-400 line-through">{event.playerOut}</span>
                            </div>
                          )}

                          {event.description && (
                            <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STATISTICS */}
          {activeTab === 'stats' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              {/* Possession Breakdown */}
              <div className="bg-[#181920] border border-[#262833] rounded-xl p-4">
                <div className="flex items-center justify-between text-xs font-black text-white mb-2">
                  <span className="tabular-nums text-sm">{match.stats.possession.home}%</span>
                  <span className="text-xs uppercase tracking-wider text-gray-400">Ball Possession</span>
                  <span className="tabular-nums text-sm">{match.stats.possession.away}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#232530] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${match.stats.possession.home}%` }}
                  />
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${match.stats.possession.away}%` }}
                  />
                </div>
              </div>

              {/* Stats Bar List */}
              <div className="bg-[#181920] border border-[#262833] rounded-xl p-4 divide-y divide-[#232530]">
                {[
                  { label: 'Expected Goals (xG)', home: match.stats.expectedGoals.home, away: match.stats.expectedGoals.away, isFloat: true },
                  { label: 'Total Shots', home: match.stats.totalShots.home, away: match.stats.totalShots.away },
                  { label: 'Shots on Target', home: match.stats.shotsOnTarget.home, away: match.stats.shotsOnTarget.away },
                  { label: 'Shots off Target', home: match.stats.shotsOffTarget.home, away: match.stats.shotsOffTarget.away },
                  { label: 'Blocked Shots', home: match.stats.blockedShots.home, away: match.stats.blockedShots.away },
                  { label: 'Corner Kicks', home: match.stats.corners.home, away: match.stats.corners.away },
                  { label: 'Fouls', home: match.stats.fouls.home, away: match.stats.fouls.away },
                  { label: 'Offsides', home: match.stats.offsides.home, away: match.stats.offsides.away },
                  { label: 'Yellow Cards', home: match.stats.yellowCards.home, away: match.stats.yellowCards.away },
                  { label: 'Red Cards', home: match.stats.redCards.home, away: match.stats.redCards.away },
                  { label: 'Goalkeeper Saves', home: match.stats.goalkeeperSaves.home, away: match.stats.goalkeeperSaves.away },
                  { label: 'Passes', home: match.stats.passes.home, away: match.stats.passes.away },
                  { label: 'Pass Accuracy', home: `${match.stats.passAccuracy.home}%`, away: `${match.stats.passAccuracy.away}%`, isRaw: true },
                  { label: 'Dangerous Attacks', home: match.stats.dangerousAttacks.home, away: match.stats.dangerousAttacks.away },
                ].map((stat, idx) => {
                  const hNum = typeof stat.home === 'number' ? stat.home : 0;
                  const aNum = typeof stat.away === 'number' ? stat.away : 0;
                  const total = hNum + aNum || 1;
                  const hWidth = Math.round((hNum / total) * 100);

                  return (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-300 mb-1">
                        <span className="tabular-nums font-black text-white">{stat.home}</span>
                        <span className="text-[11px] text-gray-400 font-medium">{stat.label}</span>
                        <span className="tabular-nums font-black text-white">{stat.away}</span>
                      </div>
                      {!stat.isRaw && (
                        <div className="w-full h-1.5 bg-[#232530] rounded-full overflow-hidden flex">
                          <div
                            className="h-full bg-emerald-500 rounded-l-full transition-all duration-300"
                            style={{ width: `${hWidth}%` }}
                          />
                          <div
                            className="h-full bg-blue-500 rounded-r-full transition-all duration-300"
                            style={{ width: `${100 - hWidth}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LINEUPS (Tactical Field Diagram) */}
          {activeTab === 'lineups' && (
            <div className="space-y-6">
              {match.lineups ? (
                <div>
                  {/* Pitch Header */}
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div>
                      <span className="font-bold text-white">{match.homeTeam.name}</span>
                      <span className="text-gray-400 ml-2">({match.lineups.home.formation})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 mr-2">({match.lineups.away.formation})</span>
                      <span className="font-bold text-white">{match.awayTeam.name}</span>
                    </div>
                  </div>

                  {/* Football Pitch Graphic */}
                  <div className="relative w-full h-96 bg-gradient-to-b from-[#1b4332] via-[#2d6a4f] to-[#1b4332] rounded-2xl border-2 border-emerald-900 overflow-hidden shadow-inner flex flex-col justify-between p-4">
                    {/* Pitch markings: white lines */}
                    <div className="absolute inset-2 border border-white/20 rounded pointer-events-none" />
                    <div className="absolute top-1/2 left-2 right-2 h-[1px] bg-white/20 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/20 rounded-full pointer-events-none" />
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-40 h-16 border-b border-l border-r border-white/20 pointer-events-none" />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-16 border-t border-l border-r border-white/20 pointer-events-none" />

                    {/* Home Team (Top half of pitch) */}
                    <div className="relative z-10 grid grid-cols-5 gap-1 text-center">
                      {match.lineups.home.startingXI.slice(0, 11).map((p) => (
                        <div key={p.id} className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white text-white font-extrabold text-xs flex items-center justify-center shadow-md tabular-nums">
                            {p.number}
                          </div>
                          <span className="text-[10px] font-bold text-white drop-shadow mt-0.5 truncate max-w-[70px]">
                            {p.name}
                          </span>
                          {p.rating && (
                            <span className="text-[9px] font-bold text-emerald-300 bg-black/60 px-1 rounded tabular-nums">
                              {p.rating}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Away Team (Bottom half of pitch) */}
                    <div className="relative z-10 grid grid-cols-5 gap-1 text-center">
                      {match.lineups.away.startingXI.slice(0, 11).map((p) => (
                        <div key={p.id} className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white text-white font-extrabold text-xs flex items-center justify-center shadow-md tabular-nums">
                            {p.number}
                          </div>
                          <span className="text-[10px] font-bold text-white drop-shadow mt-0.5 truncate max-w-[70px]">
                            {p.name}
                          </span>
                          {p.rating && (
                            <span className="text-[9px] font-bold text-emerald-300 bg-black/60 px-1 rounded tabular-nums">
                              {p.rating}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bench / Substitutes List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-[#181920] border border-[#262833] rounded-xl p-4">
                      <h4 className="text-xs font-bold text-gray-300 mb-2 flex items-center justify-between">
                        <span>{match.homeTeam.name} Bench</span>
                        <span className="text-gray-500 font-normal">Mgr: {match.lineups.home.manager}</span>
                      </h4>
                      <div className="space-y-1.5">
                        {match.lineups.home.substitutes.map((s) => (
                          <div key={s.id} className="flex items-center justify-between text-xs py-1 border-b border-[#232530] last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="w-5 text-gray-400 font-mono text-[11px]">{s.number}</span>
                              <span className="text-gray-200">{s.name}</span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-bold">{s.position}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#181920] border border-[#262833] rounded-xl p-4">
                      <h4 className="text-xs font-bold text-gray-300 mb-2 flex items-center justify-between">
                        <span>{match.awayTeam.name} Bench</span>
                        <span className="text-gray-500 font-normal">Mgr: {match.lineups.away.manager}</span>
                      </h4>
                      <div className="space-y-1.5">
                        {match.lineups.away.substitutes.map((s) => (
                          <div key={s.id} className="flex items-center justify-between text-xs py-1 border-b border-[#232530] last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="w-5 text-gray-400 font-mono text-[11px]">{s.number}</span>
                              <span className="text-gray-200">{s.name}</span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-bold">{s.position}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 text-xs">
                  Lineups are typically confirmed 60 minutes before kickoff.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMMENTARY */}
          {activeTab === 'commentary' && (
            <div className="space-y-3">
              {match.commentary.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs">
                  Live commentary stream starts at kickoff.
                </div>
              ) : (
                match.commentary.map((c, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                      c.isImportant
                        ? 'bg-[#1e1c18] border-amber-600/30'
                        : 'bg-[#181920] border-[#262833]'
                    }`}
                  >
                    <span className="px-2 py-0.5 rounded bg-[#272935] text-xs font-black text-orange-400 tabular-nums shrink-0">
                      {c.minute}&apos;
                    </span>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: H2H (HEAD-TO-HEAD) */}
          {activeTab === 'h2h' && (
            <div className="space-y-6">
              {match.h2h ? (
                <div>
                  {/* H2H Win-Draw-Loss Bar */}
                  <div className="bg-[#181920] border border-[#262833] rounded-xl p-4 mb-4">
                    <h4 className="text-xs font-bold text-gray-300 text-center mb-3">
                      Historical Head-to-Head Record
                    </h4>
                    <div className="flex items-center justify-between text-xs font-black mb-1.5">
                      <span className="text-emerald-400">{match.homeTeam.shortName}: {match.h2h.homeWins} Wins</span>
                      <span className="text-gray-400">{match.h2h.draws} Draws</span>
                      <span className="text-blue-400">{match.awayTeam.shortName}: {match.h2h.awayWins} Wins</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#252834] rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: '35%' }} />
                      <div className="bg-gray-500 h-full" style={{ width: '25%' }} />
                      <div className="bg-blue-500 h-full" style={{ width: '40%' }} />
                    </div>
                  </div>

                  {/* Previous Match List */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 px-1">Previous Encounters</h4>
                    {match.h2h.previousMatches.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-3 bg-[#181920] border border-[#262833] rounded-xl text-xs"
                      >
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="tabular-nums">{m.date}</span>
                          <span>·</span>
                          <span className="text-gray-300 font-medium">{m.competition}</span>
                        </div>
                        <div className="flex items-center gap-3 font-bold text-white">
                          <span>{m.homeTeam}</span>
                          <span className="px-2 py-0.5 rounded bg-[#232530] text-emerald-400 tabular-nums">
                            {m.homeScore} - {m.awayScore}
                          </span>
                          <span>{m.awayTeam}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400 text-xs">
                  No previous competitive encounters between these clubs.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: AI PREDICTIONS & ODDS */}
          {activeTab === 'prediction' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="bg-gradient-to-r from-orange-950/30 to-purple-950/30 border border-orange-500/30 rounded-xl p-5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Match Probability Engine</span>
                </div>

                {match.aiPrediction ? (
                  <div>
                    {/* Probability bars */}
                    <div className="grid grid-cols-3 gap-2 text-center my-4">
                      <div className="p-3 bg-[#161720] rounded-xl border border-[#2b2d3c]">
                        <span className="text-xs text-gray-400 block">{match.homeTeam.shortName}</span>
                        <span className="text-xl font-black text-emerald-400 tabular-nums">
                          {match.aiPrediction.homeWinProb}%
                        </span>
                      </div>
                      <div className="p-3 bg-[#161720] rounded-xl border border-[#2b2d3c]">
                        <span className="text-xs text-gray-400 block">Draw</span>
                        <span className="text-xl font-black text-amber-400 tabular-nums">
                          {match.aiPrediction.drawProb}%
                        </span>
                      </div>
                      <div className="p-3 bg-[#161720] rounded-xl border border-[#2b2d3c]">
                        <span className="text-xs text-gray-400 block">{match.awayTeam.shortName}</span>
                        <span className="text-xl font-black text-blue-400 tabular-nums">
                          {match.aiPrediction.awayWinProb}%
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#12131a] p-3 rounded-lg border border-[#232532] text-xs text-gray-300 leading-relaxed">
                      <span className="font-bold text-white block mb-1">
                        Predicted Scoreline: {match.aiPrediction.predictedScore}
                      </span>
                      {match.aiPrediction.analysis}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-300">
                    Calculated probabilities indicate high tactical variance based on recent team form.
                  </p>
                )}

                {/* Betting Odds */}
                {match.odds && (
                  <div className="mt-4 pt-4 border-t border-orange-500/20">
                    <span className="text-[11px] font-semibold text-gray-400 block mb-2">
                      Live Odds (Decimal)
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center font-bold text-xs">
                      <div className="bg-[#181922] py-2 rounded border border-[#282a38] text-white">
                        1: {match.odds.homeWin}
                      </div>
                      <div className="bg-[#181922] py-2 rounded border border-[#282a38] text-white">
                        X: {match.odds.draw}
                      </div>
                      <div className="bg-[#181922] py-2 rounded border border-[#282a38] text-white">
                        2: {match.odds.awayWin}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
