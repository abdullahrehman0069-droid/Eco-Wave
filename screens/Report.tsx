
import React, { useState } from 'react';
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

  const handleGPS = () => {
    setLoading(true);
    // Simulated GPS delay
    setTimeout(() => {
      setFormData(prev => ({ ...prev, location: "Ocean Front Ave, CA (34.01N, 118.49W)" }));
      setLoading(false);
    }, 1500);
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
      <div className="flex flex-col items-center justify-center p-10 text-center min-h-screen animate-in zoom-in duration-500 bg-white">
        <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-emerald-100/50">
          <ICONS.CheckCircle2 size={64} strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Report Logged!</h2>
        <p className="text-slate-500 mt-4 leading-relaxed max-w-[80%] mx-auto font-medium">
          Thank you for being a steward of the sea. You've earned 
          <span className="text-emerald-600 font-black px-1.5 py-0.5 bg-emerald-50 rounded-lg mx-1">+50 pts</span> 
          towards your next level.
        </p>
        <div className="mt-12 w-full space-y-4">
          <button 
            onClick={() => onNavigate('home')}
            className={`w-full py-5 bg-gradient-to-r ${GRADIENTS.report} text-white font-black rounded-3xl shadow-2xl transition-transform active:scale-95`}
          >
            Back to Ocean Hub
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className="w-full py-4 text-slate-400 font-bold hover:text-cyan-600 transition-colors"
          >
            Check Progress
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 bg-slate-50 min-h-screen">
      <div className={`bg-gradient-to-r ${GRADIENTS.report} pt-16 pb-12 px-8 text-white rounded-b-[3rem] shadow-lg`}>
        <h1 className="text-3xl font-black tracking-tight">Log Pollution</h1>
        <p className="opacity-90 text-sm mt-2 font-medium">Real-time data helps us protect marine life.</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 -mt-6 space-y-8">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
          {/* Pollution Type */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Issue Category</label>
            <div className="relative">
              <select 
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as PollutionType }))}
                className="w-full p-5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none font-bold text-slate-700 appearance-none"
              >
                {Object.values(PollutionType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ICONS.ChevronRight size={20} className="rotate-90" />
              </div>
            </div>
          </div>

          {/* Severity */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Intensity Level</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(Severity).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, severity: s }))}
                  className={`py-3 text-[10px] font-black rounded-xl border-2 transition-all ${
                    formData.severity === s 
                      ? getSeverityColor(s) + ' border-current shadow-lg shadow-current/20' 
                      : 'border-slate-100 bg-slate-50 text-slate-400'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Report Location</label>
            <div className="relative group">
              <input 
                readOnly
                value={formData.location}
                className="w-full p-5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none pr-14 font-bold text-slate-600"
              />
              <button 
                type="button"
                onClick={handleGPS}
                disabled={loading}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-white shadow-md active:scale-90 transition-all ${loading ? 'bg-slate-300 animate-pulse' : 'bg-cyan-600'}`}
              >
                <ICONS.MapPin size={20} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Detail Description</label>
            <textarea 
              rows={4}
              placeholder="e.g. Size of patch, notable landmarks, weather conditions..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-5 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none resize-none font-medium text-slate-700"
            />
          </div>

          {/* Camera Access */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Visual Evidence</label>
            <div className="flex space-x-4">
              <button type="button" className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 transition-all active:bg-slate-100 active:scale-95 group">
                <ICONS.Camera size={28} className="group-hover:text-cyan-500 transition-colors" />
                <span className="text-[10px] font-black mt-2 uppercase tracking-tighter">Snap</span>
              </button>
              <div className="flex-grow flex items-center justify-center bg-slate-50 rounded-3xl border border-slate-100 text-slate-300 text-xs font-bold italic px-4 text-center">
                Photos help authorities prioritize cleanup efforts
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          disabled={loading || formData.location === 'Awaiting GPS...'}
          type="submit"
          className={`w-full py-5 text-white font-black rounded-3xl shadow-2xl transition-all active:scale-95 ${
            loading || formData.location === 'Awaiting GPS...' ? 'bg-slate-300 shadow-none cursor-not-allowed' : `bg-gradient-to-r ${GRADIENTS.report}`
          }`}
        >
          {loading ? 'Transmitting Data...' : 'Submit Evidence (+50 PTS)'}
        </button>
      </form>
    </div>
  );
};

const getSeverityColor = (s: Severity) => {
  switch (s) {
    case Severity.LOW: return 'bg-blue-100 text-blue-600';
    case Severity.MEDIUM: return 'bg-yellow-100 text-yellow-600';
    case Severity.HIGH: return 'bg-orange-100 text-orange-600';
    case Severity.CRITICAL: return 'bg-red-100 text-red-600';
  }
};

export default ReportPollution;
