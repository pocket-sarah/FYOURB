
import React, { useState } from 'react';
import { TDShieldSVG } from './TDIcons';

interface LoginFlowProps {
  onSignIn: () => void;
}

const LoginFlow: React.FC<LoginFlowProps> = ({ onSignIn }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  return (
    <div className="absolute inset-0 bg-[#f4f4f4] flex flex-col animate-in fade-in">
      <div className="bg-[#008A00] h-64 w-full relative flex flex-col items-center justify-center">
         <TDShieldSVG size={60} color="white" className="mb-4" />
         <h1 className="text-white text-2xl font-bold">EasyWeb</h1>
         <div className="absolute -bottom-10 w-[90%] bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4">
            <div className="border-b border-gray-300 pb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase">Username or Access Card</label>
                <input 
                    type="text" 
                    value={user} 
                    onChange={e => setUser(e.target.value)} 
                    className="w-full text-lg font-bold text-gray-800 outline-none mt-1"
                    placeholder="Enter username"
                />
            </div>
            <div className="border-b border-gray-300 pb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase">Password</label>
                <input 
                    type="password" 
                    value={pass} 
                    onChange={e => setPass(e.target.value)} 
                    className="w-full text-lg font-bold text-gray-800 outline-none mt-1"
                    placeholder="Enter password"
                />
            </div>
            <div className="flex justify-between items-center mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" className="rounded text-[#008A00]" />
                    Remember me
                </label>
                <span className="text-[#008A00] text-sm font-bold">Forgot?</span>
            </div>
         </div>
      </div>

      <div className="mt-20 px-6 flex flex-col gap-4">
         <button 
            onClick={onSignIn}
            className="w-full bg-[#008A00] text-white py-3.5 rounded-md font-bold text-lg shadow-md active:bg-[#006e00] transition-colors"
         >
            Login
         </button>
         <div className="text-center text-gray-500 text-sm mt-4">
            <p>Don't have an account? <span className="text-[#008A00] font-bold">Register now</span></p>
         </div>
      </div>
      
      <div className="mt-auto pb-8 text-center">
         <p className="text-xs text-gray-400 font-bold">TD Canada Trust Security Guarantee</p>
      </div>
    </div>
  );
};

export default LoginFlow;
