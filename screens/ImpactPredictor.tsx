
import React, { useState } from 'react';
import { Screen } from '../types';
import { ICONS } from '../constants';
import { getSimulationResults } from '../services/geminiService';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const FutureWaveSimulator: React.FC<Props> = ({ onNavigate }) => {
  const [scenario, setScenario] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async () => {
    if (!scenario.trim()) return;
    setIsSimulating(true);
    setResult(null);
    try {
      const data = await getSimulationResults(scenario);
      setResult(data);
    } catch (err) {
      alert("Simulation interrupted by oceanic interference.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-32">
      {/* Simulation Header */}
      <div className="relative pt-16 px-8 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-transparent" />
        
        {/* Animated Scanline */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-500/30 shadow-[0_0_15px_#22d3ee] animate-[scan_4s_linear_infinite]" />

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em]">FutureWave v3.0</p>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Impact Simulator</h1>
          <p className="text-slate-400 text-sm mt-3 font-medium leading-relaxed">
            Predict the decade-long consequences of environmental actions using advanced ecological modeling.
          </p>
        </div>
      </div>

      <div className="px-6 space-y-8 relative z-20">
        {/* Input Scenario */}
        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
          <label className="text-[10px] font-black text-cyan-400/60 uppercase tracking-widest block mb-4">Hypothetical Scenario</label>
          <textarea 
            rows={4}
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="e.g., What if we ban all single-use plastics in the Pacific Northwest for 50 years?"
            className="w-full bg-transparent border-0 outline-none text-lg font-bold placeholder-white/10 resize-none text-white focus:ring-0"
          />
          <button 
            onClick={handleSimulate}
            disabled={isSimulating || !scenario.trim()}
            className={`w-full mt-6 py-5 rounded-[2rem] font-black text-sm transition-all flex items-center justify-center space-x-3 shadow-2xl ${
              isSimulating || !scenario.trim() 
                ? 'bg-slate-800 text-slate-500' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20 active:scale-95'
            }`}
          >
            {isSimulating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="animate-pulse">RUNNING MODEL...</span>
              </>
            ) : (
              <>
                <ICONS.Zap size={18} fill="white" />
                <span>INITIATE SIMULATION</span>
              </>
            )}
          </button>
        </div>

        {/* Results HUD */}
        {result && (
          <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <HUDCard 
                label="Vitality Index" 
                value={`${result.vitalityIndex}%`} 
                color={result.vitalityIndex > 70 ? 'text-emerald-400' : 'text-orange-400'} 
                icon={<ICONS.Heart size={16} />} 
              />
              <HUDCard 
                label="Recovery Time" 
                value={result.recoveryTime} 
                color="text-cyan-400" 
                icon={<ICONS.Clock size={16} />} 
              />
            </div>

            <div className="bg-white/5 backdrop-blur-md p-8 rounded-[3rem] border border-white/10 shadow-2xl">
              <h3 className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4">Forecast Analysis</h3>
              <p className="text-lg font-bold leading-snug mb-6">{result.primaryImpact}</p>
              
              <div className="space-y-3">
                {result.speciesForecast.map((s: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                    <span className="text-sm font-black text-slate-300">{s.species}</span>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      s.status.toLowerCase().includes('thrive') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Recommendation</p>
                <p className="text-sm font-medium text-cyan-100/80 italic">"{result.recommendation}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder state */}
        {!result && !isSimulating && (
          <div className="py-20 flex flex-col items-center justify-center opacity-20">
            <div className="relative">
              <div className="w-24 h-24 border-2 border-dashed border-cyan-500 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ICONS.Sparkles size={32} />
              </div>
            </div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-center">Awaiting Input Data</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0.1; }
          50% { opacity: 0.8; }
          100% { transform: translateY(400px); opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};

const HUDCard = ({ label, value, color, icon }: { label: string, value: string, color: string, icon: any }) => (
  <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 flex flex-col space-y-2">
    <div className="flex items-center space-x-2 text-slate-500">
      {icon}
      <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-2xl font-black ${color} tracking-tighter`}>{value}</span>
  </div>
);

export default FutureWaveSimulator;
