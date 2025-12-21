
import React, { useState, useEffect } from 'react';
import { Screen, Event } from '../types';
import { ICONS, GRADIENTS } from '../constants';
import { MockApiService } from '../services/mockApi';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const CleanupEvents: React.FC<Props> = ({ onNavigate }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    MockApiService.fetchEvents().then(setEvents);
  }, []);

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                          e.location.toLowerCase().includes(search.toLowerCase());
    if (filter === 'Joined') return e.isJoined && matchesSearch;
    return matchesSearch;
  });

  if (selectedEvent) {
    const capacityPct = (selectedEvent.participants / selectedEvent.maxParticipants) * 100;

    return (
      <div className="animate-in slide-in-from-right duration-500 pb-32 bg-[#f8fafc] min-h-screen">
        <div className="relative h-80 overflow-hidden bg-slate-200">
          <ImageWithFallback 
            src={`${selectedEvent.image}&w=800&q=80&auto=format`} 
            alt={selectedEvent.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
          <button 
            onClick={() => setSelectedEvent(null)}
            className="absolute top-10 left-6 w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/20 active:scale-90 transition-transform"
          >
            <ICONS.ChevronRight size={28} className="rotate-180" />
          </button>
        </div>

        <div className="px-6 -mt-12 relative z-10">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest ${
                selectedEvent.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                selectedEvent.difficulty === 'Moderate' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
              }`}>
                {selectedEvent.difficulty} Operation
              </span>
              <div className="text-right">
                <p className="text-sm font-black text-cyan-600">{selectedEvent.date}</p>
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">{selectedEvent.time}</p>
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-slate-800 leading-tight mb-8 tracking-tighter">{selectedEvent.title}</h1>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <DetailChip icon={<ICONS.MapPin size={18} />} label="Sector" value={selectedEvent.location.split(',')[0]} color="cyan" />
              <DetailChip icon={<ICONS.User size={18} />} label="Unit" value={selectedEvent.organizer.split(' ')[0]} color="teal" />
            </div>

            <p className="text-sm text-slate-500 leading-relaxed font-medium mb-10">{selectedEvent.description}</p>

            {/* Liquid Capacity Bar */}
            <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 mb-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Capacity</span>
                <span className="text-sm font-black text-cyan-600">{selectedEvent.participants} / {selectedEvent.maxParticipants}</span>
              </div>
              <div className="h-6 bg-white rounded-full overflow-hidden p-1 shadow-inner border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 rounded-full transition-all duration-1000 relative overflow-hidden" 
                  style={{ width: `${capacityPct}%` }}
                >
                  <div className="absolute inset-0 opacity-20 animate-[wave_4s_infinite_linear] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat-x" />
                </div>
              </div>
            </div>

            <button 
              onClick={async () => {
                const res = await MockApiService.toggleEventJoin(selectedEvent.id);
                if (res.success) {
                  setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...e, isJoined: res.isJoined, participants: res.isJoined ? e.participants + 1 : e.participants - 1 } : e));
                  setSelectedEvent(prev => prev ? { ...prev, isJoined: res.isJoined, participants: res.isJoined ? prev.participants + 1 : prev.participants - 1 } : null);
                }
              }}
              className={`w-full py-6 rounded-[2.5rem] font-black text-sm shadow-2xl transition-all active:scale-95 ${
                selectedEvent.isJoined 
                  ? 'bg-slate-100 text-slate-400' 
                  : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-200'
              }`}
            >
              {selectedEvent.isJoined ? 'ABORT MISSION' : 'ACCEPT MISSION (+100 XP)'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-[#f8fafc] min-h-screen">
      {/* Animated Header */}
      <div className="relative h-[320px] overflow-hidden bg-[#0c4a6e]">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900 via-cyan-900 to-[#020617]" />
        <div className="relative z-10 pt-16 px-8">
          <p className="text-teal-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Available Missions</p>
          <h1 className="text-white text-4xl font-black tracking-tighter">Ocean Heroes</h1>
          <p className="text-cyan-100/60 text-sm mt-2 font-medium">Coordinate with global units for high-impact cleanups.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 leading-[0]">
          <svg className="relative block w-full h-[60px]" viewBox="0 24 150 28" preserveAspectRatio="none">
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" fill="#f8fafc" />
          </svg>
        </div>
      </div>

      <div className="px-6 -mt-16 space-y-8 relative z-20">
        {/* Search */}
        <div className="relative group">
          <ICONS.Search className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-400/40" size={20} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sectors..."
            className="w-full pl-16 pr-6 py-5 bg-white/90 backdrop-blur-xl border border-white/20 rounded-[2.5rem] outline-none shadow-2xl focus:ring-4 focus:ring-cyan-500/10 font-bold text-slate-800"
          />
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 gap-8">
          {filteredEvents.map(event => (
            <FluidEventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FluidEventCard = ({ event, onClick }: { event: Event, onClick: () => void }) => (
  <div onClick={onClick} className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden active:scale-[0.98] transition-all group">
    <div className="h-60 relative overflow-hidden bg-slate-200">
      <ImageWithFallback 
        src={`${event.image}&w=600&q=80&auto=format`} 
        alt={event.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 to-transparent" />
      <div className="absolute top-6 left-6">
        <span className={`px-4 py-2 rounded-2xl text-[8px] font-black uppercase tracking-widest ${
          event.difficulty === 'Easy' ? 'bg-emerald-500 text-white' :
          event.difficulty === 'Moderate' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {event.difficulty}
        </span>
      </div>
      <div className="absolute bottom-6 left-6 right-6">
        <p className="text-cyan-300 text-[9px] font-black uppercase tracking-widest mb-1">{event.date}</p>
        <h3 className="text-white text-2xl font-black tracking-tight line-clamp-1">{event.title}</h3>
      </div>
    </div>
    <div className="p-8">
      <div className="flex items-center space-x-2 text-slate-400 text-xs font-black uppercase tracking-tighter mb-6">
        <ICONS.MapPin size={16} className="text-cyan-500" />
        <span className="truncate">{event.location}</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>{event.participants} Guarded</span>
          <span>{Math.round((event.participants / event.maxParticipants) * 100)}% Full</span>
        </div>
        <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full" 
            style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
          />
        </div>
      </div>
    </div>
  </div>
);

const DetailChip = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 flex items-center space-x-4">
    <div className={`p-3 bg-${color}-100 text-${color}-600 rounded-2xl`}>{icon}</div>
    <div className="overflow-hidden">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-black text-slate-700 truncate">{value}</p>
    </div>
  </div>
);

export default CleanupEvents;
