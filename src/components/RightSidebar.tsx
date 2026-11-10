import React from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { NEWS_ARTICLES } from '../data/mockSportsData';
import { NewsArticle } from '../types/sports';

interface RightSidebarProps {
  onOpenSearchWithFilter: (filter: 'teams' | 'competitions' | 'players') => void;
  onOpenNewsTab: () => void;
  onSelectArticle: (article: NewsArticle) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  onOpenSearchWithFilter,
  onOpenNewsTab,
  onSelectArticle,
}) => {
  const topNews = NEWS_ARTICLES.slice(0, 3);

  return (
    <aside className="w-80 shrink-0 hidden lg:flex flex-col gap-4">
      {/* Search Widget Container (matching screenshot 1) */}
      <div className="bg-[#14151a] border border-[#23252d] rounded-2xl p-4 shadow-sm">
        <button
          onClick={() => onOpenSearchWithFilter('teams')}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#1c1d25] hover:bg-[#252732] border border-[#2b2d39] text-gray-400 text-xs transition-colors cursor-pointer text-left mb-3"
        >
          <Search className="w-4 h-4 text-gray-400" />
          <span>Search</span>
        </button>

        {/* Filter Pills: Teams, Competitions, Players */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenSearchWithFilter('teams')}
            className="flex-1 py-1.5 px-2 bg-[#1f212a] hover:bg-[#2a2c38] text-gray-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
          >
            Teams
          </button>
          <button
            onClick={() => onOpenSearchWithFilter('competitions')}
            className="flex-1 py-1.5 px-2 bg-[#1f212a] hover:bg-[#2a2c38] text-gray-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center truncate"
          >
            Competitions
          </button>
          <button
            onClick={() => onOpenSearchWithFilter('players')}
            className="flex-1 py-1.5 px-2 bg-[#1f212a] hover:bg-[#2a2c38] text-gray-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
          >
            Players
          </button>
        </div>
      </div>

      {/* Latest News Widget (matching screenshot 1) */}
      <div className="bg-[#14151a] border border-[#23252d] rounded-2xl overflow-hidden shadow-sm">
        <div
          onClick={onOpenNewsTab}
          className="flex items-center justify-between px-4 py-3 bg-[#171820] border-b border-[#23252d] hover:bg-[#1e202a] cursor-pointer transition-colors"
        >
          <h3 className="text-xs font-extrabold text-white">Latest news</h3>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        <div className="p-3 space-y-3">
          {topNews.map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#1c1d25] transition-colors cursor-pointer group"
            >
              <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-1">
                  <span className="truncate">{article.publisher}</span>
                  <span>·</span>
                  <span className="shrink-0">{article.publishedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Match Alert Simulation Promo */}
      <div className="bg-gradient-to-br from-[#1a1312] to-[#121318] border border-[#382320] rounded-2xl p-4 shadow-sm text-center">
        <div className="w-8 h-8 rounded-full bg-[#ee4036]/20 text-[#ee4036] flex items-center justify-center mx-auto mb-2 font-black text-sm">
          🔔
        </div>
        <h4 className="text-xs font-bold text-white mb-1">Instant Goal Alerts</h4>
        <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
          Audio whistles, live score popups, and instant timeline updates fire automatically when simulation is running.
        </p>
      </div>
    </aside>
  );
};
