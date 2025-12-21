
import React, { useState, useRef } from 'react';
import { Screen, Severity, PollutionType } from '../types';
import { ICONS, GRADIENTS } from '../constants';
import { MockApiService } from '../services/mockApi';

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
    location: 'Awaiting GPS...',
    image: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGPS = () => {
    setLoading(true);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, location: "Ocean Front Ave, CA (34.01N, 118.49W)" }));
      setLoading(false);
    }, 1500);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

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
    if (!formData.description) return alert("Please provide a description for the field team.");
    
    setLoading(true);
    await MockApiService.submitReport({
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
      <div className="flex flex-col items-center justify-center p-10 text-center min-h-screen animate-in zoom-in duration-500 bg-[#020617] text-white">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
          <div className="relative w-32 h-32 bg-emerald-500/20 backdrop-blur-xl text-emerald-400 rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-emerald-500/30">
            <ICONS.CheckCircle2 size={64} strokeWidth={2.5} />
          </div>
        </div>
        <h2 className="text-4xl font-black tracking-tighter">Impact Logged!</h2>
        <p className="text-cyan-100/60 mt-4 leading-relaxed max-w-[85%] mx-auto font-medium">
          Evidence transmitted to local authorities. You've earned 
          <span className="text-emerald-400 font-black px-2"> +50 XP </span> 
          for your stewardship.
        </p>
        <div className="mt-12 w-full space-y-4 px-6">
          <button 
            onClick={() => onNavigate('home')}
            className="w-full py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black rounded-[2rem] shadow-[0_15px_30px_rgba(16,185,129,0.3)] transition-all active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-[#f8fafc] min-h-screen">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
        capture="environment"
      />
      
      {/* Animated Header */}
      <div className="relative h-[300px] overflow-hidden bg-[#083344]">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900 via-blue-900 to-[#020617]" />
        <div className="relative z-10 pt-16 px-8">
          <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Field Evidence</p>
          <h1 className="text-white text-4xl font-black tracking-tighter">Log Pollution</h1>
          <p className="text-cyan-100/60 text-sm mt-2 font-medium">Transmit real-time data to help conservationists.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg className="relative block w-full h-[60px]" viewBox="0 24 150 28" preserveAspectRatio="none">
            <use href="#gentle-wave" x="48" y="0" fill="rgba(248,250,252,0.3)" />
            <use href="#gentle-wave" x="48" y="7" fill="#f8fafc" />
          </svg>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 -mt-16 space-y-8 relative z-20">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 space-y-8">
          {/* Type Selector */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Category</label>
            <div className="grid grid-cols-2 gap-3">
              {[PollutionType.PLASTIC, PollutionType.OIL, PollutionType.CHEMICAL, PollutionType.OTHER].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type }))}
                  className={`py-4 px-2 rounded-2xl text-[10px] font-black transition-all border-2 ${
                    formData.type === type 
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-600 shadow-lg' 
                      : 'bg-slate-50 border-slate-50 text-slate-400'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Severity Bubbles */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intensity Level</label>
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-[2rem]">
              {Object.values(Severity).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, severity: s }))}
                  className={`w-12 h-12 rounded-full font-black text-[8px] transition-all flex items-center justify-center ${
                    formData.severity === s 
                      ? getSeverityColor(s) + ' shadow-xl scale-110' 
                      : 'text-slate-300'
                  }`}
                >
                  {s.charAt(0)}
                </button>
              ))}
            </div>
          </div>

          {/* Location Bar */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Report Location</label>
            <div className="relative group">
              <input 
                readOnly
                value={formData.location}
                className="w-full p-5 bg-slate-50 border-0 rounded-3xl focus:ring-2 focus:ring-cyan-500 outline-none pr-16 font-bold text-slate-600 text-sm"
              />
              <button 
                type="button"
                onClick={handleGPS}
                disabled={loading}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl text-white shadow-lg active:scale-90 transition-all flex items-center justify-center ${loading ? 'bg-slate-300 animate-pulse' : 'bg-cyan-600'}`}
              >
                <ICONS.MapPin size={18} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Context & Details</label>
            <textarea 
              rows={4}
              placeholder="Provide details for the response team..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-6 bg-slate-50 border-0 rounded-[2rem] focus:ring-2 focus:ring-cyan-500 outline-none resize-none font-medium text-slate-700 text-sm"
            />
          </div>

          {/* Visual Evidence */}
          <div className="flex space-x-4">
            <button 
              type="button" 
              onClick={handleImageClick}
              className="w-28 h-28 bg-cyan-50 border-2 border-dashed border-cyan-200 rounded-[2.5rem] flex flex-col items-center justify-center text-cyan-600 transition-all active:scale-95 group overflow-hidden relative"
            >
              {formData.image ? (
                <>
                  <img src={formData.image} alt="Evidence preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ICONS.Camera size={24} className="text-white" />
                  </div>
                  <button 
                    onClick={removeImage}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-75"
                  >
                    <ICONS.Zap size={12} className="rotate-45" />
                  </button>
                </>
              ) : (
                <>
                  <ICONS.Camera size={28} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-[9px] font-black mt-2 uppercase tracking-tighter">Snapshot</span>
                </>
              )}
            </button>
            <div className="flex-grow flex flex-col items-center justify-center bg-slate-50 rounded-[2.5rem] border border-slate-100 p-6 text-center leading-tight">
              <span className="text-slate-300 text-[10px] font-black uppercase mb-1">Evidence Quality</span>
              <span className="text-slate-400 text-[9px] font-medium leading-tight">Attach visuals to prioritize dispatch and earn bonus recognition.</span>
            </div>
          </div>
        </div>

        <button 
          disabled={loading || formData.location === 'Awaiting GPS...'}
          type="submit"
          className={`w-full py-6 text-white text-sm font-black rounded-[2.5rem] shadow-2xl transition-all active:scale-95 relative overflow-hidden group ${
            loading || formData.location === 'Awaiting GPS...' ? 'bg-slate-300' : 'bg-gradient-to-r from-cyan-600 to-blue-700'
          }`}
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <span className="relative z-10">{loading ? 'TRANSMITTING...' : 'LOG EVIDENCE (+50 XP)'}</span>
        </button>
      </form>

      <svg className="hidden">
        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
      </svg>
    </div>
  );
};

const getSeverityColor = (s: Severity) => {
  switch (s) {
    case Severity.LOW: return 'bg-cyan-500 text-white';
    case Severity.MEDIUM: return 'bg-amber-500 text-white';
    case Severity.HIGH: return 'bg-orange-600 text-white';
    case Severity.CRITICAL: return 'bg-red-600 text-white';
  }
};

export default ReportPollution;
