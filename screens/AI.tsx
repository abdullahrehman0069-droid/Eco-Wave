
import React, { useState, useRef, useEffect } from 'react';
import { Screen } from '../types';
import { ICONS, GRADIENTS } from '../constants';
import { ChatMessage, getGeminiResponse } from '../services/geminiService';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const AIAssistant: React.FC<Props> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: "Hello! I'm EcoPulse, your marine intelligence guide. How can I help you protect our blue planet today? 🐬", timestamp: 'Just now' }
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
      {/* Animated Deep Sea Header */}
      <div className="relative pt-12 pb-8 px-8 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 to-transparent" />
        <div className="flex items-center justify-between relative">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-cyan-500/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <ICONS.Sparkles size={28} className="text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-black tracking-tighter leading-none">EcoPulse AI</h1>
              <div className="flex items-center space-x-1.5 mt-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
                <span className="text-cyan-400/60 text-[10px] font-black uppercase tracking-[0.3em]">Deep Signal Stable</span>
              </div>
            </div>
          </div>
          <button onClick={() => setMessages([messages[0]])} className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white transition-transform active:scale-90">
            <ICONS.Zap size={20} />
          </button>
        </div>
      </div>

      {/* Deep Sea Chat Environment */}
      <div className="flex-grow overflow-y-auto px-6 space-y-8 pb-48 no-scrollbar relative">
        {/* Subtle Ambient Rays */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,#0e7490_0%,transparent_70%)]" />
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[85%] px-6 py-5 rounded-[2.5rem] relative group ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-tr-none shadow-[0_10px_30px_rgba(79,70,229,0.3)]' 
                : 'bg-white/10 backdrop-blur-xl text-cyan-50 border border-white/10 rounded-tl-none shadow-2xl'
            }`}>
              <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
              <p className={`text-[8px] mt-3 font-black uppercase tracking-widest opacity-40 ${msg.role === 'user' ? 'text-right' : ''}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-white/10 rounded-tl-none flex space-x-1.5">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Floating Glass Input */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto p-6 z-30">
        <div className="space-y-4">
          <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
            <QuickAction label="Identity Pollution" icon={<ICONS.Search size={14} />} onClick={() => handleSend("Identify common marine pollutants")} />
            <QuickAction label="Daily Tips" icon={<ICONS.Zap size={14} />} onClick={() => handleSend("Give me a daily ocean protection tip")} />
          </div>

          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-3xl p-3 rounded-[2.5rem] border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <button className="w-12 h-12 text-cyan-400 bg-white/5 rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-white/5">
              <ICONS.Camera size={24} />
            </button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query the Ocean..."
              className="flex-grow py-3 outline-none text-sm font-black text-white bg-transparent placeholder-cyan-100/30"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className={`w-12 h-12 rounded-2xl transition-all flex items-center justify-center shadow-lg ${
                input.trim() && !isTyping ? 'bg-cyan-500 text-white shadow-cyan-500/30 active:scale-90' : 'bg-white/5 text-white/20'
              }`}
            >
              <ICONS.ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ label, icon, onClick }: { label: string, icon: any, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="whitespace-nowrap bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-cyan-200 shadow-xl active:scale-95 flex items-center space-x-2"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default AIAssistant;
