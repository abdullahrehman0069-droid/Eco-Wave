
import React from 'react';
import { Screen } from '../types';
import { ICONS, GRADIENTS } from '../constants';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const ProjectInfo: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen pb-24">
      {/* Hero Header */}
      <div className={`bg-gradient-to-br ${GRADIENTS.about} pt-16 pb-20 px-8 relative text-white rounded-b-[4rem] shadow-2xl overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-about" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-about)" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Project Documentation</p>
          <h1 className="text-5xl font-black tracking-tighter mb-4">EcoWave</h1>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 inline-flex">
            <ICONS.Github size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">v1.0.0 Stable</span>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-10 space-y-8 relative z-20">
        {/* Team Card */}
        <section className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl">
              <ICONS.User size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Lead Developers</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TeamMember name="Hassam Mir" role="Software Engineer" avatar="👨‍💻" />
            <TeamMember name="Abdullah Rehman" role="UX Strategist" avatar="🎨" />
          </div>
        </section>

        {/* Project Description */}
        <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <ICONS.Info size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Mission Statement</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
            "EcoWave is a production-ready, mobile-first ecosystem designed to bridge the gap between ocean lovers and conservation action. By combining real-time pollution reporting with AI-driven diagnostics, we empower communities to protect our blue planet."
          </p>
        </section>

        {/* Functionalities */}
        <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <ICONS.Layers size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Key Features</h2>
          </div>
          <div className="space-y-4">
            <FeatureItem title="AI Pollution Diagnostic" desc="Identifies pollutants from images using Gemini 3 Vision models." />
            <FeatureItem title="Geospatial Reporting" desc="Logs precise GPS coordinates and severity levels for field teams." />
            <FeatureItem title="Mission Management" desc="Coordinate cleanup events with real-time capacity tracking." />
            <FeatureItem title="Gamified Impact" desc="Earn XP, level up, and unlock achievements for conservation acts." />
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <ICONS.Code2 size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Technology Stack</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <TechBadge label="React 19" />
            <TechBadge label="TypeScript" />
            <TechBadge label="Tailwind CSS" />
            <TechBadge label="Google Gemini API" />
            <TechBadge label="Lucide Icons" />
            <TechBadge label="MockAPI Service" />
          </div>
        </section>

        {/* Video Walkthrough */}
        <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <ICONS.Play size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Demo Walkthrough</h2>
          </div>
          <div className="aspect-video bg-slate-900 rounded-[2rem] flex items-center justify-center relative group cursor-pointer overflow-hidden border-4 border-slate-50">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 mb-4 group-hover:scale-110 transition-transform">
                <ICONS.Play size={32} fill="white" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Launch Presentation</p>
            </div>
          </div>
        </section>

        {/* External Links */}
        <div className="grid grid-cols-2 gap-4 pb-12">
          <a 
            href="https://github.com/hassam-mir/ecowave" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl transition-transform active:scale-95"
          >
            <ICONS.Github size={32} className="mb-3" />
            <span className="text-[10px] font-black uppercase tracking-widest">Repository</span>
          </a>
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center p-6 bg-cyan-600 text-white rounded-[2.5rem] shadow-2xl transition-transform active:scale-95"
          >
            <ICONS.Home size={32} className="mb-3" />
            <span className="text-[10px] font-black uppercase tracking-widest">Launch App</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const TeamMember = ({ name, role, avatar }: { name: string, role: string, avatar: string }) => (
  <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 text-center">
    <div className="text-4xl mb-3">{avatar}</div>
    <h4 className="text-sm font-black text-slate-800 leading-tight mb-1">{name}</h4>
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{role}</p>
  </div>
);

const FeatureItem = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex items-start space-x-4">
    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 shrink-0" />
    <div>
      <h4 className="text-sm font-black text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 font-medium">{desc}</p>
    </div>
  </div>
);

const TechBadge = ({ label }: { label: string }) => (
  <span className="bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
    {label}
  </span>
);

export default ProjectInfo;
