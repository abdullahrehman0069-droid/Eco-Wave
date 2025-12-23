
import React, { useState, useRef } from 'react';
import { Screen, Severity, PollutionType } from '../types';
import { ICONS } from '../constants';
import { ApiService } from '../services/apiService';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const ReportPollution: React.FC<Props> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: PollutionType.PLASTIC,
    severity: Severity.MEDIUM,
    description: '',
    location: 'Satellite Lock Pending...',
    image: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGPS = () => {
    setLoading(true);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, location: "Grid: 34.01N, 118.49W | Coastal Zone 4" }));
      setLoading(false);
    }, 1200);
  };

  const handleImageClick = () => { fileInputRef.current?.click(); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return alert("Report briefing required.");
    
    setLoading(true);
    await ApiService.submitReport({
      type: formData.type,
      severity: formData.severity,
      location: { lat: 34.0195, lng: -118.4912, name: formData.location },
      description: formData.description,
      image: formData.image
    });
    
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center min-h-screen bg-[#020617] animate-in zoom-in duration-500">
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 animate-pulse" />
          <div className="relative w-40 h-40 bg-white/5 backdrop-blur-3xl text-cyan-400 rounded-[3rem] flex items-center justify-center shadow-2xl border border-white/10">
            <ICONS.CheckCircle2 size={80} strokeWidth={2} />
          </div>
        </div>
        <h2 className="text-white text-4xl font-black tracking-tighter">Mission Success!</h2>
        <p className="text-slate-400 mt-6 leading-relaxed max-w-[80%] mx-auto font-medium">
          Evidence has been secured and logged.
          <span className="text-cyan-400 font-black block mt-2 tracking-[0.2em]">+50 IMPACT XP</span>
        </p>
        <button 
          onClick={() => onNavigate('home')}
          className="mt-16 w-full py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-[2.5rem] shadow-2xl shadow-cyan-500/20 active:scale-95 transition-transform"
        >
          SYNC TO BASE
        </button>
      </div>
    );
  }

  return (
    <div className="pb-40 bg-[#020617] min-h-screen">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" capture="environment" />
      
      <div className="relative h-[320px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/50 via-blue-950 to-[#020617] -z-10" />
        <div className="relative z-10 pt-20 px-8">
          <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.5em] mb-3">Field Deployment</p>
          <h1 className="text-white text-5xl font-black tracking-tighter">Log Evidence</h1>
          <p className="text-slate-400 text-sm mt-3 font-medium">Capture environmental threats instantly.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 -mt-16 space-y-8 relative z-20">
        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[3.5rem] border border-white/10 shadow-2xl space-y-10">
          
          <div className="space-y-5">
            <label className="text-[10px] font-black text-cyan-400/50 uppercase tracking-[0.3em] ml-2">Breach Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[PollutionType.PLASTIC, PollutionType.OIL, PollutionType.CHEMICAL, PollutionType.DEBRIS].map(type => (
                <button
                  key={type} type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type }))}
                  className={`py-5 px-3 rounded-[1.8rem] text-[10px] font-black transition-all border-2 ${
                    formData.type === type 
                      ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
                      : 'bg-white/5 border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <label className="text-[10px] font-black text-cyan-400/50 uppercase tracking-[0.3em] ml-2">Threat Severity</label>
            <div className="flex justify-between items-center bg-black/20 p-2 rounded-full border border-white/5">
              {Object.values(Severity).map(s => (
                <button
                  key={s} type="button"
                  onClick={() => setFormData(prev => ({ ...prev, severity: s }))}
                  className={`w-14 h-14 rounded-full font-black text-[10px] transition-all flex items-center justify-center ${
                    formData.severity === s 
                      ? getSeverityColor(s) + ' shadow-lg scale-110' 
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                >
                  {s.charAt(0)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <label className="text-[10px] font-black text-cyan-400/50 uppercase tracking-[0.3em] ml-2">Satellite Position</label>
            <div className="relative group">
              <input readOnly value={formData.location} className="w-full p-6 bg-black/20 border border-white/5 rounded-3xl outline-none pr-20 font-bold text-white text-sm" />
              <button 
                type="button" 
                onClick={handleGPS} 
                disabled={loading} 
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-14 h-14 rounded-[1.2rem] text-white transition-all flex items-center justify-center ${loading ? 'bg-slate-800 animate-pulse' : 'bg-cyan-500 hover:bg-cyan-400 active:scale-90 shadow-xl'}`}
              >
                <ICONS.MapPin size={24} />
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <label className="text-[10px] font-black text-cyan-400/50 uppercase tracking-[0.3em] ml-2">Visual Confirmation</label>
            <div className="flex space-x-4">
              <button 
                type="button" 
                onClick={handleImageClick} 
                className="w-full aspect-square max-w-[120px] bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-cyan-400 transition-all active:scale-95 group overflow-hidden relative"
              >
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={removeImage} className="absolute top-2 right-2 w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-2xl active:scale-75"><ICONS.Zap size={16} className="rotate-45" /></button>
                  </>
                ) : (
                  <>
                    <ICONS.Camera size={32} />
                    <span className="text-[8px] font-black mt-3 uppercase tracking-widest text-slate-500">Capture</span>
                  </>
                )}
              </button>
              <div className="flex-grow flex flex-col justify-center">
                <p className="text-xs text-slate-500 font-medium">Attach high-resolution evidence for AI diagnostics.</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <label className="text-[10px] font-black text-cyan-400/50 uppercase tracking-[0.3em] ml-2">Report Briefing</label>
            <textarea 
              rows={4} 
              placeholder="Operational details..." 
              value={formData.description} 
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
              className="w-full p-6 bg-black/20 border border-white/5 rounded-[2.5rem] outline-none resize-none font-medium text-white text-sm focus:border-cyan-500/50 transition-colors" 
            />
          </div>
        </div>

        <button 
          disabled={loading || formData.location.includes('Lock Pending')} 
          type="submit" 
          className={`w-full py-7 text-white text-sm font-black rounded-[3rem] shadow-2xl transition-all active:scale-95 ${loading || formData.location.includes('Lock Pending') ? 'bg-slate-800 text-slate-600' : 'bg-gradient-to-r from-cyan-600 to-blue-700 shadow-cyan-900/40'}`}
        >
          {loading ? 'TRANSMITTING...' : 'SECURE EVIDENCE (+50 XP)'}
        </button>
      </form>
    </div>
  );
};

const getSeverityColor = (s: Severity) => {
  switch (s) {
    case Severity.LOW: return 'bg-cyan-500 text-white';
    case Severity.MEDIUM: return 'bg-amber-500 text-white';
    case Severity.HIGH: return 'bg-orange-600 text-white';
    case Severity.CRITICAL: return 'bg-rose-600 text-white animate-pulse';
  }
};

export default ReportPollution;
