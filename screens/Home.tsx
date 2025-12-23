
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617]">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin" />
        <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin [animation-duration:1.5s]" />
      </div>
      <p className="mt-8 font-black uppercase tracking-[0.4em] text-[10px] text-cyan-400/60">Linking Satellite Feed...</p>
    </div>
  );

  const xpProgress = (data.user.points % 500) / 500 * 100;

  return (
    <div className="animate-in fade-in duration-1000 pb-40">
      {/* Immersive Header */}
      <header className="relative pt-20 px-8 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-blue-900 to-[#020617] -z-10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 -z-10" />
        
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em]">Guardian V1.2 ONLINE</p>
            </div>
            <h1 className="text-white text-5xl font-black tracking-tighter">
              Hey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{data.user.name}!</span>
            </h1>
          </div>
          <button onClick={() => onNavigate('profile')} className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition-opacity" />
            <div className="relative w-16 h-16 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/20 flex items-center justify-center text-4xl shadow-2xl transition-all active:scale-90 overflow-hidden">
              <span className="z-10">{data.user.avatar}</span>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
            </div>
          </button>
        </div>

        {/* Level Stats Card */}
        <div className="mt-12 bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-1">Impact Tier</p>
              <h3 className="text-white text-2xl font-black tracking-tighter">Ocean Level {data.user.level}</h3>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-white/90">{Math.round(xpProgress)}%</span>
            </div>
          </div>
          <div className="h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full relative transition-all duration-1000 ease-out"
              style={{ width: `${xpProgress}%` }}
            >
              <div className="absolute inset-0 opacity-20 animate-[scan_2s_linear_infinite] bg-white w-full h-full" />
            </div>
          </div>
          <p className="text-[9px] font-bold text-slate-500 mt-4 uppercase tracking-widest text-center">
            {500 - (data.user.points % 500)} XP to next milestone
          </p>
        </div>
      </header>

      {/* Grid Menu */}
      <div className="px-6 -mt-16 grid grid-cols-2 gap-4 relative z-20">
        <GlassMenuBtn 
          icon={<ICONS.Camera className="text-cyan-400" />} 
          label="Report" 
          desc="Log Evidence"
          color="cyan"
          onClick={() => onNavigate('report')} 
        />
        <GlassMenuBtn 
          icon={<ICONS.Zap className="text-purple-400" />} 
          label="Simulate" 
          desc="Impact Model"
          color="purple"
          onClick={() => onNavigate('predictor')} 
        />
        <GlassMenuBtn 
          icon={<ICONS.Calendar className="text-orange-400" />} 
          label="Events" 
          desc="Join Mission"
          color="orange"
          onClick={() => onNavigate('events')} 
        />
        <GlassMenuBtn 
          icon={<ICONS.BookOpen className="text-emerald-400" />} 
          label="Academy" 
          desc="Knowledge"
          color="emerald"
          onClick={() => onNavigate('education')} 
        />
      </div>

      {/* Impact Stream */}
      <section className="mt-12 px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-white text-xl font-black tracking-tighter uppercase tracking-[0.1em]">Impact Stream</h2>
          <button 
            onClick={handleRefresh} 
            className={`p-3 bg-white/5 rounded-2xl border border-white/10 text-cyan-400 transition-all active:scale-90 ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <ICONS.Activity size={18} />
          </button>
        </div>
        
        <div className="space-y-4">
          {data.recentActivity.map((activity, idx) => (
            <div 
              key={activity.id} 
              className="group flex items-center space-x-5 bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/5 transition-all hover:bg-white/10 animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {activity.type === 'report' ? <ICONS.Camera className="text-cyan-400" size={20} /> : <ICONS.Calendar className="text-orange-400" size={20} />}
              </div>
              <div className="flex-grow">
                <h4 className="text-white text-sm font-black leading-tight mb-1">{activity.title}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{activity.context} • {activity.timestamp}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-emerald-400">+{activity.points}</span>
                <p className="text-[8px] font-black text-slate-600 uppercase">XP</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

const GlassMenuBtn = ({ icon, label, desc, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="relative group p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] flex flex-col items-start transition-all hover:bg-white/10 active:scale-95 shadow-2xl overflow-hidden"
  >
    <div className={`absolute -top-10 -right-10 w-24 h-24 blur-[40px] opacity-20 bg-${color}-500 transition-opacity group-hover:opacity-40`} />
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/5 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
    </div>
    <span className="text-white text-lg font-black tracking-tight">{label}</span>
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{desc}</span>
  </button>
);

export default Home;
