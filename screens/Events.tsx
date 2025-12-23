
import React, { useState, useEffect } from 'react';
import { Screen, Event } from '../types';
import { ICONS } from '../constants';
import { ApiService } from '../services/apiService';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const CleanupEvents: React.FC<Props> = ({ onNavigate }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    refreshEvents();
  }, []);

  const refreshEvents = async () => {
    const data = await ApiService.fetchEvents();
    setEvents(data);
    // If an event is selected, update its local data too
    if (selectedEvent) {
      const updated = data.find(e => e.id === selectedEvent.id);
      if (updated) setSelectedEvent(updated);
    }
  };

  const handleToggleJoin = async () => {
    if (!selectedEvent || isProcessing) return;
    setIsProcessing(true);
    
    const result = await ApiService.toggleEventJoin(selectedEvent.id);
    if (result.success) {
      if (result.isJoined) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);
      }
      await refreshEvents();
    }
    setIsProcessing(false);
  };

  if (selectedEvent) {
    return (
      <div className="animate-in slide-in-from-right duration-500 pb-32 bg-[#f8fafc] min-h-screen">
        <div className="relative h-80 overflow-hidden">
          <ImageWithFallback src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button 
            onClick={() => setSelectedEvent(null)} 
            className="absolute top-10 left-6 w-12 h-12 bg-white/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/20 active:scale-90 z-20"
          >
            <ICONS.ChevronRight size={24} className="rotate-180" />
          </button>
          
          <div className="absolute bottom-16 left-8 right-8 text-white z-10">
            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
              selectedEvent.difficulty === 'Easy' ? 'bg-emerald-500' : 
              selectedEvent.difficulty === 'Moderate' ? 'bg-amber-500' : 'bg-red-500'
            }`}>
              {selectedEvent.difficulty} MISSION
            </span>
            <h1 className="text-3xl font-black tracking-tighter mt-2">{selectedEvent.title}</h1>
          </div>
        </div>

        <div className="px-6 -mt-10 relative z-20">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 space-y-8">
            <div className="flex justify-around items-center py-4 border-b border-slate-50">
              <div className="text-center">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Participants</p>
                <p className="text-lg font-black text-slate-800">{selectedEvent.participants}/{selectedEvent.maxParticipants}</p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="text-center">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                <p className="text-lg font-black text-slate-800">{selectedEvent.date.split(',')[0]}</p>
              </div>
            </div>

            <div>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Briefing</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{selectedEvent.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                  <ICONS.MapPin size={20} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rendezvous</p>
                  <p className="text-xs font-bold text-slate-700">{selectedEvent.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <ICONS.Clock size={20} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                  <p className="text-xs font-bold text-slate-700">{selectedEvent.time}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              {showSuccess && (
                <div className="absolute -top-12 left-0 right-0 text-center animate-in fade-in slide-in-from-bottom-2">
                  <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest">
                    MISSION ACCEPTED! +100 XP
                  </span>
                </div>
              )}
              <button 
                disabled={isProcessing}
                onClick={handleToggleJoin} 
                className={`w-full py-6 rounded-[2rem] font-black text-sm transition-all shadow-2xl flex items-center justify-center space-x-3 ${
                  selectedEvent.isJoined 
                    ? 'bg-slate-100 text-slate-400' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white active:scale-95'
                }`}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : selectedEvent.isJoined ? (
                  <>
                    <ICONS.CheckCircle2 size={20} />
                    <span>ALREADY ENLISTED</span>
                  </>
                ) : (
                  <>
                    <ICONS.Zap size={20} fill="white" />
                    <span>ACCEPT MISSION</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-[#f8fafc] min-h-screen">
      <div className="relative h-[280px] overflow-hidden bg-[#0c4a6e]">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900 via-cyan-900 to-[#f8fafc]" />
        <div className="relative z-10 pt-16 px-8 text-white">
          <p className="text-teal-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Ocean Heroes</p>
          <h1 className="text-4xl font-black tracking-tighter">Field Missions</h1>
          <p className="text-white/60 text-sm mt-3 font-medium max-w-[200px]">Join local efforts to protect our blue planet.</p>
        </div>
      </div>

      <div className="px-6 -mt-10 grid grid-cols-2 gap-4 relative z-20">
        {events.map(event => (
          <div 
            key={event.id} 
            onClick={() => setSelectedEvent(event)} 
            className="group bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-50 flex flex-col transition-all active:scale-95 hover:-translate-y-1"
          >
            <div className="relative h-32 overflow-hidden shrink-0">
              <ImageWithFallback src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
              {event.isJoined && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                  <ICONS.CheckCircle2 size={12} strokeWidth={3} />
                </div>
              )}
              <div className="absolute bottom-2 left-3">
                <span className={`px-2 py-0.5 rounded-full text-[7px] font-black text-white uppercase tracking-tighter ${
                  event.difficulty === 'Easy' ? 'bg-emerald-500' : 
                  event.difficulty === 'Moderate' ? 'bg-amber-500' : 'bg-red-500'
                }`}>
                  {event.difficulty}
                </span>
              </div>
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-800 line-clamp-1 mb-1">{event.title}</h3>
                <div className="flex items-center text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                  <ICONS.MapPin size={10} className="mr-1 shrink-0" />
                  <span className="truncate">{event.location.split(',')[0]}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-end">
                <span className="text-[9px] font-black text-cyan-600">{event.date.split(' ')[0]}</span>
                <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <ICONS.ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CleanupEvents;
