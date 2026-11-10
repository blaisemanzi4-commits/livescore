/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from './components/Header';
import { SportsBar } from './components/SportsBar';
import { DateNavigator } from './components/DateNavigator';
import { MatchList } from './components/MatchList';
import { RightSidebar } from './components/RightSidebar';
import { MatchDetailModal } from './components/MatchDetailModal';
import { StandingsView } from './components/StandingsView';
import { NewsView } from './components/NewsView';
import { FavouritesView } from './components/FavouritesView';
import { SearchModal } from './components/SearchModal';
import { TeamDetailModal } from './components/TeamDetailModal';
import { PlayerDetailModal } from './components/PlayerDetailModal';
import { NotificationsModal } from './components/NotificationsModal';
import { NotificationToast, AlertMessage } from './components/NotificationToast';
import { LiveSimulationController } from './components/LiveSimulationController';
import { ApiProvidersModal } from './components/ApiProvidersModal';
import { Footer } from './components/Footer';
import { INITIAL_MATCHES, COMPETITIONS, NEWS_ARTICLES, TEAMS, PLAYERS } from './data/mockSportsData';
import { Match, SportType, NewsArticle } from './types/sports';
import { soundEffects } from './utils/audio';
import { fetchLiveFixtures } from './services/sportsApi';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = React.useState<boolean>(true);

  // Primary Navigation
  const [activeTab, setActiveTab] = React.useState<'scores' | 'news' | 'favourites' | 'standings'>('scores');
  const [activeSport, setActiveSport] = React.useState<SportType>('football');
  const [selectedDate, setSelectedDate] = React.useState<string>('2026-11-10');
  const [isLiveOnly, setIsLiveOnly] = React.useState<boolean>(false);

  // Matches State
  const [matches, setMatches] = React.useState<Match[]>(() => {
    return INITIAL_MATCHES;
  });

  // Favourites in LocalStorage
  const [favouriteTeams, setFavouriteTeams] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ls_fav_teams');
      return saved ? JSON.parse(saved) : ['arsenal', 'mancity', 'roma', 'napoli'];
    } catch {
      return ['arsenal', 'mancity', 'roma', 'napoli'];
    }
  });

  const [favouriteMatches, setFavouriteMatches] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ls_fav_matches');
      return saved ? JSON.parse(saved) : ['match-arsenal-realmadrid'];
    } catch {
      return ['match-arsenal-realmadrid'];
    }
  });

  // Modals
  const [selectedMatch, setSelectedMatch] = React.useState<Match | null>(null);
  const [selectedTeamId, setSelectedTeamId] = React.useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = React.useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = React.useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState<boolean>(false);
  const [isApiModalOpen, setIsApiModalOpen] = React.useState<boolean>(false);

  // Live Toast Alerts
  const [alerts, setAlerts] = React.useState<AlertMessage[]>([]);

  // Live Simulation state
  const [isSimulating, setIsSimulating] = React.useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = React.useState<number>(1);

  // Sync Live API handler
  const handleSyncLiveApi = React.useCallback(async () => {
    try {
      const res = await fetchLiveFixtures();
      if (res.source === 'api-sports' && res.matches.length > 0) {
        setMatches((prev) => {
          const apiIds = new Set(res.matches.map((m) => m.id));
          const nonOverlapping = prev.filter((m) => !apiIds.has(m.id));
          return [...res.matches, ...nonOverlapping];
        });
        pushAlert({
          type: 'info',
          title: 'API-SPORTS SYNCED',
          subtitle: `Updated ${res.matches.length} live matches from API-Football!`,
        });
      }
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    handleSyncLiveApi();
  }, [handleSyncLiveApi]);

  // Save favourites
  React.useEffect(() => {
    try {
      localStorage.setItem('ls_fav_teams', JSON.stringify(favouriteTeams));
    } catch {
      // ignore
    }
  }, [favouriteTeams]);

  React.useEffect(() => {
    try {
      localStorage.setItem('ls_fav_matches', JSON.stringify(favouriteMatches));
    } catch {
      // ignore
    }
  }, [favouriteMatches]);

  // Sync theme with <html> class
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Keep selectedMatch updated with state changes
  React.useEffect(() => {
    if (selectedMatch) {
      const updated = matches.find((m) => m.id === selectedMatch.id);
      if (updated) setSelectedMatch(updated);
    }
  }, [matches, selectedMatch]);

  // Sport counts
  const sportCounts = React.useMemo(() => {
    const counts: Record<SportType, { total: number; live: number }> = {
      football: { total: 0, live: 0 },
      hockey: { total: 0, live: 0 },
      basketball: { total: 0, live: 0 },
      tennis: { total: 0, live: 0 },
      cricket: { total: 0, live: 0 },
    };

    matches.forEach((m) => {
      if (counts[m.sport]) {
        counts[m.sport].total += 1;
        if (m.status === 'LIVE') counts[m.sport].live += 1;
      }
    });

    return counts;
  }, [matches]);

  // Dismiss alert
  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const pushAlert = (alert: Omit<AlertMessage, 'id' | 'timestamp'>) => {
    const newAlert: AlertMessage = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random()}`,
      timestamp: 'Just now',
    };
    setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      dismissAlert(newAlert.id);
    }, 6000);
  };

  // Toggle favourite functions
  const toggleFavouriteTeam = (teamId: string) => {
    setFavouriteTeams((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  const toggleFavouriteMatch = (e: React.MouseEvent, matchId: string) => {
    e.stopPropagation();
    setFavouriteMatches((prev) =>
      prev.includes(matchId) ? prev.filter((id) => id !== matchId) : [...prev, matchId]
    );
  };

  // Filtered matches for scores view
  const visibleMatches = React.useMemo(() => {
    return matches.filter((m) => {
      // Filter by sport
      if (m.sport !== activeSport) return false;
      // Filter by LIVE
      if (isLiveOnly && m.status !== 'LIVE') return false;
      // Filter by date if not live-only
      if (!isLiveOnly && m.date !== selectedDate) return false;
      return true;
    });
  }, [matches, activeSport, isLiveOnly, selectedDate]);

  // Live Simulation Ticker
  React.useEffect(() => {
    if (!isSimulating) return;

    const intervalTime = Math.max(1000, 3500 / simulationSpeed);

    const interval = setInterval(() => {
      setMatches((prevMatches) => {
        return prevMatches.map((match) => {
          if (match.status !== 'LIVE' || typeof match.minute !== 'number') {
            return match;
          }

          // Advance minute
          const nextMinute = match.minute + 1;

          // Half-time logic for football
          if (match.sport === 'football' && nextMinute === 45 && match.status === 'LIVE') {
            soundEffects.playWhistle();
            pushAlert({
              type: 'whistle',
              title: 'HALF TIME',
              subtitle: `${match.homeTeam.name} ${match.homeScore} - ${match.awayScore} ${match.awayTeam.name}`,
              matchTitle: `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`,
            });
            return {
              ...match,
              status: 'HALF_TIME',
              minute: 45,
            };
          }

          // Full-time logic
          if (match.sport === 'football' && nextMinute >= 93) {
            soundEffects.playWhistle();
            pushAlert({
              type: 'whistle',
              title: 'FULL TIME',
              subtitle: `Match ended: ${match.homeTeam.name} ${match.homeScore} - ${match.awayScore} ${match.awayTeam.name}`,
              matchTitle: `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`,
            });
            return {
              ...match,
              status: 'FULL_TIME',
              minute: 90,
              addedTime: 3,
            };
          }

          // Random realistic match occurrence (chance ~10%)
          const roll = Math.random();
          if (roll < 0.12 && match.id === 'match-arsenal-realmadrid') {
            const isHomeGoal = roll < 0.06;
            const updatedHome = isHomeGoal ? match.homeScore + 1 : match.homeScore;
            const updatedAway = !isHomeGoal ? match.awayScore + 1 : match.awayScore;
            const scorer = isHomeGoal ? 'Martin Ødegaard' : 'Kylian Mbappé';

            soundEffects.playGoalCelebration();
            pushAlert({
              type: 'goal',
              title: '⚽ GOAL!',
              subtitle: `${scorer} scores for ${isHomeGoal ? match.homeTeam.name : match.awayTeam.name}!`,
              score: `${updatedHome} - ${updatedAway}`,
              matchTitle: `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`,
            });

            const newEvent = {
              id: `ev-${Date.now()}`,
              minute: nextMinute,
              type: 'goal' as const,
              team: (isHomeGoal ? 'home' : 'away') as 'home' | 'away',
              player: scorer,
              scoreAfter: { home: updatedHome, away: updatedAway },
              description: `Spectacular finish by ${scorer} from inside the penalty box!`,
            };

            return {
              ...match,
              minute: nextMinute,
              homeScore: updatedHome,
              awayScore: updatedAway,
              events: [newEvent, ...match.events],
              stats: {
                ...match.stats,
                totalShots: {
                  home: isHomeGoal ? match.stats.totalShots.home + 1 : match.stats.totalShots.home,
                  away: !isHomeGoal ? match.stats.totalShots.away + 1 : match.stats.totalShots.away,
                },
                shotsOnTarget: {
                  home: isHomeGoal ? match.stats.shotsOnTarget.home + 1 : match.stats.shotsOnTarget.home,
                  away: !isHomeGoal ? match.stats.shotsOnTarget.away + 1 : match.stats.shotsOnTarget.away,
                },
              },
              commentary: [
                {
                  minute: nextMinute,
                  text: `GOAL! ${scorer} strikes to make it ${updatedHome} - ${updatedAway}!`,
                  isImportant: true,
                  type: 'goal' as const,
                },
                ...match.commentary,
              ],
            };
          }

          return {
            ...match,
            minute: nextMinute,
          };
        });
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  // Manual Trigger: Goal
  const handleTriggerGoal = (team: 'home' | 'away') => {
    const targetMatchId = selectedMatch ? selectedMatch.id : 'match-arsenal-realmadrid';
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== targetMatchId) return m;

        const isHome = team === 'home';
        const nextHome = isHome ? m.homeScore + 1 : m.homeScore;
        const nextAway = !isHome ? m.awayScore + 1 : m.awayScore;
        const scorer = isHome ? 'Bukayo Saka' : 'Jude Bellingham';
        const min = (m.minute || 75) + 1;

        soundEffects.playGoalCelebration();
        pushAlert({
          type: 'goal',
          title: '⚽ GOAL!',
          subtitle: `${scorer} scores for ${isHome ? m.homeTeam.name : m.awayTeam.name}!`,
          score: `${nextHome} - ${nextAway}`,
          matchTitle: `${m.homeTeam.shortName} vs ${m.awayTeam.shortName}`,
        });

        const newEvent = {
          id: `ev-manual-${Date.now()}`,
          minute: min,
          type: 'goal' as const,
          team,
          player: scorer,
          scoreAfter: { home: nextHome, away: nextAway },
          description: `Superb strike into the top corner by ${scorer}!`,
        };

        return {
          ...m,
          minute: min,
          homeScore: nextHome,
          awayScore: nextAway,
          events: [newEvent, ...m.events],
          commentary: [
            {
              minute: min,
              text: `GOAL! ${scorer} makes it ${nextHome} - ${nextAway}!`,
              isImportant: true,
              type: 'goal' as const,
            },
            ...m.commentary,
          ],
        };
      })
    );
  };

  // Manual Trigger: Card
  const handleTriggerCard = (type: 'yellow' | 'red') => {
    const targetMatchId = selectedMatch ? selectedMatch.id : 'match-arsenal-realmadrid';
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== targetMatchId) return m;
        const min = (m.minute || 75) + 1;
        const player = 'Declan Rice';

        if (type === 'red') {
          soundEffects.playWhistle();
          pushAlert({
            type: 'card',
            title: '🟥 RED CARD!',
            subtitle: `${player} is sent off for a second bookable offense!`,
            matchTitle: `${m.homeTeam.shortName} vs ${m.awayTeam.shortName}`,
          });
        } else {
          soundEffects.playCardAlert();
          pushAlert({
            type: 'info',
            title: '🟨 YELLOW CARD',
            subtitle: `${player} is booked for a reckless challenge.`,
            matchTitle: `${m.homeTeam.shortName} vs ${m.awayTeam.shortName}`,
          });
        }

        const newEvent = {
          id: `ev-card-${Date.now()}`,
          minute: min,
          type: type === 'red' ? ('red_card' as const) : ('yellow_card' as const),
          team: 'home' as const,
          player,
          description: `Referee brandishes the ${type} card following a late challenge.`,
        };

        return {
          ...m,
          events: [newEvent, ...m.events],
          stats: {
            ...m.stats,
            redCards: {
              ...m.stats.redCards,
              home: type === 'red' ? m.stats.redCards.home + 1 : m.stats.redCards.home,
            },
            yellowCards: {
              ...m.stats.yellowCards,
              home: type === 'yellow' ? m.stats.yellowCards.home + 1 : m.stats.yellowCards.home,
            },
          },
        };
      })
    );
  };

  // Manual Trigger: VAR
  const handleTriggerVar = () => {
    const targetMatchId = selectedMatch ? selectedMatch.id : 'match-arsenal-realmadrid';
    soundEffects.playWhistle();
    pushAlert({
      type: 'var',
      title: '⚡ VAR REVIEW IN PROGRESS',
      subtitle: 'Checking possible penalty incident and handball in the box.',
      matchTitle: 'Arsenal vs Real Madrid',
    });

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== targetMatchId) return m;
        const min = (m.minute || 75) + 1;
        const newEvent = {
          id: `ev-var-${Date.now()}`,
          minute: min,
          type: 'var' as const,
          team: 'away' as const,
          player: 'VAR Official',
          description: 'VAR Check complete: No penalty awarded. Play continues.',
        };
        return {
          ...m,
          events: [newEvent, ...m.events],
          commentary: [
            {
              minute: min,
              text: 'VAR REVIEW: Referee checks the pitchside monitor and waves play on.',
              isImportant: true,
              type: 'info' as const,
            },
            ...m.commentary,
          ],
        };
      })
    );
  };

  // Manual Trigger: Advance Clock
  const handleAdvanceClock = (mins: number) => {
    const targetMatchId = selectedMatch ? selectedMatch.id : 'match-arsenal-realmadrid';
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== targetMatchId) return m;
        return {
          ...m,
          minute: (m.minute || 70) + mins,
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#f2f4f7] flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Toast Alert Banner */}
      <NotificationToast
        alerts={alerts}
        onDismiss={dismissAlert}
      />

      {/* Main Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenApiProviders={() => setIsApiModalOpen(true)}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
        liveMatchesCount={matches.filter((m) => m.status === 'LIVE').length}
        favouritesCount={favouriteTeams.length + favouriteMatches.length}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
      />

      {/* Sports Navigation Bar (Football, Hockey, Basketball, Tennis, Cricket) */}
      {activeTab === 'scores' && (
        <SportsBar
          activeSport={activeSport}
          onSelectSport={setActiveSport}
          sportCounts={sportCounts}
        />
      )}

      {/* Main Body Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {activeTab === 'scores' && (
          <div className="flex flex-col lg:flex-row gap-6 p-2 sm:p-4 lg:p-6">
            {/* Center Match Stream Column */}
            <div className="flex-1 min-w-0 bg-[#0e0f14] rounded-2xl border border-[#1f212a] overflow-hidden shadow-xl">
              {/* Date & LIVE Filter Bar */}
              <DateNavigator
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                isLiveOnly={isLiveOnly}
                onToggleLiveOnly={() => setIsLiveOnly(!isLiveOnly)}
                liveMatchesCount={matches.filter((m) => m.status === 'LIVE' && m.sport === activeSport).length}
              />

              {/* Match List Grouped by League */}
              <MatchList
                matches={visibleMatches}
                competitions={COMPETITIONS}
                favouriteMatches={favouriteMatches}
                onToggleFavourite={toggleFavouriteMatch}
                onSelectMatch={(m) => setSelectedMatch(m)}
                onSelectCompetition={(compId) => {
                  setActiveTab('standings');
                }}
                isLiveOnly={isLiveOnly}
                onResetFilters={() => {
                  setIsLiveOnly(false);
                  setSelectedDate('2026-11-10');
                }}
              />
            </div>

            {/* Right Sidebar (matching Screenshot 1 with Search & Latest News) */}
            <RightSidebar
              onOpenSearchWithFilter={(filter) => {
                setIsSearchOpen(true);
              }}
              onOpenNewsTab={() => setActiveTab('news')}
              onSelectArticle={(art) => {
                setActiveTab('news');
              }}
            />
          </div>
        )}

        {/* Tab 2: News Portal */}
        {activeTab === 'news' && <NewsView />}

        {/* Tab 3: Favourites & Notifications */}
        {activeTab === 'favourites' && (
          <FavouritesView
            favouriteTeams={favouriteTeams}
            favouriteMatches={favouriteMatches}
            onToggleFavouriteTeam={toggleFavouriteTeam}
            onToggleFavouriteMatch={toggleFavouriteMatch}
            onSelectMatch={(m) => setSelectedMatch(m)}
            onSelectTeam={(teamId) => setSelectedTeamId(teamId)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        )}

        {/* Tab 4: Standings & League Tables */}
        {activeTab === 'standings' && (
          <StandingsView
            onSelectTeam={(teamId) => setSelectedTeamId(teamId)}
            onSelectPlayer={(playerId) => setSelectedPlayerId(playerId)}
          />
        )}
      </main>

      {/* Floating Interactive Live Simulation Dock */}
      <LiveSimulationController
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        simulationSpeed={simulationSpeed}
        onSetSimulationSpeed={setSimulationSpeed}
        onTriggerGoal={handleTriggerGoal}
        onTriggerCard={handleTriggerCard}
        onTriggerVar={handleTriggerVar}
        onAdvanceClock={handleAdvanceClock}
        activeLiveMatchTitle={
          selectedMatch
            ? `${selectedMatch.homeTeam.shortName} vs ${selectedMatch.awayTeam.shortName}`
            : 'Arsenal vs Real Madrid'
        }
      />

      {/* Match Center Modal */}
      <MatchDetailModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        isFavourite={selectedMatch ? favouriteMatches.includes(selectedMatch.id) : false}
        onToggleFavourite={toggleFavouriteMatch}
        onTriggerEvent={(type, team) => {
          if (type === 'goal') handleTriggerGoal(team);
          if (type === 'yellow_card') handleTriggerCard('yellow');
          if (type === 'red_card') handleTriggerCard('red');
          if (type === 'var') handleTriggerVar();
        }}
      />

      {/* Team Detail Modal */}
      <TeamDetailModal
        teamId={selectedTeamId}
        onClose={() => setSelectedTeamId(null)}
        isFavourite={selectedTeamId ? favouriteTeams.includes(selectedTeamId) : false}
        onToggleFavourite={toggleFavouriteTeam}
        onSelectPlayer={(pId) => setSelectedPlayerId(pId)}
        onSelectMatch={(m) => setSelectedMatch(m)}
      />

      {/* Player Detail Modal */}
      <PlayerDetailModal
        playerId={selectedPlayerId}
        onClose={() => setSelectedPlayerId(null)}
        isFavourite={false}
        onToggleFavourite={() => {}}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTeam={(tId) => setSelectedTeamId(tId)}
        onSelectPlayer={(pId) => setSelectedPlayerId(pId)}
        onSelectCompetition={() => setActiveTab('standings')}
      />

      {/* Notification Preferences Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* LiveScore API Providers Connection Center Modal */}
      <ApiProvidersModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onSyncLiveApi={handleSyncLiveApi}
      />

      {/* Official LiveScore Footer matching Screenshot 5 */}
      <Footer />
    </div>
  );
}
