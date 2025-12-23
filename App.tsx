
import React, { useState, useEffect } from 'react';
import { Screen } from './types';
import { ICONS } from './constants';
import Home from './screens/Home';
import ReportPollution from './screens/Report';
import AIAssistant from './screens/AI';
import CleanupEvents from './screens/Events';
import Education from './screens/Education';
import Profile from './screens/Profile';
import ProjectInfo from './screens/ProjectInfo';
import FutureWaveSimulator from './screens/ImpactPredictor';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <Home onNavigate={setCurrentScreen} />;
      case 'report': return <ReportPollution onNavigate={setCurrentScreen} />;
      case 'ai': return <AIAssistant onNavigate={setCurrentScreen} />;
      case 'events': return <CleanupEvents onNavigate={setCurrentScreen} />;
      case 'education': return <Education onNavigate={setCurrentScreen} />;
      case 'profile': return <Profile onNavigate={setCurrentScreen} />;
      case 'about': return <ProjectInfo onNavigate={setCurrentScreen} />;
      case 'predictor': return <FutureWaveSimulator onNavigate={setCurrentScreen} />;
      default: return <Home onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#020617] relative shadow-[0_0_100px_rgba(0,0,0,1)] overflow-x-hidden border-x border-white/5">
      {/* Background Ambient Glows */}
      <div className="glow-blob w-64 h-64 bg-cyan-500/10 top-20 -left-20" />
      <div className="glow-blob w-80 h-80 bg-purple-500/10 bottom-40 -right-40" />
      
      <main className="flex-grow relative z-10">
        {renderScreen()}
      </main>

      {/* Futuristic Floating Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[400px] z-50">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex justify-between items-center h-20 px-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <NavItem 
            icon={<ICONS.Home size={20} />} 
            isActive={currentScreen === 'home'} 
            onClick={() => setCurrentScreen('home')} 
          />
          <NavItem 
            icon={<ICONS.Sparkles size={20} />} 
            isActive={currentScreen === 'ai'} 
            onClick={() => setCurrentScreen('ai')} 
          />
          <NavItem 
            icon={<ICONS.Layers size={20} />} 
            isActive={currentScreen === 'predictor'} 
            onClick={() => setCurrentScreen('predictor')} 
          />
          <NavItem 
            icon={<ICONS.Calendar size={20} />} 
            isActive={currentScreen === 'events'} 
            onClick={() => setCurrentScreen('events')} 
          />
          <NavItem 
            icon={<ICONS.User size={20} />} 
            isActive={currentScreen === 'profile'} 
            onClick={() => setCurrentScreen('profile')} 
          />
          <NavItem 
            icon={<ICONS.Info size={20} />} 
            isActive={currentScreen === 'about'} 
            onClick={() => setCurrentScreen('about')} 
          />
        </div>
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`relative flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 ${
      isActive ? 'text-cyan-400 bg-white/5 scale-110' : 'text-slate-500 hover:text-slate-300 active:scale-90'
    }`}
  >
    {isActive && (
      <div className="absolute -bottom-2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
    )}
    {icon}
  </button>
);

export default App;
