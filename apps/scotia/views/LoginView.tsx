import React from 'react';
import { ScotiaLogoSVG } from '../ScotiaIcons';

interface LoginViewProps {
  stage: string;
  username: string;
  setUsername: (u: string) => void;
  password: string;
  setPassword: (p: string) => void;
  onContinue: () => void;
  onSignIn: () => void;
  onSwitchAccount: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ 
  stage, username, setUsername, password, setPassword, 
  onContinue, onSignIn, onSwitchAccount 
}) => {
  return (
    <div className="absolute inset-0 bg-black flex flex-col px-10 pt-20 animate-in overflow-hidden z-[50]">
      <div className="w-16 h-16 rounded-[22%] overflow-hidden shadow-2xl mb-16 border border-white/10 flex items-center justify-center bg-[#ED0711]/10">
        <ScotiaLogoSVG color="#ED0711" className="w-10 h-10" />
      </div>
      
      <h1 className="text-white text-4xl font-black mb-12 tracking-tighter">Sign in</h1>
      
      <div className="mt-auto pb-16 space-y-10">
        {stage === 'login_user' ? (
          <div className="animate-in fade-in">
            <div className="border-b border-white/20 pb-4 mb-10 flex items-center gap-4 transition-all focus-within:border-[#ED0711]">
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                placeholder="Username or card number" 
                className="bg-transparent text-white outline-none w-full text-xl font-medium" 
                autoFocus 
              />
            </div>
            <button 
                onClick={onContinue} 
                className={`w-full py-5 rounded-[20px] font-black text-lg transition-all ${username ? 'bg-[#ED0711] text-white shadow-xl' : 'bg-zinc-900 text-white/10'}`}
            >
                Continue
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in">
            <div className="flex justify-between items-center mb-10 text-white/60 text-lg font-bold bg-zinc-900/50 p-5 rounded-[24px] border border-white/5 relative overflow-hidden">
              <span className="truncate pr-4 font-mono tracking-tight">{username}</span>
            </div>
            
            <div className="border-b border-[#ED0711] pb-4 mb-12 flex items-center gap-4">
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Password" 
                className="bg-transparent text-white outline-none w-full text-xl font-medium" 
                autoFocus 
              />
            </div>
            
            <div className="space-y-4">
                <button onClick={onSignIn} className="w-full py-5 bg-[#ED0711] text-white font-black rounded-[20px] shadow-2xl active:scale-[0.98] transition-all">Sign in</button>
                <button onClick={onSwitchAccount} className="w-full py-4 text-[#ED0711] font-bold text-sm border border-[#ED0711] rounded-[20px] active:bg-[#ED0711]/10 transition-colors">Sign in to another account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginView;