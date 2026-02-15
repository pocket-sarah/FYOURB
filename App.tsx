
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, BankApp } from './types.ts';
import { INITIAL_APPS } from './data/initialApps.ts';
import LockScreen from './components/LockScreen.tsx';
import HomeScreen from './components/HomeScreen.tsx';
import AppDrawer from './components/AppDrawer.tsx';
import AppViewer from './components/AppViewer.tsx';
import SystemNotification from './components/SystemNotification.tsx';
import SearchOverlay from './components/SearchOverlay.tsx';
import GlobalNavigation from './components/GlobalNavigation.tsx';
import { getSystemConfig, SystemConfig } from './data/systemConfig.ts';
import { Shield, Key, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [apps, setApps] = useState<BankApp[]>(INITIAL_APPS);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(getSystemConfig());
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [state, setState] = useState<AppState>({
    isLocked: true,
    currentView: 'home',
    activeAppId: null,
    isEditMode: false,
    isSwitcherOpen: false,
  });
  const [appParams, setAppParams] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notification, setNotification] = useState<{ title: string; message: string; icon: string } | null>(null);
  
  const [osMode, setOsMode] = useState<'ios' | 'android'>('ios'); 

  const checkApiKey = useCallback(async () => {
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
    } else {
      setHasApiKey(true);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
    const handleKeyInvalid = () => {
        console.warn("RBOS Alert: API Key reset triggered by system fault.");
        setHasApiKey(false);
    };
    window.addEventListener('gemini_key_invalid', handleKeyInvalid);
    return () => window.removeEventListener('gemini_key_invalid', handleKeyInvalid);
  }, [checkApiKey]);

  useEffect(() => {
    const handleConfigUpdate = (e: any) => {
      setSystemConfig(e.detail);
    };
    window.addEventListener('system_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('system_config_updated', handleConfigUpdate);
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const activeApps = apps.filter(a => a.isInstalled && !a.isDocked).sort((a, b) => a.order - b.order);
  const dockApps = apps.filter(a => a.isInstalled && a.isDocked).sort((a, b) => a.order - b.order);

  const handleOpenApp = (id: string, params?: any) => {
    setAppParams(params || null);
    setState(prev => ({ 
      ...prev, 
      currentView: 'app', 
      activeAppId: id, 
      isEditMode: false, 
      isSwitcherOpen: false 
    }));
    setIsSearchOpen(false);
  };

  const handleCloseApp = () => {
    setState(prev => ({ ...prev, currentView: 'home', activeAppId: null, isSwitcherOpen: false }));
    setAppParams(null);
  };

  const notify = (title: string, message: string, icon: string) => {
    setNotification({ title, message, icon });
  };

  const handleUnlock = (mode: 'god' | 'standard' | 'user') => {
    if (mode === 'god') {
      notify("System Override", "WORM-AI💀🔥 Core Active", "https://cdn-icons-png.flaticon.com/512/3953/3953226.png");
    }
    setState(prev => ({ ...prev, isLocked: false }));
  };

  if (hasApiKey === false) {
    return (
      <div className="h-screen w-full bg-[#020617] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-[40px] p-10 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
           <div className="w-20 h-20 bg-indigo-600/20 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/30">
              <Key size={40} className="text-indigo-400" />
           </div>
           <div className="space-y-3">
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Handshake Required</h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                WORM-AI💀🔥 requires a high-fidelity key to bypass rate limits. Please select a <strong>paid</strong> API key to continue.
              </p>
           </div>
           <div className="space-y-4">
              <button 
                onClick={handleSelectKey}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-xs"
              >
                Sync Neural Key
              </button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors text-xs font-bold uppercase tracking-widest"
              >
                <ExternalLink size={14} />
                Billing Docs
              </a>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen w-full relative flex flex-col overflow-hidden bg-black text-white font-sans"
      style={{
        backgroundImage: `url(${systemConfig.display_options.wallpaper_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {state.isLocked ? (
        <LockScreen onUnlock={handleUnlock} />
      ) : (
        <>
          <div className="flex-1 relative overflow-hidden z-[10]">
            {state.currentView === 'home' && (
              <HomeScreen 
                apps={activeApps}
                dockApps={dockApps}
                onOpenApp={handleOpenApp}
                onOpenDrawer={() => setState(prev => ({ ...prev, currentView: 'drawer' }))}
                isEditMode={state.isEditMode}
                onToggleEdit={() => setState(prev => ({ ...prev, isEditMode: !prev.isEditMode }))}
                onUninstall={(id) => setApps(prev => prev.map(a => a.id === id ? { ...a, isInstalled: false } : a))}
                onMove={() => {}}
                onSwipeDown={() => setIsSearchOpen(true)}
              />
            )}

            {state.currentView === 'drawer' && (
              <AppDrawer 
                apps={apps}
                searchQuery=""
                setSearchQuery={() => {}}
                onOpenApp={handleOpenApp}
                onClose={() => setState(prev => ({ ...prev, currentView: 'home' }))}
              />
            )}

            {state.currentView === 'app' && state.activeAppId && (
              <div className="absolute inset-0 bg-black animate-in zoom-in-95 duration-300">
                 <AppViewer 
                    app={apps.find(a => a.id === state.activeAppId)!}
                    appsList={apps}
                    onClose={handleCloseApp}
                    onNotify={notify}
                    onInstall={(id) => setApps(prev => prev.map(a => a.id === id ? { ...a, isInstalled: true } : a))}
                    onUninstall={(id) => setApps(prev => prev.map(a => a.id === id ? { ...a, isInstalled: false } : a))}
                    installPrompt={null}
                    initialParams={appParams}
                  />
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-[100]" onClick={handleCloseApp}></div>
              </div>
            )}
          </div>

          <SearchOverlay 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)} 
            apps={apps} 
            onOpenApp={handleOpenApp} 
          />

          <GlobalNavigation 
            isOpen={state.isSwitcherOpen}
            apps={apps.filter(a => a.isInstalled)}
            onOpenApp={handleOpenApp}
            onClose={() => setState(prev => ({ ...prev, isSwitcherOpen: false }))}
            onTriggerSwitcher={() => setState(prev => ({ ...prev, isSwitcherOpen: true }))}
            onHome={handleCloseApp}
            activeAppId={state.activeAppId}
          />

          {notification && (
            <SystemNotification 
              title={notification.title}
              message={notification.message}
              icon={notification.icon}
              onClose={() => setNotification(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
