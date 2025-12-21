
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
    return (
      <div className="animate-in slide-in-from-right duration-300 pb-24 bg-white min-h-screen">
        <div className="relative h-72">
          <ImageWithFallback src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button 
            onClick={() => setSelectedEvent(null)}
            className="absolute top-10 left-6 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/30 active:scale-90 transition-transform"
          >
            <ICONS.ChevronRight size={28} className="rotate-180" />
          </button>
        </div>

        <div className="px-6 -mt-10 relative z-10">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                selectedEvent.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-600' :
                selectedEvent.difficulty === 'Moderate' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
              }`}>
                {selectedEvent.difficulty} Level
              </span>
              <div className="text-right">
                <p className="text-sm font-black text-cyan-600">{selectedEvent.date}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{selectedEvent.time}</p>
              </div>
            </div>
            
            <h1 className="text-2xl font-black text-slate-800 leading-tight mb-6">{selectedEvent.title}</h1>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-3">
                <div className="p-2 bg-cyan-100 text-cyan-600 rounded-xl"><ICONS.MapPin size={18} /></div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Location</p>
                  <p className="text-xs font-bold text-slate-600 truncate">{selectedEvent.location.split(',')[0]}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-3">
                <div className="p-2 bg-teal-100 text-teal-600 rounded-xl"><ICONS.User size={18} /></div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Organizer</p>
                  <p className="text-xs font-bold text-slate-600 truncate">{selectedEvent.organizer.split(' ')[0]}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">About this effort</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{selectedEvent.description}</p>
            </div>

            <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black text-slate-800">Mission Capacity</span>
                <span className="text-xs font-black text-cyan-600">{selectedEvent.participants} / {selectedEvent.maxParticipants}</span>
              </div>
              <div className="h-4 bg-white rounded-full overflow-hidden p-1 shadow-inner border border-slate-100">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${(selectedEvent.participants / selectedEvent.maxParticipants) * 100}%` }}
                />
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
              className={`mt-8 w-full py-5 rounded-3xl font-black shadow-2xl transition-all active:scale-95 ${
                selectedEvent.isJoined 
                  ? 'bg-slate-100 text-slate-500 shadow-none' 
                  : `bg-gradient-to-r ${GRADIENTS.events} text-white`
              }`}
            >
              {selectedEvent.isJoined ? 'Unregister from Mission' : 'Accept Mission (+100 PTS)'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen pb-24">
      <div className={`bg-gradient-to-r ${GRADIENTS.events} pt-16 pb-12 px-8 text-white rounded-b-[3rem] shadow-xl`}>
        <h1 className="text-3xl font-black tracking-tight">Eco Missions</h1>
        <p className="opacity-90 text-sm mt-2 font-medium">Be the change our oceans need today.</p>
      </div>

      <div className="px-6 -mt-6 space-y-8">
        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative group">
            <ICONS.Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={20} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find nearby cleanups..."
              className="w-full pl-14 pr-6 py-4 bg-white border-0 rounded-[2rem] outline-none shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-teal-500 font-medium text-slate-700 placeholder-slate-300"
            />
          </div>
          <div className="flex bg-white p-1.5 rounded-[2rem] shadow-lg shadow-slate-200/30">
            {['All', 'Joined'].map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`flex-grow py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === t ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Event List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
          ))}
          {filteredEvents.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold italic">No missions found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EventCard: React.FC<{ event: Event; onClick: () => void }> = ({ event, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden active:scale-[0.98] transition-all group hover:shadow-2xl">
    <div className="h-52 relative">
      <ImageWithFallback src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute top-5 left-5">
        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
          event.difficulty === 'Easy' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
          event.difficulty === 'Moderate' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-red-500 text-white shadow-lg shadow-red-500/30'
        }`}>
          {event.difficulty}
        </span>
      </div>
      {event.isJoined && (
        <div className="absolute top-5 right-5">
          <div className="bg-cyan-600 text-white p-2 rounded-xl shadow-lg border border-white/20">
            <ICONS.CheckCircle2 size={16} />
          </div>
        </div>
      )}
      <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
        <div className="text-white">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-0.5">{event.date}</p>
          <h3 className="text-lg font-black leading-tight line-clamp-1">{event.title}</h3>
        </div>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center space-x-2 text-slate-400 text-[11px] font-bold mb-4">
        <ICONS.MapPin size={14} className="text-cyan-500" />
        <span className="truncate">{event.location}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400">
          <span>{event.participants} Volunteers</span>
          <span>{Math.round((event.participants / event.maxParticipants) * 100)}% Full</span>
        </div>
        <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
          <div 
            className="h-full bg-gradient-to-r from-teal-400 to-cyan-500" 
            style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
          />
        </div>
      </div>
    </div>
  </div>
);

export default CleanupEvents;
