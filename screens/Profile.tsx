
import React, { useState, useEffect } from 'react';
import { Screen, User, Activity, Achievement, LeaderboardUser } from '../types';
import { ICONS, GRADIENTS } from '../constants';
import { MockApiService } from '../services/mockApi';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const Profile: React.FC<Props> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Achievements' | 'Activity' | 'Leaderboard'>('Achievements');
  const [data, setData] = useState<{ user: User, activities: Activity[], achievements: Achievement[], leaderboard: LeaderboardUser[] } | null>(null);

  useEffect(() => {
    MockApiService.fetchProfile().then(setData);
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] text-cyan-400">
      <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );

  const { user, activities, achievements, leaderboard } = data;
  const progress = ((user.points % 500) / 500) * 100;
  const pointsToNext = 500 - (user.points % 500);

  return (
    <div className="animate-in fade-in duration-700 pb-32 bg-[#f8fafc] min-h-screen">
      {/* Immersive Header */}
      <div className="relative h-[400px] overflow-hidden bg-[#020617]">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-blue-900 to-[#020617]" />
        
        {/* Floating Light Rays */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-cyan-400 blur-xl animate-pulse" />
          <div className="absolute top-0 right-1/3 w-px h-full bg-blue-400 blur-2xl animate-pulse [animation-delay:2s]" />
        </div>

        <div className="relative z-10 pt-16 px-8 flex flex-col items-center">
          <div className="relative group mb-6">
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-[3rem] blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative w-32 h-32 bg-[#0e7490] backdrop-blur-3xl rounded-[2.8rem] flex items-center justify-center text-6xl shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-500">
              {user.avatar}
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-[#020617] text-xl">
              🌊
            </div>
          </div>

          <h1 className="text-white text-3xl font-black tracking-tighter mb-1">{user.name}</h1>
          <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center space-x-2">
            <ICONS.Trophy size={14} className="text-amber-400" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Rank #{user.rank} Global</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg className="relative block w-full h-[60px]" viewBox="0 24 150 28" preserveAspectRatio="none">
            <path d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" fill="#f8fafc" />
          </svg>
        </div>
      </div>

      {/* Level Progress Overlay */}
      <div className="px-6 -mt-20 relative z-20">
        <div className="bg-white p-8 rounded-[3.5rem] shadow-[0_25px_50px_rgba(0,0,0,0.1)] border border-slate-50">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Phase</p>
              <h4 className="text-2xl font-black text-slate-800 tracking-tighter mt-1">
                Level {user.level}
                <span className="text-slate-300 font-bold ml-2 text-sm italic">Next in {pointsToNext} XP</span>
              </h4>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-indigo-600">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="h-6 bg-slate-50 rounded-full overflow-hidden p-1 shadow-inner border border-slate-100">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-full transition-all duration-1500 relative overflow-hidden" 
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 opacity-20 animate-[wave_4s_infinite_linear] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat-x" />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Content Tabs */}
      <div className="px-6 mt-12 pb-32">
        <div className="flex bg-slate-200/40 p-1.5 rounded-[2.5rem] mb-10">
          {(['Achievements', 'Activity', 'Leaderboard'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
                <SeaAchievement key={ach.id} achievement={ach} />
              ))}
            </div>
          )}

          {activeTab === 'Activity' && (
            <div className="space-y-4">
              {activities.map((activity, i) => (
                <LiquidActivityItem key={activity.id} activity={activity} index={i} />
              ))}
            </div>
          )}

          {activeTab === 'Leaderboard' && (
            <div className="space-y-4">
              {leaderboard.map((lb, i) => (
                <GlassRankRow key={lb.name} user={lb} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SeaAchievement = ({ achievement }: { achievement: Achievement }) => (
  <div className={`p-6 rounded-[3rem] border transition-all relative overflow-hidden group ${
    achievement.isLocked ? 'bg-slate-50 border-slate-100 grayscale opacity-60' : 'bg-white border-slate-50 shadow-2xl hover:-translate-y-1'
  }`}>
    {!achievement.isLocked && (
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${achievement.gradient} opacity-5 blur-2xl group-hover:opacity-20 transition-opacity`} />
    )}
    <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-4xl shadow-xl bg-gradient-to-br mb-4 ${
      achievement.isLocked ? 'from-slate-200 to-slate-300' : achievement.gradient
    }`}>
      {achievement.icon}
    </div>
    <h5 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">{achievement.name}</h5>
    <p className="text-[10px] text-slate-400 font-bold leading-tight mb-4">{achievement.description}</p>
    <div className="text-[9px] font-black uppercase tracking-widest text-slate-300">
      {achievement.isLocked ? 'Discovery Pending' : achievement.earnedDate}
    </div>
  </div>
);

const LiquidActivityItem = ({ activity, index }: { activity: Activity, index: number }) => (
  <div className="flex items-center space-x-5 bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/20 group animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
      activity.type === 'report' ? 'bg-cyan-50 text-cyan-600' :
      activity.type === 'event' ? 'bg-teal-50 text-teal-600' :
      activity.type === 'education' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
    }`}>
      <ICONS.Zap size={24} />
    </div>
    <div className="flex-grow">
      <h6 className="text-sm font-black text-slate-800 tracking-tight">{activity.title}</h6>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{activity.context} • {activity.timestamp}</p>
    </div>
    <div className="text-right">
      <span className="text-lg font-black text-emerald-500">+{activity.points}</span>
    </div>
  </div>
);

const GlassRankRow = ({ user, index }: { user: LeaderboardUser, index: number }) => (
  <div className={`flex items-center p-5 rounded-[2.5rem] border transition-all ${
    user.isCurrentUser ? 'bg-indigo-600 border-indigo-700 shadow-2xl text-white' : 'bg-white border-slate-100 shadow-lg'
  }`}>
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black mr-4 ${
      index < 3 ? 'bg-amber-400 text-white shadow-lg' : 'bg-slate-50 text-slate-400'
    }`}>
      {index + 1}
    </div>
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mr-4 border border-slate-100 shadow-inner overflow-hidden">
      {user.avatar}
    </div>
    <div className="flex-grow">
      <h6 className={`text-sm font-black tracking-tight ${user.isCurrentUser ? 'text-white' : 'text-slate-800'}`}>
        {user.name}
      </h6>
      <p className={`text-[9px] font-black uppercase tracking-widest ${user.isCurrentUser ? 'text-indigo-200' : 'text-slate-300'}`}>
        Lvl {user.level} Guardian
      </p>
    </div>
    <div className="text-right">
      <span className="text-sm font-black tracking-tight">{user.points.toLocaleString()}</span>
      <p className={`text-[8px] font-black uppercase ${user.isCurrentUser ? 'text-indigo-200' : 'text-slate-300'}`}>XP</p>
    </div>
  </div>
);

export default Profile;
