import React from 'react';
import { NEWS_ARTICLES } from '../data/mockSportsData';
import { NewsArticle } from '../types/sports';
import { Clock, Share2, X, ChevronRight, Bookmark } from 'lucide-react';

export const NewsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState<
    'Home' | 'Football' | 'Predictions' | 'Premier League' | 'Transfers' | 'Daily Roundups'
  >('Home');
  const [selectedArticle, setSelectedArticle] = React.useState<NewsArticle | null>(null);

  const categories: Array<'Home' | 'Football' | 'Predictions' | 'Premier League' | 'Transfers' | 'Daily Roundups'> = [
    'Home',
    'Football',
    'Predictions',
    'Premier League',
    'Transfers',
    'Daily Roundups',
  ];

  const filteredArticles = React.useMemo(() => {
    if (activeCategory === 'Home') return NEWS_ARTICLES;
    return NEWS_ARTICLES.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  const featured = filteredArticles[0] || NEWS_ARTICLES[0];
  const remaining = filteredArticles.slice(1);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Category Pills Bar (matching screenshot 3 and 4) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-[#22242c]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-white text-black font-bold shadow'
                : 'bg-[#181920] hover:bg-[#22242c] text-gray-300 border border-[#2a2c36]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Category Heading */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {activeCategory === 'Predictions' ? 'Predictions' : 'Latest news'}
        </h1>
        <span className="text-xs text-gray-400 font-medium">
          Updated continuously 24/7
        </span>
      </div>

      {/* Featured Headline + Side Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Featured Card (7 cols) */}
        {featured && (
          <div
            onClick={() => setSelectedArticle(featured)}
            className="lg:col-span-7 bg-[#14151b] border border-[#22242c] rounded-2xl overflow-hidden hover:border-[#383a48] transition-all cursor-pointer group shadow-lg flex flex-col"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
              <img
                src={featured.imageUrl}
                alt={featured.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14151b] via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-[#ee4036] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                {featured.category}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-orange-400 transition-colors leading-snug">
                  {featured.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                  {featured.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#20222a] flex items-center justify-between text-[11px] text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-300">{featured.publisher}</span>
                  <span>·</span>
                  <span>{featured.publishedAt}</span>
                </div>
                <span>{featured.readTime}</span>
              </div>
            </div>
          </div>
        )}

        {/* Side Stack Articles (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {remaining.slice(0, 4).map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="flex items-center gap-3 p-3 bg-[#14151b] hover:bg-[#1b1c24] border border-[#22242c] hover:border-[#383a48] rounded-xl transition-all cursor-pointer group"
            >
              <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-zinc-900">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                  {art.title}
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1.5">
                  <span className="font-semibold text-gray-300">{art.publisher}</span>
                  <span>·</span>
                  <span>{art.publishedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* More News Grid */}
      {remaining.length > 4 && (
        <div className="pt-4">
          <h3 className="text-base font-extrabold text-white mb-4">More Top Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {remaining.slice(4).map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-[#14151b] border border-[#22242c] rounded-xl overflow-hidden hover:border-[#383a48] transition-all cursor-pointer group flex flex-col"
              >
                <div className="h-40 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                    {art.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-3 pt-2 border-t border-[#20222a]">
                    <span>{art.publisher}</span>
                    <span>{art.publishedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#121319] border border-[#272935] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="p-4 bg-[#171822] border-b border-[#272935] flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#232532] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-3 text-xs text-gray-400 pb-3 border-b border-[#232530]">
                <span className="font-bold text-white">{selectedArticle.publisher}</span>
                <span>·</span>
                <span>By {selectedArticle.author}</span>
                <span>·</span>
                <span>{selectedArticle.publishedAt}</span>
              </div>

              <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-sm font-semibold text-gray-200 leading-relaxed">
                {selectedArticle.summary}
              </p>

              <div className="text-sm text-gray-300 leading-relaxed space-y-3 pt-2">
                <p>{selectedArticle.content}</p>
                <p>
                  Sports analysts will continue monitoring training ground updates ahead of this week&apos;s competitive fixtures. Stay tuned to LiveScore for continuous breaking updates, real-time match events, and post-game reaction.
                </p>
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-[#232530] flex flex-wrap items-center gap-2">
                {selectedArticle.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-medium text-gray-400 bg-[#1a1b24] px-2.5 py-1 rounded-md border border-[#262835]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
