import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0c0d0e] border-t border-[#1e2028] text-gray-400 text-xs py-12 px-4 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Intro Block (matching Screenshot 5) */}
        <div className="space-y-3 max-w-4xl">
          <h2 className="text-base sm:text-lg font-black text-white">
            Live Football Scores, Fixtures & Results
          </h2>
          <h3 className="text-xs font-bold text-gray-300">
            LiveScore – Latest Football Scores, Results, Fixtures and Tables
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Keep up to date with today&apos;s football fixtures and results with LiveScore! We cover all countries, leagues, and competitions in unbeatable detail.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            The number one destination for real time scores for Football, Cricket, Tennis, Basketball, Hockey and more. LiveScore.com is the go-to destination for latest football scores and news from around the world. Up to date tables, fixtures and scores from all the major leagues and competitions throughout the world live as they happen including the Premier League, Scottish Premiership, EFL Championship, La Liga, Serie A, Bundesliga, Ligue 1 and Europe&apos;s biggest competitions such as the Champions League and Europa League.
          </p>
        </div>

        {/* 5 Column Link Section (matching Screenshot 5) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-8 border-t border-[#1a1b22]">
          {/* Col 1: Football */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">
              Football
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#scores" className="hover:text-white transition-colors">Premier League Scores</a></li>
              <li><a href="#scores" className="hover:text-white transition-colors">EFL Championship Scores</a></li>
              <li><a href="#scores" className="hover:text-white transition-colors">Scottish Premiership Scores</a></li>
              <li><a href="#scores" className="hover:text-white transition-colors">LaLiga Scores</a></li>
              <li><a href="#scores" className="hover:text-white transition-colors">Serie A Scores</a></li>
              <li><a href="#scores" className="hover:text-white transition-colors">Nations League Fixtures</a></li>
            </ul>
          </div>

          {/* Col 2: Other Sports */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">
              Other Sports
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#scores" className="hover:text-white transition-colors">Cricket Scores</a></li>
              <li><a href="#scores" className="hover:text-white transition-colors">Tennis Scores</a></li>
              <li><a href="#scores" className="hover:text-white transition-colors">Basketball Scores</a></li>
              <li><a href="#scores" className="hover:text-white transition-colors">Ice Hockey Scores</a></li>
            </ul>
          </div>

          {/* Col 3: Trending */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">
              Trending
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#scores" className="hover:text-white transition-colors">Today&apos;s Live Football Scores</a></li>
              <li><a href="#scores" className="hover:text-white transition-colors">Football on TV</a></li>
              <li><a href="#scores" className="hover:text-white transition-colors">Premier League News</a></li>
              <li><a href="#scores" className="hover:text-white transition-colors">Sports Predictions</a></li>
              <li><a href="#scores" className="hover:text-white transition-colors">Nations League Scores</a></li>
              <li><a href="#scores" className="hover:text-white transition-colors">Nations League Standings</a></li>
            </ul>
          </div>

          {/* Col 4: Betting */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">
              Betting
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white cursor-pointer">Betting Sites UK</span></li>
              <li><span className="hover:text-white cursor-pointer">Free Bets</span></li>
              <li><span className="hover:text-white cursor-pointer">Betting Sites US</span></li>
              <li><span className="hover:text-white cursor-pointer">Betting Sites ZA</span></li>
              <li><span className="hover:text-white cursor-pointer">Betting Sites CA</span></li>
              <li><span className="hover:text-white cursor-pointer">Betting Sites IE</span></li>
            </ul>
          </div>

          {/* Col 5: Casino */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">
              Casino
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white cursor-pointer">Casino Sites UK</span></li>
              <li><span className="hover:text-white cursor-pointer">Free Spins UK</span></li>
              <li><span className="hover:text-white cursor-pointer">Casino Sites IE</span></li>
              <li><span className="hover:text-white cursor-pointer">Free Spins ZA</span></li>
              <li><span className="hover:text-white cursor-pointer">Free Spins US</span></li>
              <li><span className="hover:text-white cursor-pointer">Casino Sites CA</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Brand Logo */}
        <div className="pt-8 border-t border-[#1a1b22] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#ee4036] flex items-center justify-center font-black text-white text-xs">
              LS
            </div>
            <span className="font-extrabold text-white text-sm">LiveScore™</span>
            <span>© 1998-2026 LiveScore. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <span className="hover:text-white cursor-pointer">Cookie Policy</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Terms of Use</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Help Centre</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
