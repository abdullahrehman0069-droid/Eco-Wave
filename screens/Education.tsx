
import React, { useState, useEffect } from 'react';
import { Screen, EducationContent, ContentType } from '../types';
import { ICONS, GRADIENTS } from '../constants';
import { MockApiService } from '../services/mockApi';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const Education: React.FC<Props> = ({ onNavigate }) => {
  const [content, setContent] = useState<EducationContent[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedContent, setSelectedContent] = useState<EducationContent | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    MockApiService.fetchEducation().then(setContent);
  }, []);

  const filteredContent = content.filter(item => {
    const matchesTab = activeTab === 'All' || item.type === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                         item.category.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleComplete = async () => {
    if (!selectedContent) return;
    setIsCompleting(true);
    await MockApiService.completeArticle(selectedContent.id);
    // Simulate a success delay for impact
    setTimeout(() => {
      setIsCompleting(false);
      setSelectedContent(null);
    }, 800);
  };

  if (selectedContent) {
    return (
      <div className="animate-in slide-in-from-right duration-500 pb-32 bg-[#020617] min-h-screen text-white overflow-y-auto">
        <div className="relative h-72">
          <ImageWithFallback src={selectedContent.image} alt={selectedContent.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
          <button 
            onClick={() => setSelectedContent(null)}
            className="absolute top-10 left-6 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 active:scale-90 transition-transform"
          >
            <ICONS.ChevronRight size={24} className="rotate-180" />
          </button>
        </div>

        <div className="px-8 -mt-10 relative z-10 space-y-8">
          <div className="flex items-center space-x-3">
            <span className="bg-cyan-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {selectedContent.type}
            </span>
            <span className="text-cyan-400/60 text-[9px] font-black uppercase tracking-widest">
              {selectedContent.duration}
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tighter leading-tight">{selectedContent.title}</h1>
          
          <div className="prose prose-invert prose-cyan max-w-none">
            <p className="text-cyan-100/70 text-base leading-relaxed font-medium">
              {selectedContent.description}
            </p>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />
            <p className="text-white/90 text-sm leading-loose">
              Exploring the depths of {selectedContent.category.toLowerCase()} requires a deep understanding of marine biological feedback loops. 
              Current research indicates that marine ecosystems are more resilient when local communities actively log and monitor changes.
              <br /><br />
              This guide provides the foundational knowledge needed to identify subtle shifts in ocean health. By observing the patterns described here, you become a vital part of the global EcoWave sensor network.
            </p>
          </div>

          {selectedContent.type === ContentType.VIDEO && (
            <div className="aspect-video bg-slate-900 rounded-[2.5rem] flex items-center justify-center relative group overflow-hidden border border-white/10">
              <div className="absolute inset-0 bg-cyan-900/20 animate-pulse" />
              <ICONS.Play size={48} className="text-white relative z-10 group-hover:scale-110 transition-transform" />
            </div>
          )}

          <div className="fixed bottom-10 left-8 right-8 z-50">
            <button 
              onClick={handleComplete}
              disabled={isCompleting}
              className="w-full py-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] font-black text-sm shadow-[0_15px_40px_rgba(6,182,212,0.4)] active:scale-95 transition-all flex items-center justify-center space-x-3"
            >
              {isCompleting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ICONS.CheckCircle2 size={18} />
                  <span>COMPLETE MISSION (+25 XP)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-[#f8fafc] min-h-screen">
      {/* Animated Header */}
      <div className="relative h-[320px] overflow-hidden bg-[#4c1d95]">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-indigo-900 to-[#020617]" />
        <div className="relative z-10 pt-16 px-8">
          <p className="text-purple-300 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Ocean Intelligence</p>
          <h1 className="text-white text-4xl font-black tracking-tighter">Eco Academy</h1>
          <p className="text-purple-100/60 text-sm mt-2 font-medium">Master the science of marine preservation.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg className="relative block w-full h-[60px]" viewBox="0 24 150 28" preserveAspectRatio="none">
            <defs>
              <path id="gentle-wave-edu" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="animate-[move-forever_20s_linear_infinite]">
              <use href="#gentle-wave-edu" x="48" y="0" fill="rgba(248,250,252,0.3)" />
              <use href="#gentle-wave-edu" x="48" y="7" fill="#f8fafc" />
            </g>
          </svg>
        </div>
      </div>

      <div className="px-6 -mt-16 space-y-8 relative z-20">
        {/* Search */}
        <div className="relative group">
          <ICONS.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-400/40" size={20} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the archives..."
            className="w-full pl-16 pr-6 py-5 bg-white/90 backdrop-blur-xl border border-white/20 rounded-[2.5rem] outline-none shadow-2xl focus:ring-4 focus:ring-purple-500/10 font-bold text-slate-800 placeholder-slate-300"
          />
        </div>

        {/* Categories */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-[2.5rem] overflow-x-auto no-scrollbar">
          {['All', 'Article', 'Video', 'Infographic'].map(type => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex-grow px-6 py-4 text-[10px] font-black rounded-[1.8rem] transition-all whitespace-nowrap ${
                activeTab === type ? 'bg-white text-purple-600 shadow-xl' : 'text-slate-400'
              }`}
            >
              {type.toUpperCase()}S
            </button>
          ))}
        </div>

        {/* Content Stream */}
        <div className="grid grid-cols-1 gap-6">
          {filteredContent.map(item => (
            <FluidContentCard key={item.id} item={item} onClick={() => setSelectedContent(item)} />
          ))}
          {filteredContent.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                <ICONS.Search size={32} />
              </div>
              <p className="text-slate-300 font-black uppercase tracking-widest text-[10px]">No records found</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes move-forever {
          0% { transform: translate3d(-90px, 0, 0); }
          100% { transform: translate3d(85px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

const FluidContentCard = ({ item, onClick }: { item: EducationContent, onClick: () => void }) => {
  const getIcon = () => {
    switch (item.type) {
      case ContentType.ARTICLE: return <ICONS.BookOpen size={18} />;
      case ContentType.VIDEO: return <ICONS.Play size={18} />;
      case ContentType.INFOGRAPHIC: return <ICONS.Layers size={18} />;
      default: return null;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[2.8rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex h-36 active:scale-[0.97] transition-all group"
    >
      <div className="w-36 h-full shrink-0 relative overflow-hidden">
        <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-indigo-900/10" />
        <div className="absolute bottom-3 left-3 w-10 h-10 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20">
          {getIcon()}
        </div>
      </div>
      <div className="p-6 flex flex-col justify-between flex-grow overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black px-2 py-0.5 rounded-lg bg-purple-50 text-purple-600 uppercase tracking-widest">
              {item.category}
            </span>
          </div>
          <h3 className="text-sm font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors tracking-tight">
            {item.title}
          </h3>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.duration}</span>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-purple-600 group-hover:translate-x-1 transition-transform">
            <ICONS.ChevronRight size={16} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
