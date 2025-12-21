
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
    <div className="flex items-center justify-center min-h-screen text-slate-400">
      <p className="font-bold">Fetching Profile...</p>
    </div>
  );

  const { user, activities, achievements, leaderboard } = data;
  const progress = ((user.points % 500) / 500) * 100;
  const pointsToNext = 500 - (user.points % 500);

  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen">
      {/* Profile Header */}
      <div className={`bg-gradient-to-br ${GRADIENTS.profile} pt-16 pb-20 px-8 relative text-white rounded-b-[4rem] shadow-2xl overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex justify-between items-start mb-8">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl border border-white/30 transform hover:rotate-6 transition-transform">
              {user.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{user.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Global Rank #{user.rank}</span>
              </div>
            </div>
          </div>
          <button className="p-3 bg-white/10 rounded-2xl border border-white/20 active:scale-90 transition-transform">
            <ICONS.Info size={24} />
          </button>
        </div>

        {/* Key Stats Bar */}
        <div className="grid grid-cols-3 gap-4 relative z-10">
          <StatBox icon={<ICONS.Trophy size={18} />} label="Level" value={user.level} />
          <StatBox icon={<ICONS.Star size={18} />} label="Points" value={user.points} />
          <StatBox icon={<ICONS.Zap size={18} />} label="Streak" value={`${user.streak} Days`} />
        </div>
      </div>

      {/* Progress Card Overlay */}
      <div className="px-6 -mt-10 relative z-20">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-300/60 border border-slate-100">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Next Milestone</p>
              <h4 className="text-xl font-black text-slate-800 mt-1">
                Level {user.level + 1} 
                <span className="text-slate-300 font-bold ml-2 text-sm">/ {pointsToNext} pts away</span>
              </h4>
            </div>
            <span className="text-blue-600 font-black text-lg bg-blue-50 px-3 py-1 rounded-2xl">{Math.round(progress)}%</span>
          </div>
          <div className="h-5 bg-slate-50 rounded-full overflow-hidden p-1.5 border border-slate-100 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400">
            <span>{user.points % 500} XP EARNED</span>
            <span className="flex items-center text-amber-500">
              <ICONS.Star size={12} className="mr-1" />
              BIG REWARD AT LVL {user.level + 1}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="px-6 mt-12 pb-24">
        <div className="flex bg-slate-200/50 p-1.5 rounded-[2rem] mb-8">
          {(['Achievements', 'Activity', 'Leaderboard'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-grow py-4 text-xs font-black rounded-2xl transition-all ${
                activeTab === tab ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="min-h-[300px]">
          {activeTab === 'Achievements' && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom duration-500">
              {achievements.map(ach => (
                <AchievementBadge key={ach.id} achievement={ach} />
              ))}
            </div>
          )}

          {activeTab === 'Activity' && (
            <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
              {activities.map(activity => (
                <ActivityRow key={activity.id} activity={activity} />
              ))}
            </div>
          )}

          {activeTab === 'Leaderboard' && (
            <div className="space-y-3 animate-in slide-in-from-bottom duration-500">
              {leaderboard.map(lb => (
                <LeaderboardRow key={lb.name} user={lb} />
              ))}
              
              {/* Rewards CTA */}
              <div className={`mt-10 p-8 rounded-[3rem] bg-gradient-to-br ${GRADIENTS.reward} text-white shadow-2xl flex items-center justify-between group cursor-pointer active:scale-95 transition-all`}>
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-3xl shadow-lg border border-white/30 group-hover:rotate-12 transition-transform">
                    🎁
                  </div>
                  <div>
                    <h4 className="font-black text-lg leading-tight">Reward Hub</h4>
                    <p className="text-[11px] font-medium opacity-90 mt-1 uppercase tracking-widest">Redeem for physical gear</p>
                  </div>
                </div>
                <ICONS.ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value }: { icon: any, label: string, value: any }) => (
  <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-4 border border-white/10 shadow-lg hover:bg-white/20 transition-colors">
    <div className="flex items-center space-x-2 opacity-80 mb-1.5">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
    <span className="text-xl font-black">{value}</span>
  </div>
);

const AchievementBadge: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
  <div className={`p-5 rounded-[2.5rem] border transition-all ${achievement.isLocked ? 'bg-slate-50 border-slate-200 grayscale opacity-60' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50 hover:scale-105'} flex flex-col items-center text-center space-y-3`}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg bg-gradient-to-br ${achievement.gradient}`}>
      {achievement.icon}
    </div>
    <div className="space-y-1">
      <h5 className="text-xs font-black text-slate-800 tracking-tight">{achievement.name}</h5>
      <p className="text-[10px] text-slate-400 font-bold leading-tight line-clamp-2">{achievement.description}</p>
    </div>
    <div className={`text-[9px] font-black uppercase tracking-tighter px-3 py-1 rounded-full ${achievement.isLocked ? 'bg-slate-200 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
      {achievement.isLocked ? `UNlocks at ${achievement.points} pts` : achievement.earnedDate}
    </div>
  </div>
);

const ActivityRow: React.FC<{ activity: Activity }> = ({ activity }) => (
  <div className="flex items-center space-x-5 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
    <div className={`p-3 rounded-2xl shrink-0 ${
      activity.type === 'report' ? 'bg-cyan-100 text-cyan-600' :
      activity.type === 'event' ? 'bg-teal-100 text-teal-600' :
      activity.type === 'education' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'
    }`}>
      {activity.type === 'report' ? <ICONS.FileText size={20} /> :
       activity.type === 'event' ? <ICONS.Calendar size={20} /> :
       activity.type === 'education' ? <ICONS.BookOpen size={20} /> : <ICONS.Sparkles size={20} />}
    </div>
    <div className="flex-grow">
      <h6 className="text-sm font-black text-slate-800">{activity.title}</h6>
      <p className="text-[11px] text-slate-400 font-bold mt-0.5">{activity.context} • {activity.timestamp}</p>
    </div>
    <div className="text-right">
      <span className="text-sm font-black text-emerald-500">+{activity.points}</span>
      <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">pts</p>
    </div>
  </div>
);

const LeaderboardRow: React.FC<{ user: LeaderboardUser }> = ({ user }) => {
  const isTop3 = user.rank <= 3;
  const rankIcon = user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : null;
  const gradient = user.rank === 1 ? 'from-amber-400 to-yellow-600' : 
                   user.rank === 2 ? 'from-slate-300 to-slate-500' : 
                   user.rank === 3 ? 'from-orange-400 to-orange-700' : 'from-slate-100 to-slate-200';

  return (
    <div className={`flex items-center p-4 rounded-[2rem] border transition-all ${
      user.isCurrentUser ? 'bg-blue-600 border-blue-700 shadow-xl shadow-blue-200 text-white' : 'bg-white border-slate-100'
    }`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black mr-4 text-sm ${isTop3 ? 'bg-gradient-to-br ' + gradient + ' text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
        {rankIcon || `#${user.rank}`}
      </div>
      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl mr-4 border-2 border-slate-50 shadow-inner">
        {user.avatar}
      </div>
      <div className="flex-grow">
        <h6 className={`text-sm font-black tracking-tight ${user.isCurrentUser ? 'text-white' : 'text-slate-800'}`}>
          {user.name} {user.isCurrentUser && '(YOU)'}
        </h6>
        <p className={`text-[10px] font-bold ${user.isCurrentUser ? 'text-blue-200' : 'text-slate-400'}`}>LEVEL {user.level} STEWARD</p>
      </div>
      <div className="text-right">
        <span className={`text-sm font-black ${user.isCurrentUser ? 'text-white' : 'text-slate-800'}`}>{user.points.toLocaleString()}</span>
        <p className={`text-[8px] font-bold ${user.isCurrentUser ? 'text-blue-200' : 'text-slate-300'}`}>TOTAL XP</p>
      </div>
    </div>
  );
};

export default Profile;
