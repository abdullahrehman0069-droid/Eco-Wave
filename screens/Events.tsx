
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

  useEffect(() => {
    ApiService.fetchEvents().then(setEvents);
  }, []);

  if (selectedEvent) {
    return (
      <div className="animate-in slide-in-from-right duration-500 pb-32 bg-[#f8fafc] min-h-screen">
        <div className="relative h-80 overflow-hidden">
          <ImageWithFallback src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
          <button onClick={() => setSelectedEvent(null)} className="absolute top-10 left-6 w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/20 active:scale-90"><ICONS.ChevronRight size={28} className="rotate-180" /></button>
        </div>
        <div className="px-6 -mt-12 relative z-10">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter mb-4">{selectedEvent.title}</h1>
            <p className="text-sm text-slate-500 mb-8">{selectedEvent.description}</p>
            <button onClick={() => ApiService.toggleEventJoin(selectedEvent.id)} className="w-full py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-[2rem] font-black">ACCEPT MISSION</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-[#f8fafc] min-h-screen">
      <div className="relative h-[320px] overflow-hidden bg-[#0c4a6e]">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900 via-cyan-900 to-[#020617]" />
        <div className="relative z-10 pt-16 px-8 text-white">
          <p className="text-teal-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Available Missions</p>
          <h1 className="text-4xl font-black tracking-tighter">Ocean Heroes</h1>
        </div>
      </div>
      <div className="px-6 -mt-16 space-y-8 relative z-20">
        {events.map(event => (
          <div key={event.id} onClick={() => setSelectedEvent(event)} className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-50">
            <div className="h-48 overflow-hidden"><ImageWithFallback src={event.image} alt={event.title} className="w-full h-full object-cover" /></div>
            <div className="p-8">
              <h3 className="text-xl font-black text-slate-800 mb-2">{event.title}</h3>
              <div className="flex items-center text-xs text-slate-400"><ICONS.MapPin size={14} className="mr-2" />{event.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CleanupEvents;
