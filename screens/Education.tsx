
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

  useEffect(() => {
    MockApiService.fetchEducation().then(setContent);
  }, []);

  const filteredContent = content.filter(item => {
    const matchesTab = activeTab === 'All' || item.type === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                         item.category.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen pb-24">
      <div className={`bg-gradient-to-r ${GRADIENTS.education} pt-16 pb-12 px-8 text-white rounded-b-[3rem] shadow-xl`}>
        <h1 className="text-3xl font-black tracking-tight">Eco Academy</h1>
        <p className="opacity-90 text-sm mt-2 font-medium">Knowledge is the strongest tool for conservation.</p>
      </div>

      <div className="px-6 -mt-6 space-y-8">
        {/* Search */}
        <div className="relative group">
          <ICONS.Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" size={20} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conservation topics..."
            className="w-full pl-14 pr-6 py-4 bg-white border-0 rounded-[2rem] outline-none shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-purple-500 font-medium text-slate-700 placeholder-slate-300"
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-white p-1.5 rounded-[2rem] shadow-lg shadow-slate-200/30 overflow-x-auto no-scrollbar">
          {['All', 'Article', 'Video', 'Infographic'].map(type => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex-grow px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === type ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400'
              }`}
            >
              {type}s
            </button>
          ))}
        </div>

        {/* Content List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredContent.map(item => (
            <ContentCard key={item.id} item={item} />
          ))}
          {filteredContent.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold italic">No resources found for your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ContentCard: React.FC<{ item: EducationContent }> = ({ item }) => {
  const getIcon = () => {
    switch (item.type) {
      case ContentType.ARTICLE: return <ICONS.BookOpen size={16} />;
      case ContentType.VIDEO: return <ICONS.Play size={16} />;
      case ContentType.INFOGRAPHIC: return <ICONS.FileText size={16} />;
      default: return null;
    }
  };

  const getThemeColor = () => {
    switch (item.type) {
      case ContentType.ARTICLE: return 'text-blue-600 bg-blue-50';
      case ContentType.VIDEO: return 'text-red-600 bg-red-50';
      case ContentType.INFOGRAPHIC: return 'text-emerald-600 bg-emerald-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-50 overflow-hidden flex h-32 transition-all active:scale-[0.98] hover:shadow-xl group">
      <div className="w-32 h-full shrink-0 relative overflow-hidden">
        <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/10" />
        <div className={`absolute bottom-2 left-2 p-1.5 rounded-lg backdrop-blur-md bg-white/30 text-white border border-white/20`}>
          {getIcon()}
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${getThemeColor()}`}>
              {item.category}
            </span>
            <span className="text-[9px] font-bold text-slate-400">{item.duration}</span>
          </div>
          <h3 className="text-sm font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">{item.title}</h3>
        </div>
        <button className="text-[10px] font-black text-purple-600 flex items-center space-x-1 uppercase tracking-widest self-end group-hover:translate-x-1 transition-transform">
          <span>{item.type === ContentType.VIDEO ? 'Watch Mission' : 'Read Guide'}</span>
          <ICONS.ChevronRight size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default Education;
