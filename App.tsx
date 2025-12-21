
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
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 relative shadow-2xl overflow-x-hidden">
      <main className="flex-grow mb-20">
        {renderScreen()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 safe-bottom z-50">
        <div className="flex justify-between items-center h-16 px-1">
          <NavItem 
            icon={<ICONS.Home size={16} />} 
            label="Home" 
            isActive={currentScreen === 'home'} 
            onClick={() => setCurrentScreen('home')} 
          />
          <NavItem 
            icon={<ICONS.Sparkles size={16} />} 
            label="AI Chat" 
            isActive={currentScreen === 'ai'} 
            onClick={() => setCurrentScreen('ai')} 
          />
          <NavItem 
            icon={<ICONS.Layers size={16} />} 
            label="Simulate" 
            isActive={currentScreen === 'predictor'} 
            onClick={() => setCurrentScreen('predictor')} 
          />
          <NavItem 
            icon={<ICONS.Calendar size={16} />} 
            label="Events" 
            isActive={currentScreen === 'events'} 
            onClick={() => setCurrentScreen('events')} 
          />
          <NavItem 
            icon={<ICONS.User size={16} />} 
            label="Profile" 
            isActive={currentScreen === 'profile'} 
            onClick={() => setCurrentScreen('profile')} 
          />
          <NavItem 
            icon={<ICONS.Info size={16} />} 
            label="About" 
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
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 w-full transition-all ${
      isActive ? 'text-cyan-600 scale-110' : 'text-slate-400 opacity-80'
    }`}
  >
    <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-cyan-50' : ''}`}>
      {icon}
    </div>
    <span className="text-[8px] font-black uppercase tracking-tighter whitespace-nowrap">{label}</span>
  </button>
);

export default App;
