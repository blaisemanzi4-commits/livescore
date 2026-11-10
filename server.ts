import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Dynamic Football API Config Reader
function getFootballConfig() {
  // Dynamically re-read .env to catch any user updates immediately without manual restart
  dotenv.config({ override: true });
  const rawKey = (process.env.FOOTBALL_API_KEY || '').trim();
  const isPlaceholder = !rawKey || rawKey === 'your_actual_api_key_here' || rawKey === 'YOUR_API_KEY' || rawKey.includes('your_actual');
  const apiKey = isPlaceholder ? '' : rawKey;
  const apiUrl = (process.env.FOOTBALL_API_URL || 'https://v3.football.api-sports.io').trim();
  return { apiKey, apiUrl, isPlaceholder, rawKey };
}

// Helper function to call API-Football
async function callFootballApi(endpoint: string) {
  const { apiKey, apiUrl } = getFootballConfig();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const url = `${apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-apisports-key': apiKey,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API_ERROR_${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data;
}

// 1. Provider Connection & Status Endpoint
app.get('/api/status', async (_req: Request, res: Response) => {
  const { apiKey, apiUrl, isPlaceholder, rawKey } = getFootballConfig();
  const isConfigured = Boolean(apiKey && apiKey.length > 0);
  let connectionTest: 'connected' | 'not_configured' | 'error' | 'placeholder_detected' = 'not_configured';
  let apiErrors: unknown = null;
  let accountInfo: unknown = null;

  if (isPlaceholder && rawKey.length > 0) {
    connectionTest = 'placeholder_detected';
  } else if (isConfigured) {
    try {
      const result = await callFootballApi('/status');
      if (result.errors && Object.keys(result.errors).length > 0 && !(Array.isArray(result.errors) && result.errors.length === 0)) {
        connectionTest = 'error';
        apiErrors = result.errors;
      } else {
        connectionTest = 'connected';
        accountInfo = result.response?.account || result.response?.subscription || result.response;
      }
    } catch (err: unknown) {
      connectionTest = 'error';
      apiErrors = err instanceof Error ? err.message : String(err);
    }
  }

  res.json({
    status: 'ok',
    provider: 'API-Football (API-Sports)',
    apiUrl,
    isConfigured,
    connectionTest,
    rawKeyPreview: rawKey ? `${rawKey.slice(0, 4)}...${rawKey.slice(-4)}` : '',
    accountInfo,
    apiErrors,
    supportedProviders: [
      {
        id: 'api-football',
        name: 'API-Football (API-Sports)',
        status: isConfigured ? (connectionTest === 'connected' ? 'active' : 'connecting') : 'ready_for_key',
        recommended: true,
        baseUrl: 'https://v3.football.api-sports.io',
        authHeader: 'x-apisports-key',
        coverage: ['Live scores', 'Fixtures & results', 'Standings', 'Statistics', 'Lineups', 'Events', 'H2H'],
      },
      {
        id: 'sportmonks',
        name: 'Sportmonks Football API',
        status: 'supported',
        baseUrl: 'https://api.sportmonks.com/v3/football',
        authHeader: 'Authorization: Bearer <TOKEN>',
        coverage: ['Live scores', 'Match events', 'Team & Player statistics', 'Predictions', 'Standings'],
      },
      {
        id: 'api-sports-multisport',
        name: 'API-Sports Multi-Sport',
        status: 'supported',
        baseUrl: 'https://v1.basketball.api-sports.io / https://v1.hockey.api-sports.io',
        authHeader: 'x-apisports-key',
        coverage: ['Football', 'Basketball', 'Tennis', 'Ice Hockey', 'Baseball'],
      },
      {
        id: 'livescore-json',
        name: 'LiveScoreJSON',
        status: 'supported',
        baseUrl: 'https://livescore-api.com/api-client',
        coverage: ['Live matches', 'Commentary', 'Statistics', 'League tables', 'Transfers'],
      },
      {
        id: 'live-score-api',
        name: 'Live-Score-API',
        status: 'supported',
        baseUrl: 'https://live-score-api.com',
        coverage: ['Live scores', 'Fixtures', 'Results', 'Match statistics'],
      },
    ],
  });
});

// 2. Live Fixtures Proxy: GET /api/fixtures/live
app.get('/api/fixtures/live', async (_req: Request, res: Response) => {
  const { apiKey } = getFootballConfig();
  try {
    if (apiKey) {
      const data = await callFootballApi('/fixtures?live=all');
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn('Real API call failed or rate-limited, falling back to local simulation:', err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    message: 'Using built-in live simulation feed (configure FOOTBALL_API_KEY in .env for direct API-Football stream)',
    response: [],
  });
});

// 3. Match Details by ID: GET /api/fixtures/id/:id
app.get('/api/fixtures/id/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { apiKey } = getFootballConfig();
  try {
    if (apiKey) {
      const data = await callFootballApi(`/fixtures?id=${encodeURIComponent(id)}`);
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Fixture ${id} call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [
      {
        fixture: { id, date: '2026-11-10T20:00:00+00:00', status: { short: 'LIVE', elapsed: 71 } },
        league: { id: 2, name: 'UEFA Champions League', round: 'Group Stage' },
        teams: { home: { name: 'Arsenal' }, away: { name: 'Real Madrid' } },
        goals: { home: 2, away: 1 },
      },
    ],
  });
});

// 4. Fixtures by Date Proxy: GET /api/fixtures/date/:date
app.get('/api/fixtures/date/:date', async (req: Request, res: Response) => {
  const { date } = req.params;
  const { apiKey } = getFootballConfig();
  try {
    if (apiKey) {
      const data = await callFootballApi(`/fixtures?date=${encodeURIComponent(date)}`);
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Fixtures for ${date} call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [],
  });
});

// 5. Match Statistics: GET /api/fixtures/:id/statistics
app.get('/api/fixtures/:id/statistics', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { apiKey } = getFootballConfig();
  try {
    if (apiKey) {
      const data = await callFootballApi(`/fixtures/statistics?fixture=${encodeURIComponent(id)}`);
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Statistics for fixture ${id} call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [
      {
        team: { name: 'Arsenal' },
        statistics: [
          { type: 'Ball Possession', value: '54%' },
          { type: 'Total Shots', value: 14 },
          { type: 'Shots on Goal', value: 6 },
          { type: 'Corner Kicks', value: 7 },
          { type: 'Fouls', value: 10 },
          { type: 'Total passes', value: 442 },
          { type: 'Passes %', value: '89%' },
          { type: 'expected_goals', value: 1.84 },
        ],
      },
      {
        team: { name: 'Real Madrid' },
        statistics: [
          { type: 'Ball Possession', value: '46%' },
          { type: 'Total Shots', value: 11 },
          { type: 'Shots on Goal', value: 4 },
          { type: 'Corner Kicks', value: 4 },
          { type: 'Fouls', value: 12 },
          { type: 'Total passes', value: 382 },
          { type: 'Passes %', value: '86%' },
          { type: 'expected_goals', value: 1.22 },
        ],
      },
    ],
  });
});

// 6. Match Events: GET /api/fixtures/:id/events
app.get('/api/fixtures/:id/events', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { apiKey } = getFootballConfig();
  try {
    if (apiKey) {
      const data = await callFootballApi(`/fixtures/events?fixture=${encodeURIComponent(id)}`);
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Events for fixture ${id} call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [
      { time: { elapsed: 24 }, team: { name: 'Arsenal' }, player: { name: 'Bukayo Saka' }, type: 'Goal', detail: 'Normal Goal' },
      { time: { elapsed: 38 }, team: { name: 'Real Madrid' }, player: { name: 'Vinícius Júnior' }, type: 'Goal', detail: 'Normal Goal' },
      { time: { elapsed: 54 }, team: { name: 'Real Madrid' }, player: { name: 'Eduardo Camavinga' }, type: 'Card', detail: 'Yellow Card' },
      { time: { elapsed: 66 }, team: { name: 'Arsenal' }, player: { name: 'Kai Havertz' }, type: 'Goal', detail: 'Normal Goal' },
    ],
  });
});

// 7. Lineups: GET /api/fixtures/:id/lineups
app.get('/api/fixtures/:id/lineups', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { apiKey } = getFootballConfig();
  try {
    if (apiKey) {
      const data = await callFootballApi(`/fixtures/lineups?fixture=${encodeURIComponent(id)}`);
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Lineups for fixture ${id} call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [
      {
        team: { name: 'Arsenal' },
        formation: '4-3-3',
        coach: { name: 'Mikel Arteta' },
        startXI: [
          { player: { name: 'D. Raya', number: 22, pos: 'G' } },
          { player: { name: 'W. Saliba', number: 2, pos: 'D' } },
          { player: { name: 'D. Rice', number: 41, pos: 'M' } },
          { player: { name: 'M. Ødegaard', number: 8, pos: 'M' } },
          { player: { name: 'B. Saka', number: 7, pos: 'F' } },
        ],
      },
    ],
  });
});

// 8. Standings: GET /api/standings
app.get('/api/standings', async (req: Request, res: Response) => {
  const league = (req.query.league as string) || '39'; // Premier League default
  const season = (req.query.season as string) || '2026';
  const { apiKey } = getFootballConfig();
  try {
    if (apiKey) {
      const data = await callFootballApi(`/standings?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`);
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Standings call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [],
  });
});

// 9. Teams by League/Season or ID: GET /api/teams
app.get('/api/teams', async (req: Request, res: Response) => {
  const league = req.query.league as string;
  const season = (req.query.season as string) || '2026';
  const id = req.query.id as string;
  const { apiKey } = getFootballConfig();

  try {
    if (apiKey) {
      const queryParam = id ? `?id=${encodeURIComponent(id)}` : `?league=${encodeURIComponent(league || '39')}&season=${encodeURIComponent(season)}`;
      const data = await callFootballApi(`/teams${queryParam}`);
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Teams call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [
      { team: { id: 42, name: 'Arsenal', code: 'ARS', country: 'England', founded: 1886, logo: '🔴' }, venue: { name: 'Emirates Stadium', capacity: 60704 } },
      { team: { id: 50, name: 'Manchester City', code: 'MCI', country: 'England', founded: 1880, logo: '🩵' }, venue: { name: 'Etihad Stadium', capacity: 53400 } },
      { team: { id: 541, name: 'Real Madrid', code: 'RMA', country: 'Spain', founded: 1902, logo: '⚪' }, venue: { name: 'Santiago Bernabéu', capacity: 81044 } },
      { team: { id: 529, name: 'Barcelona', code: 'BAR', country: 'Spain', founded: 1899, logo: '🔵🔴' }, venue: { name: 'Spotify Camp Nou', capacity: 99354 } },
    ],
  });
});

// 10. Players: GET /api/players
app.get('/api/players', async (req: Request, res: Response) => {
  const team = (req.query.team as string) || '42';
  const season = (req.query.season as string) || '2026';
  const id = req.query.id as string;
  const { apiKey } = getFootballConfig();

  try {
    if (apiKey) {
      const queryParam = id ? `?id=${encodeURIComponent(id)}&season=${encodeURIComponent(season)}` : `?team=${encodeURIComponent(team)}&season=${encodeURIComponent(season)}`;
      const data = await callFootballApi(`/players${queryParam}`);
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Players call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [
      { player: { id: 1461, name: 'Bukayo Saka', age: 23, nationality: 'England', number: 7 }, statistics: [{ goals: { total: 9, assists: 8 } }] },
      { player: { id: 1100, name: 'Erling Haaland', age: 24, nationality: 'Norway', number: 9 }, statistics: [{ goals: { total: 15, assists: 2 } }] },
    ],
  });
});

// 11. Head-to-Head: GET /api/fixtures/headtohead
app.get('/api/fixtures/headtohead', async (req: Request, res: Response) => {
  const h2h = (req.query.h2h as string) || '42-50'; // Default Arsenal vs Man City
  const { apiKey } = getFootballConfig();
  try {
    if (apiKey) {
      const data = await callFootballApi(`/fixtures/headtohead?h2h=${encodeURIComponent(h2h)}`);
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`H2H call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [
      { fixture: { id: 1, date: '2026-03-31' }, teams: { home: { name: 'Manchester City' }, away: { name: 'Arsenal' } }, goals: { home: 0, away: 0 } },
      { fixture: { id: 2, date: '2025-10-08' }, teams: { home: { name: 'Arsenal' }, away: { name: 'Manchester City' } }, goals: { home: 1, away: 0 } },
    ],
  });
});

// 12. Top Goalscorers: GET /api/players/topscorers
app.get('/api/players/topscorers', async (req: Request, res: Response) => {
  const league = (req.query.league as string) || '39';
  const season = (req.query.season as string) || '2026';
  const { apiKey } = getFootballConfig();

  try {
    if (apiKey) {
      const data = await callFootballApi(`/players/topscorers?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`);
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Top scorers call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [
      { player: { name: 'Erling Haaland', team: 'Manchester City' }, statistics: [{ goals: { total: 15 } }] },
      { player: { name: 'Cole Palmer', team: 'Chelsea' }, statistics: [{ goals: { total: 10 } }] },
      { player: { name: 'Bukayo Saka', team: 'Arsenal' }, statistics: [{ goals: { total: 9 } }] },
    ],
  });
});

// 13. Top Assists: GET /api/players/topassists
app.get('/api/players/topassists', async (req: Request, res: Response) => {
  const league = (req.query.league as string) || '39';
  const season = (req.query.season as string) || '2026';
  const { apiKey } = getFootballConfig();

  try {
    if (apiKey) {
      const data = await callFootballApi(`/players/topassists?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`);
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Top assists call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [
      { player: { name: 'Bukayo Saka', team: 'Arsenal' }, statistics: [{ goals: { assists: 8 } }] },
      { player: { name: 'Cole Palmer', team: 'Chelsea' }, statistics: [{ goals: { assists: 7 } }] },
    ],
  });
});

// 14. Match Predictions: GET /api/predictions
app.get('/api/predictions', async (req: Request, res: Response) => {
  const fixture = (req.query.fixture as string) || '120892';
  const { apiKey } = getFootballConfig();

  try {
    if (apiKey) {
      const data = await callFootballApi(`/predictions?fixture=${encodeURIComponent(fixture)}`);
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Predictions call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [
      {
        predictions: {
          winner: { name: 'Arsenal', comment: 'Win or draw' },
          percent: { home: '48%', draw: '26%', away: '26%' },
          goals: { home: '2.1', away: '1.2' },
          advice: 'Combo Double chance : Arsenal or draw and -3.5 goals',
        },
      },
    ],
  });
});

// 15. Betting Odds: GET /api/odds
app.get('/api/odds', async (req: Request, res: Response) => {
  const fixture = (req.query.fixture as string) || '120892';
  const { apiKey } = getFootballConfig();

  try {
    if (apiKey) {
      const data = await callFootballApi(`/odds?fixture=${encodeURIComponent(fixture)}`);
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Odds call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [
      {
        bookmakers: [
          {
            name: 'Bet365',
            bets: [
              {
                name: 'Match Winner',
                values: [
                  { value: 'Home', odd: '2.10' },
                  { value: 'Draw', odd: '3.40' },
                  { value: 'Away', odd: '3.20' },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
});

// 16. Leagues List: GET /api/leagues
app.get('/api/leagues', async (req: Request, res: Response) => {
  const { apiKey } = getFootballConfig();
  try {
    if (apiKey) {
      const data = await callFootballApi('/leagues');
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Leagues call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [
      { league: { id: 39, name: 'Premier League', type: 'League' }, country: { name: 'England', code: 'GB' } },
      { league: { id: 140, name: 'La Liga', type: 'League' }, country: { name: 'Spain', code: 'ES' } },
      { league: { id: 135, name: 'Serie A', type: 'League' }, country: { name: 'Italy', code: 'IT' } },
      { league: { id: 2, name: 'UEFA Champions League', type: 'Cup' }, country: { name: 'World', code: null } },
      { league: { id: 143, name: 'Copa del Rey', type: 'Cup' }, country: { name: 'Spain', code: 'ES' } },
    ],
  });
});

// 17. Countries List: GET /api/countries
app.get('/api/countries', async (_req: Request, res: Response) => {
  const { apiKey } = getFootballConfig();
  try {
    if (apiKey) {
      const data = await callFootballApi('/countries');
      return res.json({
        source: 'api-sports',
        success: true,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Countries call failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    response: [
      { name: 'England', code: 'GB', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      { name: 'Spain', code: 'ES', flag: '🇪🇸' },
      { name: 'Italy', code: 'IT', flag: '🇮🇹' },
      { name: 'Germany', code: 'DE', flag: '🇩🇪' },
      { name: 'France', code: 'FR', flag: '🇫🇷' },
    ],
  });
});

// 18. Universal Passthrough Proxy: GET /api/proxy?endpoint=...
app.get('/api/proxy', async (req: Request, res: Response) => {
  const endpoint = (req.query.endpoint as string) || '/fixtures?live=all';
  const { apiKey } = getFootballConfig();

  try {
    if (apiKey) {
      const data = await callFootballApi(endpoint);
      return res.json({
        source: 'api-sports',
        success: true,
        endpoint,
        response: data.response || [],
      });
    }
  } catch (err: unknown) {
    console.warn(`Universal proxy for ${endpoint} failed:`, err);
  }

  res.json({
    source: 'simulation_fallback',
    success: true,
    endpoint,
    message: 'Universal proxy active. Using mock response in simulation mode.',
    response: [],
  });
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LiveScore Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start LiveScore server:', err);
  process.exit(1);
});
