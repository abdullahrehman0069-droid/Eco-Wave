
import React, { useState, useEffect } from 'react';
import { Screen, User, Activity, Achievement, LeaderboardUser } from '../types';
import { ICONS } from '../constants';
import { ApiService } from '../services/apiService';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const Profile: React.FC<Props> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Achievements' | 'Activity' | 'Leaderboard'>('Achievements');
  const [data, setData] = useState<{ 
    user: User, 
    activities: Activity[], 
    achievements: Achievement[], 
    leaderboard: LeaderboardUser[],
    totalReports: number,
    totalEvents: number
  } | null>(null);

  useEffect(() => {
    ApiService.fetchProfile().then(setData);
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] text-cyan-400">
      <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );

  const { user, activities, achievements, leaderboard, totalReports, totalEvents } = data;
  const progress = ((user.points % 500) / 500) * 100;

  // Determine user title based on level
  const getUserTitle = (lvl: number) => {
    if (lvl < 3) return "Novice Voyager";
    if (lvl < 6) return "Coastal Defender";
    if (lvl < 10) return "Tide Master";
    return "Ocean Legend";
  };

  return (
    <div className="animate-in fade-in duration-700 pb-32 bg-[#f8fafc] min-h-screen">
      <div className="relative h-[480px] overflow-hidden bg-[#020617]">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-blue-900 to-[#020617]" />
        
        {/* Top Actions */}
        <div className="relative z-20 pt-12 px-8 flex justify-between items-center">
          <button onClick={() => onNavigate('home')} className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10 active:scale-90 transition-transform">
            <ICONS.ChevronRight size={24} className="rotate-180" />
          </button>
          <div className="flex space-x-3">
             <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10 active:scale-90 transition-transform">
              <ICONS.Share2 size={20} />
            </button>
            <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10 active:scale-90 transition-transform">
              <ICONS.Filter size={20} />
            </button>
          </div>
        </div>

        <div className="relative z-10 pt-4 px-8 flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-cyan-500/20 blur-2xl animate-pulse rounded-full" />
            <div className="relative w-32 h-32 bg-[#0e7490] backdrop-blur-3xl rounded-[2.8rem] flex items-center justify-center text-6xl shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-500">
              {user.avatar}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-[#020617] flex items-center justify-center text-white">
              <ICONS.CheckCircle2 size={16} />
            </div>
          </div>
          
          <h1 className="text-white text-3xl font-black tracking-tighter mb-1 mt-6">{user.name}</h1>
          <p className="text-cyan-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4">{getUserTitle(user.level)}</p>
          
          <div className="flex space-x-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center space-x-2">
              <ICONS.Trophy size={14} className="text-amber-400" />
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Rank #{user.rank}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center space-x-2">
              <ICONS.Calendar size={14} className="text-cyan-400" />
              <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Joined Jan '24</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-32 relative z-20 space-y-6">
        {/* Main Stats Card */}
        <div className="bg-white p-8 rounded-[3.5rem] shadow-2xl border border-slate-50">
          <div className="grid grid-cols-4 gap-4 mb-8">
            <StatBox label="Points" value={user.points.toLocaleString()} icon={<ICONS.Zap className="text-amber-500" />} />
            <StatBox label="Reports" value={totalReports} icon={<ICONS.FileText className="text-cyan-500" />} />
            <StatBox label="Events" value={totalEvents} icon={<ICONS.Calendar className="text-purple-500" />} />
            <StatBox label="Streak" value={`${user.streak}d`} icon={<ICONS.Star className="text-emerald-500" />} />
          </div>

          <div className="pt-6 border-t border-slate-50">
            <div className="flex justify-between items-end mb-3">
               <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">XP Progress</p>
                <h4 className="text-lg font-black text-slate-800 tracking-tighter">Level {user.level}</h4>
              </div>
              <p className="text-xs font-black text-indigo-500">{Math.round(progress)}%</p>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-100 p-0.5">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-1000 shadow-lg shadow-indigo-200" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Guardian Profile</h2>
          <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
            "Passionate about preserving our coastal ecosystems. Active in Southern California reporting and cleanup coordination. Dedicated to reducing microplastic contamination."
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Plastic Patrol", "Beach Leader", "Eco-Educator"].map(tag => (
              <span key={tag} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs System */}
        <div className="mt-12">
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

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {activeTab === 'Achievements' && (
              <div className="grid grid-cols-2 gap-4">
                {achievements.map(ach => (
                  <div key={ach.id} className="p-6 rounded-[3rem] bg-white border border-slate-100 shadow-xl group hover:-translate-y-1 transition-all">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${ach.gradient} mb-4 shadow-lg group-hover:scale-110 transition-transform`}>{ach.icon}</div>
                    <h5 className="text-xs font-black text-slate-800 tracking-tight">{ach.name}</h5>
                    <p className="text-[8px] text-slate-400 font-bold mt-1 leading-tight">{ach.description}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'Activity' && (
              <div className="space-y-4">
                {activities.length > 0 ? activities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-5 bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-lg">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
                      <ICONS.Zap size={20} />
                    </div>
                    <div className="flex-grow">
                      <h6 className="text-sm font-black text-slate-800">{activity.title}</h6>
                      <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">{activity.timestamp} • {activity.context}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-500 font-black">+{activity.points}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 opacity-20">
                    <ICONS.Zap size={48} className="mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">No Activity Yet</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'Leaderboard' && (
              <div className="space-y-4">
                {leaderboard.map((lbUser) => (
                  <div 
                    key={lbUser.name} 
                    className={`flex items-center space-x-4 p-5 rounded-[2.5rem] border transition-all ${
                      lbUser.isCurrentUser 
                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 shadow-indigo-100 shadow-xl' 
                        : 'bg-white border-slate-50 shadow-lg'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                      lbUser.rank === 1 ? 'bg-amber-100 text-amber-600' :
                      lbUser.rank === 2 ? 'bg-slate-100 text-slate-500' :
                      lbUser.rank === 3 ? 'bg-orange-100 text-orange-600' :
                      'bg-slate-50 text-slate-300'
                    }`}>
                      {lbUser.rank}
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100 shrink-0">
                      {lbUser.avatar}
                    </div>
                    <div className="flex-grow">
                      <h6 className={`text-sm font-black ${lbUser.isCurrentUser ? 'text-indigo-700' : 'text-slate-800'}`}>
                        {lbUser.name} {lbUser.isCurrentUser && '(You)'}
                      </h6>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Lvl {lbUser.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-800">{lbUser.points.toLocaleString()}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Impact Points</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon }: { label: string, value: string | number, icon: any }) => (
  <div className="text-center space-y-2">
    <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div>
      <p className="text-sm font-black text-slate-800 leading-none">{value}</p>
      <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
    </div>
  </div>
);

export default Profile;
