
import React, { useState, useEffect } from 'react';
import { Screen } from './types';
import { COLORS, ICONS } from './constants';
import Home from './screens/Home';
import ReportPollution from './screens/Report';
import AIAssistant from './screens/AI';
import CleanupEvents from './screens/Events';
import Education from './screens/Education';
import Profile from './screens/Profile';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // Ensure scroll reset on screen change
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
      default: return <Home onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 relative shadow-2xl overflow-x-hidden">
      {/* Dynamic Content Area */}
      <main className="flex-grow mb-20">
        {renderScreen()}
      </main>

      {/* Persistent Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 safe-bottom z-50">
        <div className="flex justify-around items-center h-16 px-4">
          <NavItem 
            icon={<ICONS.Home size={20} />} 
            label="Home" 
            isActive={currentScreen === 'home'} 
            onClick={() => setCurrentScreen('home')} 
          />
          <NavItem 
            icon={<ICONS.FileText size={20} />} 
            label="Report" 
            isActive={currentScreen === 'report'} 
            onClick={() => setCurrentScreen('report')} 
          />
          <NavItem 
            icon={<ICONS.Sparkles size={20} />} 
            label="AI" 
            isActive={currentScreen === 'ai'} 
            onClick={() => setCurrentScreen('ai')} 
          />
          <NavItem 
            icon={<ICONS.Calendar size={20} />} 
            label="Events" 
            isActive={currentScreen === 'events'} 
            onClick={() => setCurrentScreen('events')} 
          />
          <NavItem 
            icon={<ICONS.BookOpen size={20} />} 
            label="Learn" 
            isActive={currentScreen === 'education'} 
            onClick={() => setCurrentScreen('education')} 
          />
          <NavItem 
            icon={<ICONS.User size={20} />} 
            label="Profile" 
            isActive={currentScreen === 'profile'} 
            onClick={() => setCurrentScreen('profile')} 
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
    className={`flex flex-col items-center justify-center space-y-1 w-full transition-colors ${
      isActive ? 'text-cyan-600' : 'text-slate-400'
    }`}
  >
    <div className={`p-1 rounded-lg ${isActive ? 'bg-cyan-50' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
