import React from 'react';
import { X, Globe, Server, CheckCircle2, AlertCircle, ExternalLink, Code2, Copy, Check, RefreshCw, Play, Send } from 'lucide-react';
import { ApiConnectionStatus, checkApiStatus, fetchLiveFixtures } from '../services/sportsApi';

interface ApiProvidersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncLiveApi: () => void;
}

export const ApiProvidersModal: React.FC<ApiProvidersModalProps> = ({
  isOpen,
  onClose,
  onSyncLiveApi,
}) => {
  const [statusData, setStatusData] = React.useState<ApiConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'explorer' | 'endpoints' | 'providers'>('overview');
  const [testResult, setTestResult] = React.useState<string | null>(null);

  // API Explorer state
  const [selectedEndpoint, setSelectedEndpoint] = React.useState<string>('/api/fixtures/live');
  const [customPath, setCustomPath] = React.useState<string>('/api/fixtures/live');
  const [isExecuting, setIsExecuting] = React.useState<boolean>(false);
  const [explorerResponse, setExplorerResponse] = React.useState<{
    status: number;
    latencyMs: number;
    source: string;
    body: any;
  } | null>(null);
  const [copiedExplorer, setCopiedExplorer] = React.useState<boolean>(false);

  const loadStatus = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await checkApiStatus();
      setStatusData(data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen, loadStatus]);

  const handleTestLiveFeed = async () => {
    setTestResult('Connecting to /api/fixtures/live proxy...');
    try {
      const res = await fetchLiveFixtures();
      if (res.source === 'api-sports') {
        setTestResult(`Success! Connected directly to API-Football live stream (${res.matches.length} live matches received).`);
      } else {
        setTestResult(`Proxy operational. Operating in high-speed Simulation/Fallback mode. Configure FOOTBALL_API_KEY in .env to stream direct from API-Sports.`);
      }
    } catch (err: unknown) {
      setTestResult(`Connection error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const executeExplorerRequest = async (urlToFetch: string) => {
    setIsExecuting(true);
    const start = performance.now();
    try {
      const res = await fetch(urlToFetch);
      const data = await res.json();
      const end = performance.now();
      setExplorerResponse({
        status: res.status,
        latencyMs: Math.round(end - start),
        source: data.source || 'server',
        body: data,
      });
    } catch (err: unknown) {
      const end = performance.now();
      setExplorerResponse({
        status: 500,
        latencyMs: Math.round(end - start),
        source: 'error',
        body: { error: err instanceof Error ? err.message : String(err) },
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyExplorerJson = () => {
    if (!explorerResponse) return;
    navigator.clipboard.writeText(JSON.stringify(explorerResponse.body, null, 2));
    setCopiedExplorer(true);
    setTimeout(() => setCopiedExplorer(false), 2000);
  };

  if (!isOpen) return null;

  const endpointsList = [
    { name: '1. Live Matches', endpoint: '/fixtures?live=all', proxyPath: '/api/fixtures/live', method: 'GET', desc: 'Real-time scores & in-play minute updates' },
    { name: "2. Today's Fixtures", endpoint: '/fixtures?date=2026-11-10', proxyPath: '/api/fixtures/date/2026-11-10', method: 'GET', desc: 'Complete match schedule for a given date' },
    { name: '3. Match Details', endpoint: '/fixtures?id=120892', proxyPath: '/api/fixtures/id/120892', method: 'GET', desc: 'Detailed match info, venue, referee, teams' },
    { name: '4. Match Statistics', endpoint: '/fixtures/statistics?fixture=120892', proxyPath: '/api/fixtures/120892/statistics', method: 'GET', desc: 'Possession %, shots, passes, fouls, xG' },
    { name: '5. Match Events', endpoint: '/fixtures/events?fixture=120892', proxyPath: '/api/fixtures/120892/events', method: 'GET', desc: 'Goals, assists, cards, substitutions, VAR' },
    { name: '6. Team Lineups', endpoint: '/fixtures/lineups?fixture=120892', proxyPath: '/api/fixtures/120892/lineups', method: 'GET', desc: 'Starting XI formations, player ratings, bench' },
    { name: '7. League Standings', endpoint: '/standings?league=39&season=2026', proxyPath: '/api/standings?league=39&season=2026', method: 'GET', desc: 'League table rankings, points, goal difference' },
    { name: '8. Teams by League', endpoint: '/teams?league=39&season=2026', proxyPath: '/api/teams?league=39&season=2026', method: 'GET', desc: 'Team profiles, logos, home stadiums, founded' },
    { name: '9. Players by Team', endpoint: '/players?team=42&season=2026', proxyPath: '/api/players?team=42&season=2026', method: 'GET', desc: 'Player rosters, age, positions, goals, assists' },
    { name: '10. Head-to-Head (H2H)', endpoint: '/fixtures/headtohead?h2h=42-50', proxyPath: '/api/fixtures/headtohead?h2h=42-50', method: 'GET', desc: 'Historical encounters between two clubs' },
    { name: '11. Top Goalscorers', endpoint: '/players/topscorers?league=39&season=2026', proxyPath: '/api/players/topscorers?league=39&season=2026', method: 'GET', desc: 'Golden Boot leaderboard with goal tallies' },
    { name: '12. Top Assists', endpoint: '/players/topassists?league=39&season=2026', proxyPath: '/api/players/topassists?league=39&season=2026', method: 'GET', desc: 'Playmaker leaderboard with assist tallies' },
    { name: '13. Match Predictions', endpoint: '/predictions?fixture=120892', proxyPath: '/api/predictions?fixture=120892', method: 'GET', desc: 'AI win probability, advice, and analysis' },
    { name: '14. Betting Odds', endpoint: '/odds?fixture=120892', proxyPath: '/api/odds?fixture=120892', method: 'GET', desc: 'Live pre-match and in-play decimal odds' },
    { name: '15. Leagues Directory', endpoint: '/leagues', proxyPath: '/api/leagues', method: 'GET', desc: '1,000+ national leagues and cup competitions' },
    { name: '16. Countries Directory', endpoint: '/countries', proxyPath: '/api/countries', method: 'GET', desc: 'Countries list with ISO codes and flags' },
    { name: '17. Universal Passthrough', endpoint: '/venues?city=London', proxyPath: '/api/proxy?endpoint=/venues?city=London', method: 'GET', desc: 'Direct passthrough to any API-Sports endpoint' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#121319] border border-[#272935] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 bg-[#171822] border-b border-[#232530] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                LiveScore API Hub & Endpoint Suite
              </h2>
              <p className="text-xs text-gray-400">
                All 17 LiveScore & API-Football (v3.football.api-sports.io) endpoints connected
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#20222d] hover:bg-[#2b2e3c] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#15161d] border-b border-[#232530] text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white hover:bg-[#20222c]'
            }`}
          >
            Connection Status
          </button>
          <button
            onClick={() => {
              setActiveTab('explorer');
              if (!explorerResponse) executeExplorerRequest('/api/fixtures/live');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'explorer'
                ? 'bg-emerald-500 text-black font-extrabold shadow'
                : 'text-gray-300 hover:text-white hover:bg-[#20222c]'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Interactive API Tester</span>
          </button>
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'endpoints'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white hover:bg-[#20222c]'
            }`}
          >
            All 17 Endpoints Directory
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'providers'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white hover:bg-[#20222c]'
            }`}
          >
            5 Supported Providers
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: OVERVIEW & STATUS */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Active Connection Banner */}
              <div className="p-4 rounded-xl bg-[#181922] border border-[#272935] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3.5 h-3.5 rounded-full ${
                      statusData?.isConfigured
                        ? 'bg-emerald-500 animate-pulse'
                        : statusData?.connectionTest === 'placeholder_detected'
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-zinc-500'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-white">
                      <span>Primary Provider: API-Football</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          statusData?.isConfigured
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                            : statusData?.connectionTest === 'placeholder_detected'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {statusData?.isConfigured
                          ? 'Direct API Key Active'
                          : statusData?.connectionTest === 'placeholder_detected'
                          ? 'Action Required: Replace Placeholder Key'
                          : 'Live Simulation & Fallback Mode'}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 mt-0.5 block">
                      Target URL: <code className="text-gray-300 font-mono">https://v3.football.api-sports.io</code>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleTestLiveFeed}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-[#232532] hover:bg-[#2e3142] text-white font-bold rounded-xl border border-[#353849] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Test /api/fixtures/live</span>
                  </button>
                </div>
              </div>

              {/* Placeholder Key Detected Warning */}
              {statusData?.connectionTest === 'placeholder_detected' && (
                <div className="p-4 bg-amber-950/40 rounded-xl border border-amber-500/40 text-xs text-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Template Key Detected in .env</span>
                  </div>
                  <p className="leading-relaxed">
                    You have <code className="bg-black/40 px-1 py-0.5 rounded font-mono">FOOTBALL_API_KEY=your_actual_api_key_here</code>.
                    To connect to live matches, replace <code className="text-white font-mono">&quot;your_actual_api_key_here&quot;</code> in your <code className="text-white font-mono">.env</code> file with your actual 32-character key from your API-Sports dashboard.
                  </p>
                </div>
              )}

              {testResult && (
                <div className="p-3 bg-[#13141a] rounded-xl border border-emerald-500/30 text-emerald-300 font-mono text-[11px] leading-relaxed">
                  {testResult}
                </div>
              )}

              {/* Secure Architecture Note */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/20 to-slate-900/40 border border-blue-900/30 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <Server className="w-4 h-4" />
                  <span>How to connect your API Key:</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-xs">
                  1. Get your API key from <a href="https://dashboard.api-football.com" target="_blank" rel="noreferrer" className="text-amber-400 underline font-bold">dashboard.api-football.com</a>.
                  <br />
                  2. Open <code className="text-amber-300 font-mono">.env</code> in your project root.
                  <br />
                  3. Set your credentials:
                </p>
                <div className="bg-black/60 p-3 rounded-lg border border-white/5 font-mono text-[11px] text-gray-300 leading-relaxed select-all">
                  <span className="text-emerald-400">FOOTBALL_API_KEY</span>=&quot;YOUR_REAL_API_KEY_HERE&quot;
                  <br />
                  <span className="text-blue-400">FOOTBALL_API_URL</span>=&quot;https://v3.football.api-sports.io&quot;
                </div>
                <p className="text-gray-400 text-[11px]">
                  The server reloads <code className="text-gray-300 font-mono">.env</code> automatically without requiring a server restart!
                </p>
              </div>

              {/* Quick Feature Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {[
                  'Live Score Ticker',
                  'Match Statistics',
                  'Lineup Formations',
                  'Goal & Card Events',
                  'League Standings',
                  'H2H Historical Record',
                  'Audio Whistle Alerts',
                  'Multi-Sport Feeds',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-1.5 p-2 bg-[#171821] rounded-lg border border-[#232530]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px] font-medium text-gray-300 truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE LIVE API TESTER */}
          {activeTab === 'explorer' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#181922] rounded-xl border border-[#272935] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">
                    Choose Endpoint to Execute:
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Proxy Base: /api
                  </span>
                </div>

                {/* Dropdown Selector */}
                <select
                  value={selectedEndpoint}
                  onChange={(e) => {
                    setSelectedEndpoint(e.target.value);
                    setCustomPath(e.target.value);
                    executeExplorerRequest(e.target.value);
                  }}
                  className="w-full bg-[#111218] border border-[#2c2e3c] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer font-mono"
                >
                  {endpointsList.map((ep, i) => (
                    <option key={i} value={ep.proxyPath}>
                      {ep.name} &rarr; {ep.proxyPath}
                    </option>
                  ))}
                </select>

                {/* Endpoint URL Input & Run Button */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-[#111218] border border-[#2c2e3c] rounded-lg px-3 py-2 font-mono text-xs">
                    <span className="text-emerald-400 font-bold mr-2">GET</span>
                    <input
                      type="text"
                      value={customPath}
                      onChange={(e) => setCustomPath(e.target.value)}
                      placeholder="/api/fixtures/live"
                      className="w-full bg-transparent text-white focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => executeExplorerRequest(customPath)}
                    disabled={isExecuting}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {isExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Execute</span>
                  </button>
                </div>
              </div>

              {/* Response Panel */}
              {explorerResponse && (
                <div className="bg-[#111218] border border-[#272935] rounded-xl overflow-hidden shadow-xl">
                  {/* Response Meta Header */}
                  <div className="px-4 py-2.5 bg-[#171822] border-b border-[#272935] flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-bold text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Status: {explorerResponse.status} OK
                      </span>
                      <span className="text-gray-400">
                        Latency: <span className="font-mono text-white">{explorerResponse.latencyMs}ms</span>
                      </span>
                      <span className="text-gray-400">
                        Source:{' '}
                        <span className="font-mono text-amber-400">{explorerResponse.source}</span>
                      </span>
                    </div>

                    <button
                      onClick={copyExplorerJson}
                      className="flex items-center gap-1 text-gray-400 hover:text-white px-2 py-0.5 rounded hover:bg-[#252735] transition-colors cursor-pointer"
                    >
                      {copiedExplorer ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedExplorer ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>

                  {/* JSON Code Viewport */}
                  <pre className="p-4 text-xs font-mono text-gray-200 overflow-x-auto max-h-80 leading-relaxed bg-[#0c0d12]">
                    {JSON.stringify(explorerResponse.body, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ENDPOINTS & CODE DIRECTORY */}
          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              <p className="text-gray-400">
                All 17 API-Football / API-Sports endpoints connected and proxied through <code className="text-amber-300 font-mono">/server.ts</code>:
              </p>

              <div className="space-y-2">
                {endpointsList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#181922] border border-[#262834] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold font-mono text-[10px]">
                          {item.method}
                        </span>
                        <code className="text-xs font-mono font-bold text-white">
                          {item.proxyPath}
                        </code>
                        <span className="text-[10px] text-gray-500 font-mono hidden md:inline">
                          &rarr; {item.endpoint}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        <span className="font-semibold text-gray-300">{item.name}</span> — {item.desc}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedEndpoint(item.proxyPath);
                          setCustomPath(item.proxyPath);
                          setActiveTab('explorer');
                          executeExplorerRequest(item.proxyPath);
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-white px-2 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/50 transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Run</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(`https://v3.football.api-sports.io${item.endpoint}`, idx)}
                        className="flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-white px-2 py-1 rounded bg-[#222430] hover:bg-[#2b2e3e] transition-colors cursor-pointer"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Code Snippet */}
              <div className="bg-[#111218] border border-[#242633] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 font-mono text-[11px]">Integration Example (JavaScript Fetch)</span>
                  <Code2 className="w-4 h-4 text-gray-500" />
                </div>
                <pre className="p-3 bg-black/60 rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`const response = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
  headers: {
    "x-apisports-key": process.env.FOOTBALL_API_KEY
  }
});
const data = await response.json();
console.log(data.response);`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: SUPPORTED PROVIDERS */}
          {activeTab === 'providers' && (
            <div className="space-y-3">
              {[
                {
                  id: 'api-football',
                  name: '1. API-Football (API-Sports)',
                  badge: 'Recommended & Connected',
                  badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-700/50',
                  desc: 'Comprehensive live scores, lineups, match statistics, standings, head-to-head, and odds across 1,000+ leagues.',
                  url: 'https://v3.football.api-sports.io',
                  docUrl: 'https://www.api-football.com/documentation-v3',
                },
                {
                  id: 'sportmonks',
                  name: '2. Sportmonks Football API',
                  badge: 'Supported',
                  badgeColor: 'bg-blue-950 text-blue-400 border-blue-700/50',
                  desc: 'High-frequency live data, detailed xG metrics, player stats, predictions, and betting odds.',
                  url: 'https://api.sportmonks.com/v3/football',
                  docUrl: 'https://docs.sportmonks.com',
                },
                {
                  id: 'api-sports',
                  name: '3. API Sports Multi-Sport',
                  badge: 'Supported',
                  badgeColor: 'bg-purple-950 text-purple-400 border-purple-700/50',
                  desc: 'Unified authentication for Football, Basketball, Tennis, Baseball, and Ice Hockey.',
                  url: 'https://api-sports.io',
                  docUrl: 'https://api-sports.io/documentation',
                },
                {
                  id: 'livescore-json',
                  name: '4. LiveScoreJSON',
                  badge: 'Supported',
                  badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-600',
                  desc: 'Live match commentary feed, transfer rumors, league tables, and team rosters.',
                  url: 'https://livescore-api.com',
                  docUrl: 'https://livescore-api.com/api-client',
                },
                {
                  id: 'live-score-api',
                  name: '5. Live-Score-API',
                  badge: 'Supported',
                  badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-600',
                  desc: 'Fast live football scores, fixtures, historical results, and match statistics.',
                  url: 'https://live-score-api.com',
                  docUrl: 'https://live-score-api.com/documentation',
                },
              ].map((prov) => (
                <div key={prov.id} className="p-4 bg-[#181922] border border-[#272935] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white">{prov.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${prov.badgeColor}`}>
                        {prov.badge}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-1">{prov.desc}</p>
                    <code className="text-[11px] text-gray-500 font-mono mt-1 block">{prov.url}</code>
                  </div>

                  <a
                    href={prov.docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#222430] hover:bg-[#2b2e3e] text-gray-300 hover:text-white transition-colors shrink-0 font-bold"
                  >
                    <span>Docs</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
