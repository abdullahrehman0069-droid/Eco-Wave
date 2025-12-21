
import React, { useState, useEffect } from 'react';
import { Screen, Activity, User } from '../types';
import { ICONS, GRADIENTS } from '../constants';
import { MockApiService } from '../services/mockApi';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const Home: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<{ user: User, stats: any, recentActivity: Activity[] } | null>(null);

  useEffect(() => {
    MockApiService.fetchHomeData().then(setData);
  }, []);

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-slate-400 bg-slate-50">
      <div className="w-16 h-16 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin mb-6" />
      <p className="font-black uppercase tracking-widest text-[10px]">Initializing Ecosystem...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-24 bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${GRADIENTS.home} pt-16 pb-24 px-8 relative overflow-hidden rounded-b-[4rem] shadow-2xl`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-cyan-100 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Welcome Back</p>
            <h1 className="text-white text-3xl font-black tracking-tight">{data.user.name.split(' ')[0]}</h1>
          </div>
          <button 
            onClick={() => onNavigate('profile')} 
            className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl border border-white/30 transition-transform active:scale-90 hover:rotate-6"
          >
            {data.user.avatar}
          </button>
        </div>
      </div>

      {/* Symmetrical Stats - Overlap */}
      <div className="px-6 -mt-12 grid grid-cols-2 gap-4">
        <StatCard icon={<ICONS.FileText size={20} className="text-cyan-600" />} label="Reports" value={data.stats.reports} color="border-cyan-100" />
        <StatCard icon={<ICONS.Calendar size={20} className="text-teal-600" />} label="Missions" value={data.stats.events} color="border-teal-100" />
        <StatCard icon={<ICONS.User size={20} className="text-blue-600" />} label="Guardians" value={data.stats.activeUsers} color="border-blue-100" />
        <StatCard icon={<ICONS.Trophy size={20} className="text-amber-600" />} label="Current LVL" value={data.user.level} color="border-amber-100" />
      </div>

      {/* Action Center - Grid Symmetrical */}
      <div className="px-8 mt-14">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-2 h-8 bg-cyan-600 rounded-full" />
          <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase tracking-[0.1em]">Control Panel</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <ActionBtn icon={<ICONS.FileText />} label="Log Site" color="bg-cyan-50 text-cyan-600" onClick={() => onNavigate('report')} />
          <ActionBtn icon={<ICONS.Calendar />} label="Missions" color="bg-teal-50 text-teal-600" onClick={() => onNavigate('events')} />
          <ActionBtn icon={<ICONS.BookOpen />} label="Library" color="bg-purple-50 text-purple-600" onClick={() => onNavigate('education')} />
          <ActionBtn icon={<ICONS.Sparkles />} label="Eco AI" color="bg-indigo-50 text-indigo-600" onClick={() => onNavigate('ai')} />
        </div>
      </div>

      {/* Recent Feed - List Symmetry */}
      <div className="px-8 mt-14">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-8 bg-teal-600 rounded-full" />
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase tracking-[0.1em]">Impact Feed</h2>
          </div>
          <button onClick={() => onNavigate('profile')} className="text-[10px] font-black text-cyan-600 bg-cyan-50 px-4 py-2 rounded-xl uppercase tracking-widest active:scale-95 transition-all">All History</button>
        </div>
        <div className="space-y-4">
          {data.recentActivity.length > 0 ? (
            data.recentActivity.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 p-12 rounded-[3rem] text-center">
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest italic">Awaiting First Mission...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) => (
  <div className={`bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border ${color} flex flex-col items-center text-center space-y-2`}>
    <div className="p-3 rounded-2xl bg-slate-50 mb-2">{icon}</div>
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
    <span className="text-3xl font-black text-slate-800 tracking-tighter">{value.toLocaleString()}</span>
  </div>
);

const ActionBtn = ({ icon, label, color, onClick }: { icon: any, label: string, color: string, onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center space-y-3 group">
    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all group-active:scale-90 group-hover:rotate-6 shadow-xl shadow-slate-200/50 border border-white ${color}`}>
      {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
    </div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
  </button>
);

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => (
  <div className="flex items-center space-x-5 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 transition-all active:scale-[0.98] group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
      activity.type === 'report' ? 'bg-cyan-100 text-cyan-600' :
      activity.type === 'event' ? 'bg-teal-100 text-teal-600' :
      activity.type === 'education' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'
    }`}>
      {activity.type === 'report' ? <ICONS.FileText size={24} /> :
       activity.type === 'event' ? <ICONS.Calendar size={24} /> :
       activity.type === 'education' ? <ICONS.BookOpen size={24} /> : <ICONS.Sparkles size={24} />}
    </div>
    <div className="flex-grow overflow-hidden">
      <h4 className="text-sm font-black text-slate-800 leading-none truncate mb-1.5">{activity.title}</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate">{activity.context} • {activity.timestamp}</p>
    </div>
    <div className="flex flex-col items-end shrink-0">
      <span className="text-sm font-black text-emerald-500">+{activity.points}</span>
      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">XP</span>
    </div>
  </div>
);

export default Home;
