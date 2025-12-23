
import React, { useState, useRef, useEffect } from 'react';
import { Screen } from '../types';
import { ICONS } from '../constants';
import { ChatMessage, getGeminiResponse } from '../services/geminiService';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const AIAssistant: React.FC<Props> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: "EcoPulse system active. Scanning deep-sea sectors... How can I assist your mission today, Guardian? 🌊", timestamp: 'System Initialized' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;
    
    const userMsg: ChatMessage = { role: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getGeminiResponse(text);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: response, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#020617] overflow-hidden">
      {/* Immersive Dark Header */}
      <div className="relative pt-16 pb-10 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/50 via-indigo-950/20 to-transparent" />
        <div className="flex items-center justify-between relative">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-cyan-400 rounded-2xl blur opacity-30 animate-pulse" />
              <div className="relative w-16 h-16 bg-white/5 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <ICONS.Sparkles size={32} className="text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-white text-2xl font-black tracking-tighter leading-none">EcoPulse</h1>
              <div className="flex items-center space-x-2 mt-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                <span className="text-cyan-400/60 text-[10px] font-black uppercase tracking-[0.4em]">NEURAL LINK ACTIVE</span>
              </div>
            </div>
          </div>
          <button onClick={() => setMessages([messages[0]])} className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white active:scale-90 transition-transform">
            <ICONS.Waves size={24} />
          </button>
        </div>
      </div>

      {/* Messages Environment */}
      <div className="flex-grow overflow-y-auto px-6 space-y-10 pb-48 no-scrollbar relative pt-4">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_50%_20%,#0e7490_0%,transparent_60%)]" />
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[90%] px-7 py-6 rounded-[3rem] relative ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-tr-none shadow-[0_20px_40px_rgba(79,70,229,0.3)]' 
                : 'bg-white/5 backdrop-blur-3xl text-cyan-50 border border-white/10 rounded-tl-none shadow-2xl'
            }`}>
              <p className="text-[15px] leading-relaxed font-medium tracking-tight italic">
                {msg.text}
              </p>
              <div className={`mt-4 flex items-center space-x-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-30">
                  {msg.timestamp}
                </p>
                {msg.role === 'ai' && <div className="w-1 h-1 bg-cyan-400 rounded-full" />}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-white/10 rounded-tl-none flex space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-duration:0.6s]" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Futuristic Floating Input */}
      <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 z-40">
        <div className="bg-white/10 backdrop-blur-3xl p-3 rounded-[3rem] border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex items-center space-x-3">
          <button className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-cyan-400 transition-all active:scale-90 border border-white/5">
            <ICONS.Camera size={26} strokeWidth={2.5} />
          </button>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your transmission..."
            className="flex-grow py-4 outline-none text-[15px] font-bold text-white bg-transparent placeholder-white/20"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={`w-14 h-14 rounded-full transition-all flex items-center justify-center shadow-2xl ${
              input.trim() && !isTyping ? 'bg-cyan-500 text-white shadow-cyan-500/50 active:scale-90' : 'bg-white/5 text-white/10'
            }`}
          >
            <ICONS.ChevronRight size={28} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
