
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

  useEffect(() => {
    ApiService.fetchEducation().then(setContent);
  }, []);

  return (
    <div className="pb-32 bg-[#f8fafc] min-h-screen">
      <div className="relative h-[320px] overflow-hidden bg-[#4c1d95]">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-indigo-900 to-[#020617]" />
        <div className="relative z-10 pt-16 px-8 text-white">
          <p className="text-purple-300 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Ocean Intelligence</p>
          <h1 className="text-4xl font-black tracking-tighter">Eco Academy</h1>
        </div>
      </div>
      <div className="px-6 -mt-16 space-y-6 relative z-20">
        {content.map(item => (
          <div key={item.id} className="bg-white rounded-[2.8rem] shadow-xl border border-slate-100 flex h-32 overflow-hidden">
            <div className="w-32 h-full shrink-0"><ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" /></div>
            <div className="p-4 flex flex-col justify-center">
              <h3 className="text-sm font-black text-slate-800 line-clamp-2">{item.title}</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-2">{item.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
