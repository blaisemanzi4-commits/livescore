import React from 'react';
import { Search, Bell, Moon, Sun, Volume2, VolumeX, Radio, Trophy, Bookmark } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  activeTab: 'scores' | 'news' | 'favourites' | 'standings';
  setActiveTab: (tab: 'scores' | 'news' | 'favourites' | 'standings') => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenApiProviders: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  liveMatchesCount: number;
  favouritesCount: number;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenNotifications,
  onOpenApiProviders,
  isDark,
  toggleTheme,
  liveMatchesCount,
  favouritesCount,
  isSimulating,
  setIsSimulating,
}) => {
  const [soundOn, setSoundOn] = React.useState(soundEffects.isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundEffects.setSoundEnabled(next);
    if (next) soundEffects.playWhistle();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d0e]/95 dark:bg-[#0c0d0e]/95 backdrop-blur-md border-b border-[#22242a] px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand & Primary Navigation */}
        <div className="flex items-center gap-6 sm:gap-8">
          {/* LiveScore Logo */}
          <button
            onClick={() => setActiveTab('scores')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            aria-label="LiveScore Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#ee4036] flex items-center justify-center font-black text-white text-base tracking-tighter shadow-md shadow-red-600/20 group-hover:bg-[#ff4e00] transition-colors">
              LS
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                LiveScore
              </span>
              <span className="text-[10px] text-gray-400 font-bold ml-0.5">™</span>
            </div>
          </button>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('scores')}
              className={`relative px-3.5 py-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer rounded-lg ${
                activeTab === 'scores'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1b20]'
              }`}
            >
              Scores
              {liveMatchesCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#ee4036] text-white">
                  {liveMatchesCount}
                </span>
              )}
              {activeTab === 'scores' && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#ee4036] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`relative px-3.5 py-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer rounded-lg ${
                activeTab === 'news'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1b20]'
              }`}
            >
              News
              {activeTab === 'news' && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#ee4036] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('favourites')}
              className={`relative px-3.5 py-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer rounded-lg flex items-center gap-1.5 ${
                activeTab === 'favourites'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1b20]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Favourites
              {favouritesCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#2a2d36] text-amber-400">
                  {favouritesCount}
                </span>
              )}
              {activeTab === 'favourites' && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#ee4036] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('standings')}
              className={`relative px-3.5 py-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer rounded-lg hidden md:flex items-center gap-1.5 ${
                activeTab === 'standings'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1b20]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Tables
              {activeTab === 'standings' && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#ee4036] rounded-full" />
              )}
            </button>
          </nav>
        </div>

        {/* Right Action Icons & Simulation Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* API Connection Hub Button */}
          <button
            onClick={onOpenApiProviders}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#181a22] hover:bg-[#232634] border border-[#2c2f3e] text-gray-200 transition-colors cursor-pointer"
            title="Inspect API-Football & Provider Connections"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="hidden sm:inline">API-Sports</span>
            <span className="sm:hidden">API</span>
          </button>

          {/* Live Simulator Toggle Indicator */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            title={isSimulating ? 'Live simulation active (click to pause)' : 'Simulation paused (click to resume)'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              isSimulating
                ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-400'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400'
            }`}
          >
            <Radio className={`w-3 h-3 ${isSimulating ? 'animate-pulse text-emerald-400' : 'text-zinc-500'}`} />
            <span>{isSimulating ? 'LIVE TICKER' : 'SIM PAUSED'}</span>
          </button>

          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 bg-[#16171c] hover:bg-[#202228] border border-[#262830] rounded-lg transition-colors cursor-pointer"
            title="Search teams, players and competitions"
          >
            <Search className="w-3.5 h-3.5 text-gray-300" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden lg:inline text-[10px] text-gray-500 bg-[#0e0f12] px-1.5 py-0.5 rounded border border-[#2a2d36]">
              ⌘K
            </kbd>
          </button>

          {/* Sound Mute / Unmute */}
          <button
            onClick={handleToggleSound}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#1f2127] rounded-lg transition-colors cursor-pointer"
            title={soundOn ? 'Sound alerts enabled' : 'Sound alerts muted'}
            aria-label="Toggle sound"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          {/* Notification Alerts */}
          <button
            onClick={onOpenNotifications}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#1f2127] rounded-lg transition-colors relative cursor-pointer"
            title="Notification Settings"
            aria-label="Notification Settings"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ee4036]" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#1f2127] rounded-lg transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
