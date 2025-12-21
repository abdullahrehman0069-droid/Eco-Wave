
import React, { useState, useRef, useEffect } from 'react';
import { Screen } from '../types';
import { ICONS, GRADIENTS } from '../constants';
import { ChatMessage, getGeminiResponse } from '../services/geminiService';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const AIAssistant: React.FC<Props> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: "Sea greetings! I'm EcoPulse, your marine AI. Ask me about identifying pollution, saving turtles, or reducing your plastic footprint. 🐳", timestamp: 'Just now' }
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
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${GRADIENTS.ai} pt-12 pb-6 px-8 text-white shadow-2xl z-20 rounded-b-[2.5rem]`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
              <ICONS.Sparkles size={28} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-none">EcoPulse AI</h1>
              <div className="flex items-center space-x-1.5 mt-2 opacity-80">
                <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Oracle System Online</span>
              </div>
            </div>
          </div>
          <button onClick={() => setMessages([messages[0]])} className="p-3 bg-white/10 rounded-2xl border border-white/20 active:scale-90 transition-transform">
            <ICONS.Zap size={20} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto px-6 pt-10 space-y-6 pb-44 no-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] px-5 py-4 rounded-3xl shadow-xl ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-200/50' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-slate-200/50'
            }`}>
              <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
              <p className={`text-[9px] mt-2 font-black uppercase tracking-widest opacity-40 ${msg.role === 'user' ? 'text-right' : ''}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-5 py-4 rounded-3xl border border-slate-100 rounded-tl-none flex space-x-1.5 shadow-xl shadow-slate-200/50">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input UI Overlay */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto p-6 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent z-30">
        <div className="space-y-4">
          {/* Quick Actions - Only shown when few messages */}
          {messages.length < 5 && (
            <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
              <QuickAction label="Identify Pollution" icon={<ICONS.Search size={14} />} onClick={() => handleSend("Identify common marine pollutants")} />
              <QuickAction label="Reduce Plastic" icon={<ICONS.AlertTriangle size={14} />} onClick={() => handleSend("Tips to reduce daily plastic")} />
              <QuickAction label="Turtle Safety" icon={<ICONS.Heart size={14} />} onClick={() => handleSend("How to help sea turtles")} />
            </div>
          )}

          {/* Input Bar */}
          <div className="flex items-center space-x-3 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-2xl shadow-indigo-100/50">
            <button className="p-3 text-slate-400 bg-slate-50 rounded-2xl active:scale-90 transition-all">
              <ICONS.Camera size={24} />
            </button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask EcoPulse..."
              className="flex-grow py-2 outline-none text-sm font-bold text-slate-700 bg-transparent"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className={`p-3 rounded-2xl transition-all shadow-lg ${
                input.trim() && !isTyping ? 'bg-indigo-600 text-white shadow-indigo-200 active:scale-90' : 'bg-slate-100 text-slate-300'
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

const QuickAction = ({ label, icon, onClick }: { label: string, icon: React.ReactNode, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="whitespace-nowrap bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-lg shadow-slate-200/50 active:scale-95 flex items-center space-x-2"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default AIAssistant;
