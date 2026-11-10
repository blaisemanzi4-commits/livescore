import { Match, MatchStats, MatchEvent, Team } from '../types/sports';

export interface ApiProviderInfo {
  id: string;
  name: string;
  status: string;
  recommended?: boolean;
  baseUrl: string;
  authHeader?: string;
  coverage: string[];
}

export interface ApiConnectionStatus {
  status: string;
  provider: string;
  apiUrl: string;
  isConfigured: boolean;
  connectionTest: 'connected' | 'not_configured' | 'error' | 'placeholder_detected';
  rawKeyPreview?: string;
  accountInfo?: any;
  apiErrors?: unknown;
  supportedProviders: ApiProviderInfo[];
}

// 1. Check API Connection & Providers status
export async function checkApiStatus(): Promise<ApiConnectionStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status failed');
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      provider: 'API-Football (Fallback Mode)',
      apiUrl: 'https://v3.football.api-sports.io',
      isConfigured: false,
      connectionTest: 'not_configured',
      supportedProviders: [],
    };
  }
}

// 2. Fetch Live Fixtures from Backend Proxy
export async function fetchLiveFixtures(): Promise<{ source: string; matches: Match[] }> {
  try {
    const res = await fetch('/api/fixtures/live');
    if (!res.ok) throw new Error('Live fixtures request failed');
    const data = await res.json();

    if (data.source === 'api-sports' && Array.isArray(data.response) && data.response.length > 0) {
      const mapped = data.response.map(mapApiSportsFixtureToMatch).filter(Boolean) as Match[];
      return { source: 'api-sports', matches: mapped };
    }
  } catch (err) {
    console.warn('Live fixtures fetch error, falling back:', err);
  }

  return { source: 'simulation_fallback', matches: [] };
}

// 3. Fetch Fixtures for a specific date
export async function fetchFixturesByDate(date: string): Promise<{ source: string; matches: Match[] }> {
  try {
    const res = await fetch(`/api/fixtures/date/${encodeURIComponent(date)}`);
    if (!res.ok) throw new Error('Date fixtures request failed');
    const data = await res.json();

    if (data.source === 'api-sports' && Array.isArray(data.response) && data.response.length > 0) {
      const mapped = data.response.map(mapApiSportsFixtureToMatch).filter(Boolean) as Match[];
      return { source: 'api-sports', matches: mapped };
    }
  } catch (err) {
    console.warn(`Fixtures for ${date} fetch error:`, err);
  }

  return { source: 'simulation_fallback', matches: [] };
}

// 4. Fetch Match Statistics
export async function fetchMatchStats(fixtureId: string): Promise<MatchStats | null> {
  try {
    const res = await fetch(`/api/fixtures/${encodeURIComponent(fixtureId)}/statistics`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.source === 'api-sports' && Array.isArray(data.response) && data.response.length >= 2) {
      return mapApiSportsStatsToMatchStats(data.response);
    }
  } catch (err) {
    console.warn(`Stats fetch error for ${fixtureId}:`, err);
  }
  return null;
}

// 5. Fetch Match Events
export async function fetchMatchEvents(fixtureId: string): Promise<MatchEvent[]> {
  try {
    const res = await fetch(`/api/fixtures/${encodeURIComponent(fixtureId)}/events`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.source === 'api-sports' && Array.isArray(data.response)) {
      return data.response.map((ev: any, idx: number) => ({
        id: `ev-api-${idx}-${Date.now()}`,
        minute: ev.time?.elapsed || 0,
        addedTime: ev.time?.extra || 0,
        type: ev.type === 'Goal' ? 'goal' : ev.type === 'Card' && ev.detail?.includes('Red') ? 'red_card' : ev.type === 'Card' ? 'yellow_card' : ev.type === 'subst' ? 'substitution' : 'var',
        team: ev.team?.name ? 'home' : 'away',
        player: ev.player?.name || 'Player',
        assist: ev.assist?.name,
        description: ev.comments || ev.detail,
      }));
    }
  } catch (err) {
    console.warn(`Events fetch error for ${fixtureId}:`, err);
  }
  return [];
}

// 6. Fetch Match Details by ID
export async function fetchFixtureById(id: string): Promise<any> {
  try {
    const res = await fetch(`/api/fixtures/id/${encodeURIComponent(id)}`);
    return await res.json();
  } catch (err) {
    console.warn(`Fixture by ID ${id} error:`, err);
    return null;
  }
}

// 7. Fetch Match Lineups
export async function fetchMatchLineups(fixtureId: string): Promise<any> {
  try {
    const res = await fetch(`/api/fixtures/${encodeURIComponent(fixtureId)}/lineups`);
    return await res.json();
  } catch (err) {
    console.warn(`Lineups fetch error for ${fixtureId}:`, err);
    return null;
  }
}

// 8. Fetch Standings
export async function fetchStandings(league = '39', season = '2026'): Promise<any> {
  try {
    const res = await fetch(`/api/standings?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`);
    return await res.json();
  } catch (err) {
    console.warn('Standings fetch error:', err);
    return null;
  }
}

// 9. Fetch Teams
export async function fetchTeams(league = '39', season = '2026', id?: string): Promise<any> {
  try {
    const query = id ? `?id=${encodeURIComponent(id)}` : `?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`;
    const res = await fetch(`/api/teams${query}`);
    return await res.json();
  } catch (err) {
    console.warn('Teams fetch error:', err);
    return null;
  }
}

// 10. Fetch Players
export async function fetchPlayers(team = '42', season = '2026', id?: string): Promise<any> {
  try {
    const query = id ? `?id=${encodeURIComponent(id)}&season=${encodeURIComponent(season)}` : `?team=${encodeURIComponent(team)}&season=${encodeURIComponent(season)}`;
    const res = await fetch(`/api/players${query}`);
    return await res.json();
  } catch (err) {
    console.warn('Players fetch error:', err);
    return null;
  }
}

// 11. Fetch Head-to-Head
export async function fetchH2H(h2h = '42-50'): Promise<any> {
  try {
    const res = await fetch(`/api/fixtures/headtohead?h2h=${encodeURIComponent(h2h)}`);
    return await res.json();
  } catch (err) {
    console.warn('H2H fetch error:', err);
    return null;
  }
}

// 12. Fetch Top Scorers
export async function fetchTopScorers(league = '39', season = '2026'): Promise<any> {
  try {
    const res = await fetch(`/api/players/topscorers?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`);
    return await res.json();
  } catch (err) {
    console.warn('Top scorers fetch error:', err);
    return null;
  }
}

// 13. Fetch Top Assists
export async function fetchTopAssists(league = '39', season = '2026'): Promise<any> {
  try {
    const res = await fetch(`/api/players/topassists?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`);
    return await res.json();
  } catch (err) {
    console.warn('Top assists fetch error:', err);
    return null;
  }
}

// 14. Fetch Predictions
export async function fetchPredictions(fixtureId = '120892'): Promise<any> {
  try {
    const res = await fetch(`/api/predictions?fixture=${encodeURIComponent(fixtureId)}`);
    return await res.json();
  } catch (err) {
    console.warn('Predictions fetch error:', err);
    return null;
  }
}

// 15. Fetch Odds
export async function fetchOdds(fixtureId = '120892'): Promise<any> {
  try {
    const res = await fetch(`/api/odds?fixture=${encodeURIComponent(fixtureId)}`);
    return await res.json();
  } catch (err) {
    console.warn('Odds fetch error:', err);
    return null;
  }
}

// 16. Fetch Leagues
export async function fetchLeagues(): Promise<any> {
  try {
    const res = await fetch('/api/leagues');
    return await res.json();
  } catch (err) {
    console.warn('Leagues fetch error:', err);
    return null;
  }
}

// 17. Fetch Countries
export async function fetchCountries(): Promise<any> {
  try {
    const res = await fetch('/api/countries');
    return await res.json();
  } catch (err) {
    console.warn('Countries fetch error:', err);
    return null;
  }
}

// 18. Universal Raw Proxy
export async function callUniversalProxy(endpoint: string): Promise<any> {
  try {
    const res = await fetch(`/api/proxy?endpoint=${encodeURIComponent(endpoint)}`);
    return await res.json();
  } catch (err) {
    console.warn(`Universal proxy error for ${endpoint}:`, err);
    return { error: String(err) };
  }
}

// Helper: Map API-Football item to internal Match model
export function mapApiSportsFixtureToMatch(item: any): Match | null {
  if (!item || !item.fixture || !item.teams) return null;

  const f = item.fixture;
  const t = item.teams;
  const g = item.goals;
  const l = item.league;

  const isLive = ['1H', '2H', 'ET', 'P', 'LIVE'].includes(f.status?.short);
  const isHT = f.status?.short === 'HT';
  const isFT = ['FT', 'AET', 'PEN'].includes(f.status?.short);

  const homeTeam: Team = {
    id: `team-${t.home?.id}`,
    name: t.home?.name || 'Home Team',
    shortName: t.home?.name || 'Home',
    code: (t.home?.name || 'HOM').slice(0, 3).toUpperCase(),
    logo: t.home?.logo || '⚽',
    country: l?.country || 'International',
    sport: 'football',
    color: '#ee4036',
  };

  const awayTeam: Team = {
    id: `team-${t.away?.id}`,
    name: t.away?.name || 'Away Team',
    shortName: t.away?.name || 'Away',
    code: (t.away?.name || 'AWA').slice(0, 3).toUpperCase(),
    logo: t.away?.logo || '⚽',
    country: l?.country || 'International',
    sport: 'football',
    color: '#0077ff',
  };

  const events: MatchEvent[] = Array.isArray(item.events)
    ? item.events.map((ev: any, idx: number) => ({
        id: `ev-item-${idx}`,
        minute: ev.time?.elapsed || 0,
        addedTime: ev.time?.extra,
        type: ev.type === 'Goal' ? 'goal' : ev.type === 'Card' && ev.detail?.includes('Red') ? 'red_card' : ev.type === 'Card' ? 'yellow_card' : 'substitution',
        team: ev.team?.id === t.home?.id ? 'home' : 'away',
        player: ev.player?.name || 'Player',
        assist: ev.assist?.name,
        description: ev.detail,
      }))
    : [];

  return {
    id: `fixture-${f.id}`,
    sport: 'football',
    competitionId: `league-${l?.id}`,
    competitionName: l?.name || 'Football League',
    competitionRound: l?.round || 'Regular Season',
    country: l?.country || 'International',
    countryFlag: l?.flag || '🌐',
    date: f.date ? f.date.split('T')[0] : '2026-11-10',
    time: f.date ? f.date.split('T')[1].slice(0, 5) : '20:00',
    status: isLive ? 'LIVE' : isHT ? 'HALF_TIME' : isFT ? 'FULL_TIME' : 'NOT_STARTED',
    minute: f.status?.elapsed || (isLive ? 45 : undefined),
    homeTeam,
    awayTeam,
    homeScore: g?.home ?? 0,
    awayScore: g?.away ?? 0,
    halfTimeScore: item.score?.halftime ? { home: item.score.halftime.home || 0, away: item.score.halftime.away || 0 } : undefined,
    events,
    stats: {
      possession: { home: 50, away: 50 },
      totalShots: { home: 10, away: 8 },
      shotsOnTarget: { home: 4, away: 3 },
      shotsOffTarget: { home: 6, away: 5 },
      blockedShots: { home: 2, away: 2 },
      corners: { home: 5, away: 4 },
      fouls: { home: 11, away: 12 },
      offsides: { home: 2, away: 1 },
      yellowCards: { home: 1, away: 2 },
      redCards: { home: 0, away: 0 },
      goalkeeperSaves: { home: 3, away: 4 },
      passes: { home: 420, away: 380 },
      passAccuracy: { home: 84, away: 81 },
      dangerousAttacks: { home: 45, away: 38 },
      expectedGoals: { home: 1.2, away: 0.9 },
    },
    commentary: [
      { minute: f.status?.elapsed || 0, text: `Match status: ${f.status?.long || 'Underway'}.`, type: 'info' },
    ],
    venue: f.venue?.name ? `${f.venue.name}, ${f.venue.city}` : undefined,
    referee: f.referee,
  };
}

// Helper: Map API-Football stats array to MatchStats
function mapApiSportsStatsToMatchStats(response: any[]): MatchStats {
  const homeStats = response[0]?.statistics || [];
  const awayStats = response[1]?.statistics || [];

  const getStat = (arr: any[], type: string) => {
    const item = arr.find((s: any) => s.type === type);
    if (!item || item.value === null) return 0;
    if (typeof item.value === 'string' && item.value.endsWith('%')) {
      return parseInt(item.value, 10);
    }
    return Number(item.value) || 0;
  };

  return {
    possession: { home: getStat(homeStats, 'Ball Possession'), away: getStat(awayStats, 'Ball Possession') },
    totalShots: { home: getStat(homeStats, 'Total Shots'), away: getStat(awayStats, 'Total Shots') },
    shotsOnTarget: { home: getStat(homeStats, 'Shots on Goal'), away: getStat(awayStats, 'Shots on Goal') },
    shotsOffTarget: { home: getStat(homeStats, 'Shots off Goal'), away: getStat(awayStats, 'Shots off Goal') },
    blockedShots: { home: getStat(homeStats, 'Blocked Shots'), away: getStat(awayStats, 'Blocked Shots') },
    corners: { home: getStat(homeStats, 'Corner Kicks'), away: getStat(awayStats, 'Corner Kicks') },
    fouls: { home: getStat(homeStats, 'Fouls'), away: getStat(awayStats, 'Fouls') },
    offsides: { home: getStat(homeStats, 'Offsides'), away: getStat(awayStats, 'Offsides') },
    yellowCards: { home: getStat(homeStats, 'Yellow Cards'), away: getStat(awayStats, 'Yellow Cards') },
    redCards: { home: getStat(homeStats, 'Red Cards'), away: getStat(awayStats, 'Red Cards') },
    goalkeeperSaves: { home: getStat(homeStats, 'Goalkeeper Saves'), away: getStat(awayStats, 'Goalkeeper Saves') },
    passes: { home: getStat(homeStats, 'Total passes'), away: getStat(awayStats, 'Total passes') },
    passAccuracy: { home: getStat(homeStats, 'Passes %'), away: getStat(awayStats, 'Passes %') },
    dangerousAttacks: { home: 48, away: 36 },
    expectedGoals: { home: getStat(homeStats, 'expected_goals') || 1.4, away: getStat(awayStats, 'expected_goals') || 1.1 },
  };
}
