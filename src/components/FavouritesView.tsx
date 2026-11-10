import React from 'react';
import { TEAMS, INITIAL_MATCHES } from '../data/mockSportsData';
import { Match, Team } from '../types/sports';
import { Star, Bell, Plus, ShieldCheck, Check } from 'lucide-react';
import { MatchCard } from './MatchCard';

interface FavouritesViewProps {
  favouriteTeams: string[];
  favouriteMatches: string[];
  onToggleFavouriteTeam: (teamId: string) => void;
  onToggleFavouriteMatch: (e: React.MouseEvent, matchId: string) => void;
  onSelectMatch: (match: Match) => void;
  onSelectTeam: (teamId: string) => void;
  onOpenNotifications: () => void;
}

export const FavouritesView: React.FC<FavouritesViewProps> = ({
  favouriteTeams,
  favouriteMatches,
  onToggleFavouriteTeam,
  onToggleFavouriteMatch,
  onSelectMatch,
  onSelectTeam,
  onOpenNotifications,
}) => {
  const [subTab, setSubTab] = React.useState<'matches' | 'competitions' | 'teams'>('teams');

  // Featured teams matching Screenshot 2 badges
  const featuredTeamsList: { id: string; name: string; bg: string; badge: string; color: string }[] = [
    { id: 'roma', name: 'Roma', bg: '#991b1b', badge: '🐺', color: '#f59e0b' },
    { id: 'norwich', name: 'Norwich City', bg: '#eab308', badge: '🐥', color: '#15803d' },
    { id: 'napoli', name: 'Napoli', bg: '#0284c7', badge: 'N', color: '#ffffff' },
    { id: 'mancity', name: 'Man City', bg: '#38bdf8', badge: 'MCI', color: '#1e293b' },
    { id: 'arsenal', name: 'Arsenal', bg: '#ef4444', badge: '🔴', color: '#ffffff' },
    { id: 'tottenham', name: 'Tottenham', bg: '#1e293b', badge: '🐓', color: '#ffffff' },
  ];

  // Matches for favourite teams
  const favMatchesList = INITIAL_MATCHES.filter(
    (m) =>
      favouriteMatches.includes(m.id) ||
      favouriteTeams.includes(m.homeTeam.id) ||
      favouriteTeams.includes(m.awayTeam.id)
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Sub-nav Tabs (matching screenshot 2: Matches | Competitions | Teams) */}
      <div className="flex items-center gap-6 border-b border-[#232530] pb-2 text-sm font-bold">
        <button
          onClick={() => setSubTab('matches')}
          className={`transition-colors cursor-pointer pb-2 relative ${
            subTab === 'matches' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Matches
          {subTab === 'matches' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ee4036]" />
          )}
        </button>

        <button
          onClick={() => setSubTab('competitions')}
          className={`transition-colors cursor-pointer pb-2 relative ${
            subTab === 'competitions' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Competitions
          {subTab === 'competitions' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ee4036]" />
          )}
        </button>

        <button
          onClick={() => setSubTab('teams')}
          className={`transition-colors cursor-pointer pb-2 relative ${
            subTab === 'teams' ? 'text-[#ff5544]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Teams
          {subTab === 'teams' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ee4036]" />
          )}
        </button>
      </div>

      {/* Featured Favorite Badges Showcase (matching Screenshot 2) */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 py-6 overflow-x-auto no-scrollbar">
        {featuredTeamsList.map((t) => {
          const isFav = favouriteTeams.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={() => onToggleFavouriteTeam(t.id)}
              className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none shrink-0"
              title={`${isFav ? 'Remove' : 'Add'} ${t.name} from favourites`}
            >
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black shadow-lg transition-transform group-hover:scale-105 relative border border-white/10"
                style={{ backgroundColor: t.bg, color: t.color }}
              >
                {t.badge}
                {isFav && (
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs shadow">
                    ★
                  </div>
                )}
              </div>
              <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                {t.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* "Never miss a moment" Banner (matching Screenshot 2) */}
      <div className="bg-[#14151a] border border-[#23252d] rounded-2xl p-6 sm:p-8 text-center max-w-xl mx-auto shadow-xl">
        <h3 className="text-lg sm:text-xl font-black text-white mb-2">
          Never miss a moment
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
          Get instantly notified about news, line-ups and scores from your favourite teams by customizing your alert preferences.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenNotifications}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#0077ff] hover:bg-[#0066ee] text-white text-xs font-black shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            Notification Settings
          </button>
        </div>
      </div>

      {/* Favourite Content Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-white">
            {subTab === 'teams'
              ? 'Your Tracked Teams'
              : subTab === 'matches'
              ? 'Bookmarked Matches'
              : 'Favourite Competitions'}
          </h3>
          <span className="text-xs text-gray-400">
            {favouriteTeams.length} teams tracked
          </span>
        </div>

        {subTab === 'teams' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(TEAMS)
              .filter((t) => favouriteTeams.includes(t.id))
              .map((team) => (
                <div
                  key={team.id}
                  onClick={() => onSelectTeam(team.id)}
                  className="bg-[#14151b] border border-[#22242c] hover:border-[#383a48] rounded-xl p-4 flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border border-white/10"
                      style={{ backgroundColor: `${team.color}33`, color: team.color }}
                    >
                      {team.logo}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                        {team.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {team.country} · {team.stadium || 'Home Ground'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavouriteTeam(team.id);
                    }}
                    className="p-1.5 text-amber-400 hover:text-gray-400 transition-colors"
                    title="Remove from favourites"
                  >
                    <Star className="w-5 h-5 fill-amber-400" />
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Matches Section for Favourites */}
        {(subTab === 'matches' || favMatchesList.length > 0) && (
          <div className="bg-[#14151a] border border-[#22242c] rounded-xl overflow-hidden mt-4">
            <div className="px-4 py-2.5 bg-[#171820] border-b border-[#22242c] text-xs font-bold text-gray-300">
              Live & Upcoming for Your Favourites
            </div>
            <div className="divide-y divide-[#20222a]">
              {favMatchesList.map((m) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  isFavourite={favouriteMatches.includes(m.id)}
                  onToggleFavourite={onToggleFavouriteMatch}
                  onSelectMatch={onSelectMatch}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
