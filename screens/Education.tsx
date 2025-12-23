
import React, { useState, useEffect } from 'react';
import { Screen, EducationContent } from '../types';
import { ICONS } from '../constants';
import { ApiService } from '../services/apiService';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const Education: React.FC<Props> = ({ onNavigate }) => {
  const [content, setContent] = useState<EducationContent[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<EducationContent | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    ApiService.fetchEducation().then(setContent);
  }, []);

  const handleComplete = async (id: string) => {
    setIsCompleting(true);
    await ApiService.completeArticle(id);
    setShowReward(true);
    setTimeout(() => {
      setShowReward(false);
      setSelectedArticle(null);
      setIsCompleting(false);
    }, 3000);
  };

  if (selectedArticle) {
    return (
      <div className="animate-in slide-in-from-bottom duration-500 min-h-screen bg-[#020617] text-white pb-40 overflow-y-auto">
        <div className="relative h-[400px] w-full">
          <ImageWithFallback src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
          
          <button 
            onClick={() => setSelectedArticle(null)} 
            className="absolute top-12 left-6 p-4 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/10 active:scale-90 transition-transform z-30"
          >
            <ICONS.ChevronRight size={24} className="rotate-180" />
          </button>
          
          <div className="absolute bottom-10 px-8 z-10">
            <span className="px-3 py-1 bg-cyan-500 rounded-full text-[8px] font-black uppercase tracking-widest mb-4 inline-block">
              {selectedArticle.category}
            </span>
            <h1 className="text-4xl font-black tracking-tighter leading-tight">{selectedArticle.title}</h1>
            <p className="text-cyan-400/60 text-xs font-bold mt-4 tracking-widest uppercase">{selectedArticle.duration}</p>
          </div>
        </div>

        <div className="px-8 mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="p-8 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl">
            <p className="text-lg text-slate-300 leading-relaxed font-medium italic mb-10 border-l-4 border-cyan-500 pl-6">
              {selectedArticle.description}
            </p>
            <div className="space-y-6 text-[15px] text-slate-400 font-medium leading-[1.8] tracking-tight">
              {selectedArticle.content.split('. ').map((sentence, i) => (
                <p key={i}>{sentence}.</p>
              ))}
            </div>
          </div>

          <div className="relative py-10">
            {showReward && (
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-in zoom-in duration-500 z-50">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(16,185,129,0.5)] mb-4">
                  <ICONS.CheckCircle2 size={40} />
                </div>
                <p className="text-emerald-400 font-black uppercase tracking-[0.2em] text-sm">+25 IMPACT XP</p>
              </div>
            )}
            
            <button 
              disabled={isCompleting}
              onClick={() => handleComplete(selectedArticle.id)}
              className={`w-full py-7 rounded-[2.5rem] font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center space-x-3 shadow-2xl ${
                isCompleting ? 'opacity-0 scale-90' : 'bg-gradient-to-r from-cyan-600 to-blue-700 active:scale-95 shadow-cyan-900/40'
              }`}
            >
              <ICONS.BookOpen size={20} />
              <span>Complete Lesson</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-40 bg-[#020617] min-h-screen">
      {/* Academy Header */}
      <div className="relative h-[360px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-[#020617] -z-10" />
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-academy" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-academy)" />
          </svg>
        </div>
        
        <div className="relative z-10 pt-20 px-8 text-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse shadow-[0_0_8px_#a855f7]" />
            <p className="text-purple-400 text-[10px] font-black uppercase tracking-[0.4em]">NEURAL ACADEMY</p>
          </div>
          <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">Ocean Intelligence</h1>
          <p className="text-slate-400 text-sm font-medium max-w-[240px] leading-relaxed">
            Expand your ecological knowledge and unlock new impact tiers.
          </p>
        </div>
      </div>

      <div className="px-6 -mt-16 space-y-6 relative z-20">
        {content.map((item, idx) => (
          <button 
            key={item.id} 
            onClick={() => setSelectedArticle(item)}
            className="w-full text-left bg-white/5 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/10 flex h-40 overflow-hidden group transition-all hover:bg-white/10 active:scale-95 animate-in slide-in-from-bottom-8"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="w-36 h-full shrink-0 relative">
              <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
            </div>
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-2 block">{item.category}</span>
                <h3 className="text-sm font-black text-white line-clamp-2 leading-snug group-hover:text-cyan-400 transition-colors">{item.title}</h3>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-slate-500">
                  <ICONS.Clock size={12} />
                  <p className="text-[9px] font-black uppercase tracking-tighter">{item.duration}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-xl border border-white/5 text-cyan-400">
                  <ICONS.ChevronRight size={14} />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Course Completion Counter */}
      <div className="px-8 mt-12 pb-20">
         <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-8 rounded-[3rem] shadow-2xl border border-white/10 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 blur-[50px] rounded-full" />
           <div className="relative z-10 flex items-center justify-between">
             <div>
               <h4 className="text-white text-lg font-black tracking-tighter">Your Progress</h4>
               <p className="text-purple-300 text-[10px] font-black uppercase tracking-widest mt-1">2/15 Modules Mastery</p>
             </div>
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/10">
               <ICONS.Trophy size={28} className="text-amber-400" />
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

export default Education;
