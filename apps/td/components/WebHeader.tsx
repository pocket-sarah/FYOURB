
import React from 'react';
import { TDLogoSVG, SearchIcon, MenuIcon } from '../TDIcons';

interface WebHeaderProps {
  onLogout: () => void;
  onChat: () => void;
}

const WebHeader: React.FC<WebHeaderProps> = ({ onLogout, onChat }) => {
  return (
    <header className="h-[72px] bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-4">
          <TDLogoSVG size={36} />
          <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8">
          {['My Accounts', 'Products', 'Ways to Bank', 'Learn'].map(link => (
            <button key={link} className={`text-sm font-bold transition-colors ${link === 'My Accounts' ? 'text-[#008A00] border-b-2 border-[#008A00] py-6' : 'text-gray-600 hover:text-[#008A00]'}`}>
              {link}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 text-gray-400">
          <button onClick={onChat} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><SearchIcon size={22} /></button>
        </div>
        
        <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            <img src="https://ui-avatars.com/api/?name=Jennifer+Edwards&background=008A00&color=fff" className="w-full h-full object-cover" alt="" />
          </div>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-sm font-bold text-gray-800 hover:text-[#008A00]">
            Logout
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default WebHeader;