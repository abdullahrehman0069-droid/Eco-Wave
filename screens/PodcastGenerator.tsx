
import React, { useState, useRef } from 'react';
import { Screen } from '../types';
import { ICONS } from '../constants';
import { generatePodcastAudio, decodeAudioData } from '../services/geminiService';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const EcoPodcastGenerator: React.FC<Props> = ({ onNavigate }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    // Stop any existing playback
    stopAudio();
    
    setIsGenerating(true);
    setAudioData(null);
    setIsPlaying(false);
    
    try {
      const bytes = await generatePodcastAudio(topic);
      setAudioData(bytes);
    } catch (err) {
      console.error(err);
      alert("Oceanic interference detected. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = async () => {
    if (!audioData) return;
    
    try {
      // Create or resume the AudioContext
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Decode the raw PCM bytes for THIS context
      const buffer = await decodeAudioData(audioData, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      
      source.onended = () => {
        setIsPlaying(false);
        audioSourceRef.current = null;
      };
      
      source.start();
      audioSourceRef.current = source;
      setIsPlaying(true);
    } catch (err) {
      console.error("Playback error:", err);
      alert("Failed to play audio. Try generating again.");
    }
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {
        // Source might already be stopped
      }
      audioSourceRef.current = null;
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-32">
      {/* Podcast Header */}
      <div className="relative pt-16 px-8 pb-12 overflow-hidden">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('home')}
          className="absolute top-10 left-6 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 active:scale-90 transition-transform z-30"
        >
          <ICONS.ChevronRight size={24} className="rotate-180" />
        </button>

        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-transparent" />
        
        {/* Animated Sonic Waves */}
        <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20 pointer-events-none flex items-end justify-around px-4">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="w-1 bg-cyan-400 rounded-full"
              style={{ 
                height: `${Math.random() * 80 + 20}%`,
                animation: `wave-dance ${Math.random() * 1 + 0.5}s ease-in-out infinite alternate`
              }} 
            />
          ))}
        </div>

        <div className="relative z-10 pt-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse shadow-[0_0_8px_#a855f7]" />
            <p className="text-purple-400 text-[10px] font-black uppercase tracking-[0.4em]">EcoStream AI</p>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Eco Podcast</h1>
          <p className="text-slate-400 text-sm mt-3 font-medium leading-relaxed">
            Convert conservation topics into bite-sized, professional AI-narrated podcasts instantly.
          </p>
        </div>
      </div>

      <div className="px-6 space-y-8 relative z-20">
        {/* Input Topic */}
        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
          <label className="text-[10px] font-black text-purple-400/60 uppercase tracking-widest block mb-4">Choose a Topic</label>
          <textarea 
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The impact of microplastics on sea turtles..."
            className="w-full bg-transparent border-0 outline-none text-lg font-bold placeholder-white/10 resize-none text-white focus:ring-0"
          />
          <div className="flex space-x-2 mt-4 overflow-x-auto no-scrollbar pb-2">
            {['Coral Bleaching', 'Oil Spill Response', 'Deep Sea Mining', 'Sustainable Fishing'].map(t => (
              <button 
                key={t}
                onClick={() => setTopic(t)}
                className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10"
              >
                {t}
              </button>
            ))}
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className={`w-full mt-6 py-5 rounded-[2rem] font-black text-sm transition-all flex items-center justify-center space-x-3 shadow-2xl ${
              isGenerating || !topic.trim() 
                ? 'bg-slate-800 text-slate-500' 
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-purple-500/20 active:scale-95'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="animate-pulse">SYNTHESIZING...</span>
              </>
            ) : (
              <>
                <ICONS.Zap size={18} fill="white" />
                <span>GENERATE BROADCAST</span>
              </>
            )}
          </button>
        </div>

        {/* Player HUD */}
        {audioData && (
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                <button 
                  onClick={isPlaying ? stopAudio : playAudio}
                  className="relative z-10 transition-transform active:scale-90"
                >
                  {isPlaying ? (
                    <div className="w-8 h-8 flex space-x-1.5 items-center justify-center">
                      <div className="w-2 h-8 bg-white rounded-full animate-pulse" />
                      <div className="w-2 h-4 bg-white rounded-full animate-pulse [animation-delay:0.1s]" />
                      <div className="w-2 h-8 bg-white rounded-full animate-pulse [animation-delay:0.2s]" />
                    </div>
                  ) : (
                    <ICONS.Play size={40} fill="white" />
                  )}
                </button>
              </div>
              
              <h3 className="text-xl font-black tracking-tight text-center mb-2 line-clamp-1">{topic}</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">EcoWave Original Broadcast</p>
              
              {/* Visualizer during play */}
              {isPlaying && (
                <div className="flex items-center justify-center space-x-1 h-8 mt-8">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-purple-400 rounded-full"
                      style={{ 
                        height: '100%',
                        animation: `wave-dance ${0.4 + Math.random() * 0.4}s ease-in-out infinite alternate`
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Placeholder state */}
        {!audioData && !isGenerating && (
          <div className="py-20 flex flex-col items-center justify-center opacity-20">
            <div className="relative">
              <div className="w-24 h-24 border-2 border-dashed border-purple-500 rounded-full animate-[spin_15s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ICONS.Play size={32} />
              </div>
            </div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-center">Ready for Transcription</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes wave-dance {
          from { transform: scaleY(0.2); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};

export default EcoPodcastGenerator;
