import React from 'react';
import { X, Star, Trophy, MapPin, Calendar, Users } from 'lucide-react';
import { TEAMS, PLAYERS, INITIAL_MATCHES } from '../data/mockSportsData';
import { Team, Match } from '../types/sports';

interface TeamDetailModalProps {
  teamId: string | null;
  onClose: () => void;
  isFavourite: boolean;
  onToggleFavourite: (teamId: string) => void;
  onSelectPlayer: (playerId: string) => void;
  onSelectMatch: (match: Match) => void;
}

export const TeamDetailModal: React.FC<TeamDetailModalProps> = ({
  teamId,
  onClose,
  isFavourite,
  onToggleFavourite,
  onSelectPlayer,
  onSelectMatch,
}) => {
  if (!teamId) return null;
  const team = TEAMS[teamId];
  if (!team) return null;

  const teamPlayers = PLAYERS.filter((p) => p.teamId === team.id);
  const teamMatches = INITIAL_MATCHES.filter(
    (m) => m.homeTeam.id === team.id || m.awayTeam.id === team.id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#121319] border border-[#272935] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#1c1d27] to-[#121319] border-b border-[#232530] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg border border-white/10"
              style={{ backgroundColor: `${team.color}33`, color: team.color }}
            >
              {team.logo || team.code}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{team.name}</h2>
                <span className="text-xs text-gray-400 font-mono">({team.code})</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                <span>{team.country}</span>
                {team.stadium && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {team.stadium}
                    </span>
                  </>
                )}
                {team.founded && (
                  <>
                    <span>·</span>
                    <span>Est. {team.founded}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavourite(team.id)}
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Form and Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#181922] border border-[#242633] rounded-xl text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                League Table Rank
              </span>
              <span className="text-xl font-black text-white">
                {team.leaguePosition ? `#${team.leaguePosition}` : 'Top Tier'}
              </span>
            </div>

            <div className="p-3 bg-[#181922] border border-[#242633] rounded-xl text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                Recent Form
              </span>
              <div className="flex items-center justify-center gap-1 mt-1">
                {(team.recentForm || ['W', 'D', 'W', 'W']).map((f, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                      f === 'W'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : f === 'D'
                        ? 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#181922] border border-[#242633] rounded-xl text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                Sport
              </span>
              <span className="text-base font-extrabold text-white capitalize">
                {team.sport}
              </span>
            </div>
          </div>

          {/* Matches */}
          <div>
            <h4 className="text-xs font-bold text-gray-300 mb-3 uppercase tracking-wider">
              Fixtures & Results
            </h4>
            <div className="space-y-2">
              {teamMatches.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    onSelectMatch(m);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#171821] hover:bg-[#20222e] border border-[#242633] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-[11px] font-bold text-gray-300">{m.competitionName}</span>
                    <span>·</span>
                    <span>{m.date}</span>
                  </div>
                  <div className="flex items-center gap-3 font-bold text-white">
                    <span>{m.homeTeam.shortName}</span>
                    <span className="px-2 py-0.5 rounded bg-black/40 text-emerald-400">
                      {m.status === 'NOT_STARTED' ? m.time : `${m.homeScore} - ${m.awayScore}`}
                    </span>
                    <span>{m.awayTeam.shortName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Squad Players */}
          {teamPlayers.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-300 mb-3 uppercase tracking-wider flex items-center justify-between">
                <span>Featured Squad Stars</span>
                <span className="text-gray-500 font-normal">Click player for profile</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {teamPlayers.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectPlayer(p.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#171821] hover:bg-[#20222e] border border-[#242633] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-center font-bold text-gray-500">#{p.shirtNumber}</span>
                      <div>
                        <div className="font-bold text-white group-hover:text-orange-400 transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-gray-400">{p.position}</div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-400">
                      {p.goals} G · {p.assists} A
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
