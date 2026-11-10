import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Radio } from 'lucide-react';

interface DateNavigatorProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  isLiveOnly: boolean;
  onToggleLiveOnly: () => void;
  liveMatchesCount: number;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  selectedDate,
  onSelectDate,
  isLiveOnly,
  onToggleLiveOnly,
  liveMatchesCount,
}) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  // Helper to calculate previous & next date
  const shiftDate = (days: number) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + days);
    const yyyy = cur.getFullYear();
    const mm = String(cur.getMonth() + 1).padStart(2, '0');
    const dd = String(cur.getDate()).padStart(2, '0');
    onSelectDate(`${yyyy}-${mm}-${dd}`);
  };

  // Helper label (Today, Yesterday, Tomorrow, or Mon 10 Nov)
  const getDateLabel = () => {
    const target = new Date(selectedDate);
    const today = new Date('2026-11-10'); // Anchor to current context date
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 1) return 'Tomorrow';

    return target.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const dayNumber = new Date(selectedDate).getDate();

  return (
    <div className="relative w-full bg-[#14151a] border-b border-[#23252e] px-4 py-2.5">
      <div className="flex items-center justify-between gap-3">
        {/* Left: LIVE pill filter */}
        <button
          onClick={onToggleLiveOnly}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            isLiveOnly
              ? 'bg-[#ee4036] text-white shadow-sm shadow-red-600/30'
              : 'bg-[#21232c] hover:bg-[#2b2e3a] text-gray-300 border border-[#2f3240]'
          }`}
          title="Filter live matches only"
        >
          <Radio className={`w-3.5 h-3.5 ${isLiveOnly ? 'animate-pulse' : 'text-gray-400'}`} />
          <span>LIVE</span>
          {liveMatchesCount > 0 && (
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                isLiveOnly ? 'bg-white text-[#ee4036]' : 'bg-[#ee4036] text-white'
              }`}
            >
              {liveMatchesCount}
            </span>
          )}
        </button>

        {/* Center: Prev - Date - Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftDate(-1)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#262833] rounded-md transition-colors cursor-pointer"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectDate('2026-11-10')}
            className="px-3 py-1 text-sm font-bold text-white hover:text-orange-400 transition-colors cursor-pointer"
          >
            {getDateLabel()}
          </button>

          <button
            onClick={() => shiftDate(1)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#262833] rounded-md transition-colors cursor-pointer"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Calendar picker button [10] */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#21232c] hover:bg-[#2b2e3a] border border-[#2f3240] rounded-md text-xs font-bold text-white transition-colors cursor-pointer"
            title="Pick a date"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
            <span className="tabular-nums">{dayNumber}</span>
          </button>

          {/* Quick Date Picker Dropdown */}
          {showDatePicker && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#18191e] border border-[#2a2c36] rounded-xl shadow-2xl p-2 z-50">
              <div className="text-[11px] font-semibold text-gray-400 px-2 py-1 mb-1">
                Jump to match date
              </div>
              <div className="space-y-1">
                {[
                  { label: 'Yesterday (9 Nov)', val: '2026-11-09' },
                  { label: 'Today (10 Nov)', val: '2026-11-10' },
                  { label: 'Tomorrow (11 Nov)', val: '2026-11-11' },
                  { label: 'Wed 12 Nov', val: '2026-11-12' },
                  { label: 'Thu 13 Nov', val: '2026-11-13' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => {
                      onSelectDate(item.val);
                      setShowDatePicker(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      selectedDate === item.val
                        ? 'bg-[#ee4036] text-white font-bold'
                        : 'text-gray-300 hover:bg-[#23252d]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedDate === item.val && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
