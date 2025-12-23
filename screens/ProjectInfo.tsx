
import React from 'react';
import { Screen } from '../types';
import { ICONS, GRADIENTS } from '../constants';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const ProjectInfo: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="animate-in fade-in duration-500 bg-[#020617] min-h-screen pb-40">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-[#020617] pt-24 pb-32 px-8 relative text-white rounded-b-[4rem] shadow-2xl overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-about" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-about)" />
          </svg>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="h-px w-8 bg-cyan-500/30" />
            <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.6em]">System Architecture</p>
            <div className="h-px w-8 bg-cyan-500/30" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white/40">EcoWave</h1>
          <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 inline-flex shadow-2xl">
            <ICONS.Github size={16} className="text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Open Source Protocol v1.0</span>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-20 space-y-8 relative z-20">
        {/* Team Card */}
        <section className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] shadow-2xl border border-white/10">
          <div className="flex flex-col items-center mb-10">
            <div className="p-4 bg-cyan-500/10 text-cyan-400 rounded-3xl mb-4 border border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <ICONS.User size={28} />
            </div>
            <h2 className="text-lg font-black text-white uppercase tracking-[0.2em]">Lead Architects</h2>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <TeamMember name="Hassam Mir" role="Software Engineer" avatar="👨‍💻" />
            <TeamMember name="Abdullah Rehman" role="UX Strategist" avatar="🎨" />
          </div>
        </section>

        {/* Project Description */}
        <section className="bg-white/5 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-white/5">
          <div className="flex items-center space-x-5 mb-6">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-400/20">
              <ICONS.Info size={22} />
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Mission Brief</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
            "EcoWave is a multi-modal ecological intelligence system designed to bridge the gap between human presence and ocean preservation. We empower the next generation of Guardians with AI-driven reporting and impact modeling."
          </p>
        </section>

        {/* Functionalities */}
        <section className="bg-white/5 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-white/5">
          <div className="flex items-center space-x-5 mb-8">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-400/20">
              <ICONS.Layers size={22} />
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Core Modules</h2>
          </div>
          <div className="space-y-6">
            <FeatureItem title="Neural Diagnostic Engine" desc="Advanced computer vision identifying pollutants via Gemini 3 Flash." />
            <FeatureItem title="Impact Simulator" desc="Predictive 50-year forecasting of environmental scenarios." />
            <FeatureItem title="Field Operations Hub" desc="Geospatial coordination for maritime cleanup missions." />
            <FeatureItem title="Guardian Rewards" desc="Gamified reputation system for authenticated field actions." />
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-white/5 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-white/5">
          <div className="flex items-center space-x-5 mb-8">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-400/20">
              <ICONS.Code2 size={22} />
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Tech Stack</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <TechBadge label="React 19" />
            <TechBadge label="TypeScript 5.0" />
            <TechBadge label="Tailwind JIT" />
            <TechBadge label="Gemini AI" />
            <TechBadge label="Lucide High-Def" />
            <TechBadge label="Persistence V3" />
          </div>
        </section>

        {/* Links */}
        <div className="grid grid-cols-2 gap-4 pb-20">
          <a 
            href="https://github.com/hassam-mir/ecowave" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center p-8 bg-white/5 border border-white/10 text-white rounded-[2.5rem] shadow-2xl transition-all active:scale-95 hover:bg-white/10"
          >
            <ICONS.Github size={32} className="mb-3 text-cyan-400" />
            <span className="text-[9px] font-black uppercase tracking-widest">Protocol Repo</span>
          </a>
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center p-8 bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-[2.5rem] shadow-2xl transition-all active:scale-95 shadow-cyan-900/20"
          >
            <ICONS.Home size={32} className="mb-3" />
            <span className="text-[9px] font-black uppercase tracking-widest">Return Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const TeamMember = ({ name, role, avatar }: { name: string, role: string, avatar: string }) => (
  <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 text-center transition-all hover:bg-white/10 hover:-translate-y-1">
    <div className="text-5xl mb-4 drop-shadow-2xl">{avatar}</div>
    <h4 className="text-xs font-black text-white leading-tight mb-2 tracking-tight">{name}</h4>
    <p className="text-[8px] font-bold text-cyan-400/60 uppercase tracking-widest">{role}</p>
  </div>
);

const FeatureItem = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex items-start space-x-4">
    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 shrink-0 shadow-[0_0_8px_#22d3ee]" />
    <div>
      <h4 className="text-sm font-black text-slate-100 mb-1">{title}</h4>
      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const TechBadge = ({ label }: { label: string }) => (
  <span className="bg-white/5 border border-white/10 text-slate-300 text-[8px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl">
    {label}
  </span>
);

export default ProjectInfo;
