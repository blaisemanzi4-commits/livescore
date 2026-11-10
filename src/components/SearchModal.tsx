import React from 'react';
import { Search, X, Trophy, Users, Shield } from 'lucide-react';
import { TEAMS, PLAYERS, COMPETITIONS } from '../data/mockSportsData';
import { Team, Player, Competition } from '../types/sports';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam: (teamId: string) => void;
  onSelectPlayer: (playerId: string) => void;
  onSelectCompetition: (compId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTeam,
  onSelectPlayer,
  onSelectCompetition,
}) => {
  const [query, setQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'teams' | 'competitions' | 'players'>('all');

  if (!isOpen) return null;

  const filteredTeams = Object.values(TEAMS).filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.code.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPlayers = PLAYERS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.teamName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCompetitions = COMPETITIONS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.country.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#14151b] border border-[#272935] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#232530] bg-[#181922]">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, players or competitions..."
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs text-gray-400 hover:text-white bg-[#22242e] rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills (matching screenshot 1: Teams | Competitions | Players) */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#232530] bg-[#161720]">
          {(['all', 'teams', 'competitions', 'players'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#1f212a] hover:bg-[#282a36] text-gray-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Teams */}
          {(activeFilter === 'all' || activeFilter === 'teams') && filteredTeams.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Teams</span>
              </div>
              <div className="space-y-1">
                {filteredTeams.slice(0, 5).map((team) => (
                  <button
                    key={team.id}
                    onClick={() => {
                      onSelectTeam(team.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1f212c] transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: `${team.color}33`, color: team.color }}
                      >
                        {team.logo}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                          {team.name}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {team.country} · {team.sport}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{team.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Players */}
          {(activeFilter === 'all' || activeFilter === 'players') && filteredPlayers.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Players</span>
              </div>
              <div className="space-y-1">
                {filteredPlayers.slice(0, 5).map((player) => (
                  <button
                    key={player.id}
                    onClick={() => {
                      onSelectPlayer(player.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1f212c] transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                        {player.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                          {player.name}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {player.teamName} · #{player.shirtNumber} {player.position}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold">{player.goals} Goals</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Competitions */}
          {(activeFilter === 'all' || activeFilter === 'competitions') && filteredCompetitions.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>Competitions</span>
              </div>
              <div className="space-y-1">
                {filteredCompetitions.slice(0, 5).map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      onSelectCompetition(comp.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1f212c] transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{comp.flag || '🏆'}</span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                          {comp.name}
                        </div>
                        <div className="text-[10px] text-gray-400">{comp.country}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredTeams.length === 0 && filteredPlayers.length === 0 && filteredCompetitions.length === 0 && (
            <div className="text-center py-8 text-xs text-gray-400">
              No results found for &quot;{query}&quot;. Try searching for Arsenal, Haaland, or Champions League.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
