
import React, { useState, useEffect } from 'react';
import { Screen, Activity, User } from '../types';
import { ICONS } from '../constants';
import { ApiService } from '../services/apiService';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const Home: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<{ user: User, stats: any, recentActivity: Activity[] } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    ApiService.fetchHomeData().then(setData);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    ApiService.fetchHomeData().then((newData) => {
      setData(newData);
      setTimeout(() => setIsRefreshing(false), 800);
    });
  };

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-cyan-400">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-cyan-900/30 border-t-cyan-400 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <ICONS.Sparkles size={24} />
        </div>
      </div>
      <p className="mt-6 font-black uppercase tracking-[0.3em] text-[10px]">Initializing Eco-Ecosystem...</p>
    </div>
  );

  const xpProgress = (data.user.points % 500) / 500 * 100;

  return (
    <div className="animate-in fade-in duration-700 pb-32 bg-[#f8fafc] min-h-screen selection:bg-cyan-200">
      <div className="relative h-[420px] overflow-hidden bg-[#083344]">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900 via-blue-900 to-indigo-950" />
        <div className="relative z-10 pt-16 px-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <div className="animate-in slide-in-from-left duration-500">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
                <p className="text-cyan-300 text-[10px] font-black uppercase tracking-[0.4em]">Guardian Status: Active</p>
              </div>
              <h1 className="text-white text-4xl font-black tracking-tighter">
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">{data.user.name.split(' ')[0]}!</span>
              </h1>
            </div>
            <button onClick={() => onNavigate('profile')} className="group relative">
              <div className="relative w-16 h-16 bg-[#0e7490] backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl border border-white/20 transition-all active:scale-90 group-hover:rotate-6">
                {data.user.avatar}
              </div>
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-2xl mt-auto mb-16 group transition-all hover:bg-white/15">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-[10px] font-black text-cyan-300 uppercase tracking-widest">Ocean Level {data.user.level}</p>
                <h4 className="text-white font-black text-lg">Next rank in {500 - (data.user.points % 500)} XP</h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white">{Math.round(xpProgress)}%</span>
              </div>
            </div>
            <div className="h-4 bg-black/20 rounded-full overflow-hidden relative border border-white/10 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-full relative transition-all duration-1000 ease-out overflow-hidden"
                style={{ width: `${xpProgress}%` }}
              >
                <div className="absolute inset-0 opacity-30 animate-[wave_3s_infinite_linear] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat-x" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg className="relative block w-full h-[60px]" viewBox="0 24 150 28" preserveAspectRatio="none">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="animate-[move-forever_25s_cubic-bezier(.55,.5,.45,.5)_infinite]">
              <use href="#gentle-wave" x="48" y="0" fill="rgba(248,250,252,0.7)" />
              <use href="#gentle-wave" x="48" y="7" fill="#f8fafc" />
            </g>
          </svg>
        </div>
      </div>

      <div className="px-6 -mt-8 space-y-10 relative z-20">
        <div className="grid grid-cols-4 gap-4">
          <ActionCircle icon={<ICONS.FileText />} label="Report" color="bg-cyan-500 shadow-cyan-200" onClick={() => onNavigate('report')} />
          <ActionCircle icon={<ICONS.Calendar />} label="Events" color="bg-teal-500 shadow-teal-200" onClick={() => onNavigate('events')} />
          <ActionCircle icon={<ICONS.BookOpen />} label="Learn" color="bg-indigo-500 shadow-indigo-200" onClick={() => onNavigate('education')} />
          <ActionCircle icon={<ICONS.Layers />} label="Predict" color="bg-purple-600 shadow-purple-200" onClick={() => onNavigate('predictor')} />
        </div>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase tracking-[0.1em]">Ecosystem Pulse</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <GlassStat icon={<ICONS.FileText className="text-cyan-600" />} label="Local Reports" value={data.stats.reports} desc="Secure On-Device Storage" />
            <GlassStat icon={<ICONS.User className="text-blue-600" />} label="Heroes Online" value={data.stats.activeUsers} desc="Community Impact" />
          </div>
        </section>

        <section className="pb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase tracking-[0.1em]">Impact Stream</h2>
            <button onClick={handleRefresh} className={`p-2 rounded-xl text-cyan-600 transition-all ${isRefreshing ? 'animate-spin' : ''}`}>
              <ICONS.Zap size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {data.recentActivity && data.recentActivity.length > 0 ? (
              data.recentActivity.map((activity, idx) => (
                <FluidActivityItem key={activity.id} activity={activity} index={idx} />
              ))
            ) : (
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">No Waves Detected</p>
                <p className="text-xs text-slate-300 font-medium">Be the first to create an impact locally.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <button onClick={() => onNavigate('report')} className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-[2rem] shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-40">
        <ICONS.Camera size={28} />
      </button>

      <style>{`
        @keyframes move-forever {
          0% { transform: translate3d(-90px, 0, 0); }
          100% { transform: translate3d(85px, 0, 0); }
        }
        @keyframes wave {
          0% { background-position-x: 0; }
          100% { background-position-x: 1000px; }
        }
      `}</style>
    </div>
  );
};

const GlassStat = ({ icon, label, value, desc }: any) => (
  <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col space-y-3 group hover:-translate-y-1 transition-all">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{value.toLocaleString()}</h3>
      <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter mt-1">{desc}</p>
    </div>
  </div>
);

const ActionCircle = ({ icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center space-y-3 group">
    <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-white transition-all group-hover:-translate-y-2 active:scale-90 shadow-2xl ${color}`}>
      {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
    </div>
    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </button>
);

const FluidActivityItem = ({ activity, index }: any) => (
  <div className="flex items-center space-x-5 bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-lg group hover:shadow-xl transition-all" style={{ animationDelay: `${index * 100}ms` }}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-slate-50 text-slate-600`}>
      <ICONS.Zap size={20} />
    </div>
    <div className="flex-grow overflow-hidden">
      <h4 className="text-sm font-black text-slate-800 leading-none truncate mb-1">{activity.title}</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{activity.context} • {activity.timestamp}</p>
    </div>
    <div className="text-right shrink-0">
      <span className="text-sm font-black text-emerald-500">+{activity.points}</span>
      <p className="text-[8px] font-black text-slate-300 uppercase">XP</p>
    </div>
  </div>
);

export default Home;
