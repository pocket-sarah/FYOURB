import React from 'react';
import { ScotiaLogoSVG } from './ScotiaIcons';

interface LoginFlowProps {
  stage: string;
  username: string;
  setUsername: (u: string) => void;
  password: string;
  setPassword: (p: string) => void;
  onContinue: () => void;
  onSignIn: () => void;
  onSwitchAccount: () => void;
  rememberMe?: boolean;
  onToggleRememberMe?: () => void;
  isLoading?: boolean;
}

const LoginFlow: React.FC<LoginFlowProps> = ({ 
  stage, username, setUsername, password, setPassword, 
  onContinue, onSignIn, onSwitchAccount, rememberMe, onToggleRememberMe, isLoading
}) => {
  return (
    <div className="absolute inset-0 bg-black flex flex-col px-10 pt-20 animate-in overflow-hidden">
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
                className="bg-transparent text-white outline-none w-full text-xl font-medium placeholder:text-white/30" 
                autoFocus 
                autoComplete="off"
                data-lpignore="true"
                spellCheck="false"
              />
            </div>
            <div className="flex items-center justify-between mb-8">
                <button onClick={onToggleRememberMe} className="flex items-center gap-3 group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-[#ED0711] border-[#ED0711]' : 'border-white/30 group-hover:border-white/60'}`}>
                        {rememberMe && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                    </div>
                    <span className={`text-sm font-bold transition-colors ${rememberMe ? 'text-white' : 'text-white/60'}`}>Remember me</span>
                </button>
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
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="absolute -right-4 -bottom-6 text-white/5 rotate-[-15deg]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span className="truncate pr-4 font-mono tracking-tight">{username}</span>
            </div>
            
            <div className="border-b border-[#ED0711] pb-4 mb-12 flex items-center gap-4">
              <input 
                type="password" 
                value={rememberMe && !password ? "••••••••" : password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Password" 
                className="bg-transparent text-white outline-none w-full text-xl font-medium placeholder:text-white/30" 
                autoFocus={!rememberMe}
                autoComplete="new-password"
                data-lpignore="true"
              />
            </div>
            
            <div className="space-y-4">
                <button 
                    onClick={onSignIn} 
                    disabled={isLoading}
                    className="w-full py-5 bg-[#ED0711] text-white font-black rounded-[20px] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-80"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Verifying...</span>
                        </>
                    ) : (
                        "Sign in"
                    )}
                </button>
                <button 
                    onClick={onSwitchAccount} 
                    className="w-full py-4 text-[#ED0711] font-bold text-sm border border-[#ED0711] rounded-[20px] active:bg-[#ED0711]/10 transition-colors"
                >
                    Sign in to another account
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginFlow;