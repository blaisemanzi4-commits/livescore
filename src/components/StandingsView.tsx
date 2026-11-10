import React from 'react';
import { STANDINGS, PLAYERS } from '../data/mockSportsData';
import { Trophy, ChevronRight } from 'lucide-react';

interface StandingsViewProps {
  onSelectTeam?: (teamId: string) => void;
  onSelectPlayer?: (playerId: string) => void;
}

export const StandingsView: React.FC<StandingsViewProps> = ({
  onSelectTeam,
  onSelectPlayer,
}) => {
  const [activeLeague, setActiveLeague] = React.useState<'epl' | 'laliga' | 'serie-a'>('epl');

  const leagues = [
    { id: 'epl', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 'laliga', name: 'LaLiga', flag: '🇪🇸' },
    { id: 'serie-a', name: 'Serie A', flag: '🇮🇹' },
  ];

  const currentTable = STANDINGS[activeLeague] || [];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* League Selection Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#232530]">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-black text-white">League Tables & Standings</h2>
        </div>

        <div className="flex items-center gap-1.5 bg-[#181920] p-1 rounded-xl border border-[#2a2c38]">
          {leagues.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLeague(l.id as typeof activeLeague)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLeague === l.id
                  ? 'bg-white text-black shadow'
                  : 'text-gray-400 hover:text-white hover:bg-[#22242e]'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table Column (2 cols) */}
        <div className="lg:col-span-2 bg-[#14151b] border border-[#22242c] rounded-2xl overflow-hidden shadow-lg">
          <div className="px-5 py-3.5 bg-[#181922] border-b border-[#22242c] flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              {leagues.find((l) => l.id === activeLeague)?.name} Regular Season
            </span>
            <span className="text-[11px] text-gray-400">Matchday 11 of 38</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#22242c] text-gray-400 font-bold bg-[#14151b]">
                  <th className="py-3 px-3 text-center w-10">#</th>
                  <th className="py-3 px-3">Team</th>
                  <th className="py-3 px-2 text-center">P</th>
                  <th className="py-3 px-2 text-center">W</th>
                  <th className="py-3 px-2 text-center">D</th>
                  <th className="py-3 px-2 text-center">L</th>
                  <th className="py-3 px-2 text-center hidden sm:table-cell">F</th>
                  <th className="py-3 px-2 text-center hidden sm:table-cell">A</th>
                  <th className="py-3 px-2 text-center">GD</th>
                  <th className="py-3 px-3 text-center font-black text-white">PTS</th>
                  <th className="py-3 px-3 text-center hidden md:table-cell">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20222a]">
                {currentTable.map((row) => {
                  const isTop4 = row.position <= 4;
                  const isUCL = row.statusZone === 'champions_league';
                  const isUEL = row.statusZone === 'europa_league';

                  return (
                    <tr
                      key={row.team.id}
                      onClick={() => onSelectTeam && onSelectTeam(row.team.id)}
                      className="hover:bg-[#1a1b23] transition-colors cursor-pointer group"
                    >
                      {/* Position with qualification color indicator */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span
                            className={`w-1 h-3.5 rounded-full ${
                              isUCL
                                ? 'bg-blue-500'
                                : isUEL
                                ? 'bg-amber-500'
                                : 'bg-transparent'
                            }`}
                          />
                          <span className="font-bold text-gray-300 tabular-nums">
                            {row.position}
                          </span>
                        </div>
                      </td>

                      {/* Team Logo & Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold border border-white/10"
                            style={{ backgroundColor: `${row.team.color}33`, color: row.team.color }}
                          >
                            {row.team.logo}
                          </div>
                          <span className="font-bold text-white group-hover:text-orange-400 transition-colors">
                            {row.team.name}
                          </span>
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="py-3 px-2 text-center text-gray-300 tabular-nums">{row.played}</td>
                      <td className="py-3 px-2 text-center text-gray-300 tabular-nums">{row.won}</td>
                      <td className="py-3 px-2 text-center text-gray-400 tabular-nums">{row.drawn}</td>
                      <td className="py-3 px-2 text-center text-gray-400 tabular-nums">{row.lost}</td>
                      <td className="py-3 px-2 text-center text-gray-400 tabular-nums hidden sm:table-cell">{row.goalsFor}</td>
                      <td className="py-3 px-2 text-center text-gray-400 tabular-nums hidden sm:table-cell">{row.goalsAgainst}</td>
                      <td className="py-3 px-2 text-center font-semibold text-gray-200 tabular-nums">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="py-3 px-3 text-center font-black text-base text-white tabular-nums bg-white/5">
                        {row.points}
                      </td>

                      {/* Form pills */}
                      <td className="py-3 px-3 text-center hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {row.form.map((f, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${
                                f === 'W'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : f === 'D'
                                  ? 'bg-gray-600/20 text-gray-400 border border-gray-600/40'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
                              }`}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Legend */}
          <div className="px-5 py-3 bg-[#181922] border-t border-[#22242c] flex flex-wrap items-center gap-4 text-[11px] text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>UEFA Champions League</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>UEFA Europa League</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Relegation Zone</span>
            </div>
          </div>
        </div>

        {/* Top Scorers & Golden Boot Widget */}
        <div className="space-y-4">
          <div className="bg-[#14151b] border border-[#22242c] rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-black text-white mb-3 flex items-center justify-between">
              <span>Top Goalscorers</span>
              <span className="text-xs text-orange-400 font-semibold">2026/27</span>
            </h3>

            <div className="space-y-3">
              {PLAYERS.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => onSelectPlayer && onSelectPlayer(p.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#191a22] hover:bg-[#22242f] border border-[#262834] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center font-black text-gray-400 text-xs tabular-nums">
                      {idx + 1}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center font-bold text-xs text-white">
                      {p.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {p.teamName} · {p.position}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-white tabular-nums block">
                      {p.goals} <span className="text-[10px] font-normal text-gray-400">goals</span>
                    </span>
                    <span className="text-[10px] text-gray-400 tabular-nums">
                      {p.assists} assists
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
