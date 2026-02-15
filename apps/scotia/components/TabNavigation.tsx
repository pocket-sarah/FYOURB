import React from 'react';
import { HomeIcon, MoveIcon, AdviceIcon, SceneIcon, MoreIcon } from '../ScotiaIcons';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const tabs = [
  { id: 'home', l: 'Home', Comp: HomeIcon },
  { id: 'transfers', l: 'Move money', Comp: MoveIcon },
  { id: 'advice', l: 'Advice+', Comp: AdviceIcon },
  { id: 'scene', l: 'Scene+', Comp: SceneIcon },
  { id: 'more', l: 'More', Comp: MoreIcon }
];

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => (
  <div className="bg-black border-t border-white/10 h-[84px] flex items-center justify-around pb-8 z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] shrink-0">
    {tabs.map(t => {
      const isActive = activeTab === t.id;
      return (
        <button 
          key={t.id} 
          onClick={() => onTabChange(t.id)} 
          className={`flex flex-col items-center flex-1 pt-3 pb-1 transition-all relative outline-none h-full ${isActive ? 'text-[#ED0711]' : 'text-zinc-600 active:text-zinc-400'}`}
        >
          <div className="flex flex-col items-center justify-center flex-1">
            <t.Comp 
              color="currentColor" 
              size={24} 
              className={`transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(237,7,17,0.3)]' : 'opacity-80'}`} 
            />
            <span className={`text-[9px] mt-1.5 font-bold whitespace-nowrap tracking-tight transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {t.l}
            </span>
          </div>
        </button>
      );
    })}
  </div>
);

export default TabNavigation;