import React from 'react';
import { Play, Pause, FastForward, PlusCircle, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface LiveSimulationControllerProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  simulationSpeed: number;
  onSetSimulationSpeed: (speed: number) => void;
  onTriggerGoal: (team: 'home' | 'away') => void;
  onTriggerCard: (type: 'yellow' | 'red') => void;
  onTriggerVar: () => void;
  onAdvanceClock: (mins: number) => void;
  activeLiveMatchTitle: string;
}

export const LiveSimulationController: React.FC<LiveSimulationControllerProps> = ({
  isSimulating,
  onToggleSimulation,
  simulationSpeed,
  onSetSimulationSpeed,
  onTriggerGoal,
  onTriggerCard,
  onTriggerVar,
  onAdvanceClock,
  activeLiveMatchTitle,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-40">
      <div className="bg-[#121319]/95 backdrop-blur-md border border-[#2b2d39] rounded-2xl shadow-2xl overflow-hidden p-3 transition-all">
        {/* Header / Summary */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSimulation}
              className={`p-2 rounded-xl text-white font-black flex items-center justify-center transition-all cursor-pointer shadow ${
                isSimulating
                  ? 'bg-[#ee4036] hover:bg-[#ff4e00]'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
              title={isSimulating ? 'Pause Match Clock' : 'Start Match Clock'}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-[#ee4036] animate-pulse" />
                <span>Simulation Studio</span>
                <span className="text-[10px] text-gray-400 font-mono">({simulationSpeed}x)</span>
              </div>
              <div className="text-[10px] text-gray-400 truncate max-w-[160px] sm:max-w-xs">
                Live target: {activeLiveMatchTitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Speed Pills */}
            <div className="flex items-center gap-0.5 bg-[#1b1c24] p-0.5 rounded-lg border border-[#262834]">
              {[1, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => onSetSimulationSpeed(s)}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                    simulationSpeed === s
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] text-gray-400 hover:text-white px-1.5 py-1 rounded hover:bg-[#1f212b] transition-colors cursor-pointer"
            >
              {isExpanded ? 'Hide' : 'Controls'}
            </button>
          </div>
        </div>

        {/* Action Triggers Bar */}
        {isExpanded && (
          <div className="mt-3 pt-2.5 border-t border-[#232530] flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-1">
              Test Events:
            </span>

            <button
              onClick={() => onTriggerGoal('home')}
              className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/50 rounded-lg text-[11px] font-bold text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="Simulate Home Team Goal"
            >
              <span>⚽ +1 Home</span>
            </button>

            <button
              onClick={() => onTriggerGoal('away')}
              className="px-2 py-1 bg-blue-950/60 hover:bg-blue-900 border border-blue-700/50 rounded-lg text-[11px] font-bold text-blue-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="Simulate Away Team Goal"
            >
              <span>⚽ +1 Away</span>
            </button>

            <button
              onClick={() => onTriggerCard('red')}
              className="px-2 py-1 bg-red-950/60 hover:bg-red-900 border border-red-700/50 rounded-lg text-[11px] font-bold text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="Simulate Red Card"
            >
              <span>🟥 Red Card</span>
            </button>

            <button
              onClick={onTriggerVar}
              className="px-2 py-1 bg-purple-950/60 hover:bg-purple-900 border border-purple-700/50 rounded-lg text-[11px] font-bold text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
              title="Simulate VAR Check"
            >
              <Zap className="w-3 h-3 text-purple-400" />
              <span>VAR Check</span>
            </button>

            <button
              onClick={() => onAdvanceClock(5)}
              className="px-2 py-1 bg-[#1f212a] hover:bg-[#282a36] border border-[#2b2d39] rounded-lg text-[11px] font-bold text-gray-300 flex items-center gap-1 transition-colors cursor-pointer"
              title="Advance Clock +5 mins"
            >
              <FastForward className="w-3 h-3 text-gray-400" />
              <span>+5m</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
