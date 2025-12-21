
import React, { useState, useEffect } from 'react';
import { Screen, User, Activity, Achievement, LeaderboardUser } from '../types';
import { ICONS } from '../constants';
import { ApiService } from '../services/apiService';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const Profile: React.FC<Props> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Achievements' | 'Activity' | 'Leaderboard'>('Achievements');
  const [data, setData] = useState<{ user: User, activities: Activity[], achievements: Achievement[], leaderboard: LeaderboardUser[] } | null>(null);

  useEffect(() => {
    ApiService.fetchProfile().then(setData);
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] text-cyan-400">
      <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );

  const { user, activities, achievements, leaderboard } = data;
  const progress = ((user.points % 500) / 500) * 100;

  return (
    <div className="animate-in fade-in duration-700 pb-32 bg-[#f8fafc] min-h-screen">
      <div className="relative h-[400px] overflow-hidden bg-[#020617]">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-blue-900 to-[#020617]" />
        <div className="relative z-10 pt-16 px-8 flex flex-col items-center">
          <div className="relative w-32 h-32 bg-[#0e7490] backdrop-blur-3xl rounded-[2.8rem] flex items-center justify-center text-6xl shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-500">
            {user.avatar}
          </div>
          <h1 className="text-white text-3xl font-black tracking-tighter mb-1 mt-4">{user.name}</h1>
          <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center space-x-2">
            <ICONS.Trophy size={14} className="text-amber-400" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Rank #{user.rank} Global</span>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-20 relative z-20">
        <div className="bg-white p-8 rounded-[3.5rem] shadow-2xl border border-slate-50 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Phase</p>
          <h4 className="text-2xl font-black text-slate-800 tracking-tighter mt-1">Level {user.level}</h4>
          <div className="h-4 bg-slate-50 rounded-full overflow-hidden mt-4 border border-slate-100">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="px-6 mt-12 pb-32">
        <div className="flex bg-slate-200/40 p-1.5 rounded-[2.5rem] mb-10">
          {(['Achievements', 'Activity', 'Leaderboard'] as const).map(tab => (
            <button
              key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-grow py-4 text-[10px] font-black rounded-[1.8rem] transition-all ${
                activeTab === tab ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'Achievements' && (
            <div className="grid grid-cols-2 gap-4">
              {achievements.map(ach => (
                <div key={ach.id} className="p-6 rounded-[3rem] bg-white border border-slate-100 shadow-xl">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${ach.gradient} mb-4`}>{ach.icon}</div>
                  <h5 className="text-xs font-black text-slate-800 tracking-tight">{ach.name}</h5>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'Activity' && (
            <div className="space-y-4">
              {activities.map((activity, i) => (
                <div key={activity.id} className="flex items-center space-x-5 bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center"><ICONS.Zap size={20} /></div>
                  <div className="flex-grow">
                    <h6 className="text-sm font-black text-slate-800">{activity.title}</h6>
                    <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
