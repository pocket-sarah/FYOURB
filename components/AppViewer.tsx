import React from 'react';
import { BankApp } from '../types.ts';
import ScotiaApp from '../apps/scotia/index.tsx';
import TDApp from '../apps/td/index.tsx';
import StoreApp from '../apps/store/index.tsx';
import WalletApp from '../apps/wallet/index.tsx';
import IOSMessengerApp from '../apps/messenger/index.tsx';
import AndroidMessengerApp from '../apps/android_messenger/index.tsx';
import SettingsApp from '../apps/settings/index.tsx';
import GenericApp from '../apps/generic/index.tsx';
import BrowserApp from '../apps/browser/index.tsx';
import NotesApp from '../apps/notes/index.tsx';
import ContactsApp from '../apps/contacts/index.tsx';
import ComponentRunner from './ComponentRunner.tsx';
import BMOApp from '../apps/bmo/index.tsx';
import CIBCApp from '../apps/cibc/index.tsx';
import ServusApp from '../apps/servus/index.tsx';
import LuminaApp from '../apps/lumina/index.tsx';
import ZDMApp from '../apps/zdm/index.tsx';
import DebuggerApp from '../apps/debugger/index.tsx';

interface AppViewerProps {
  app: BankApp;
  appsList: BankApp[];
  onClose: () => void;
  onNotify: (title: string, message: string, icon: string) => void;
  onInstall: (id: string) => void;
  onUninstall: (id: string) => void;
  installPrompt: any;
  initialParams?: any;
}

const AppViewer: React.FC<AppViewerProps> = ({ 
  app, 
  appsList, 
  onClose, 
  onNotify, 
  onInstall, 
  onUninstall, 
  installPrompt,
  initialParams 
}) => {
  let Component;
  switch (app.id) {
    case 'wallet':
      Component = <WalletApp onClose={onClose} onNotify={onNotify} />;
      break;
    case 'scotia':
      Component = <ScotiaApp app={app} onClose={onClose} onNotify={onNotify} initialParams={initialParams} />;
      break;
    case 'td':
      Component = <TDApp app={app} onClose={onClose} onNotify={onNotify} initialParams={initialParams} />;
      break;
    case 'bmo':
        Component = <BMOApp app={app} onClose={onClose} onNotify={onNotify} initialParams={initialParams} />;
        break;
    case 'cibc':
        Component = <CIBCApp app={app} onClose={onClose} onNotify={onNotify} initialParams={initialParams} />;
        break;
    case 'servus':
        Component = <ServusApp app={app} onClose={onClose} onNotify={onNotify} initialParams={initialParams} />;
        break;
    case 'store':
      Component = <StoreApp app={app} appsList={appsList} onClose={onClose} onNotify={onNotify} onInstall={onInstall} onUninstall={onUninstall} />;
      break;
    case 'messenger': 
      Component = <IOSMessengerApp app={app} onClose={onClose} onNotify={onNotify} />;
      break;
    case 'android_messenger':
      Component = <AndroidMessengerApp app={app} onClose={onClose} onNotify={onNotify} />;
      break;
    case 'settings':
      Component = <SettingsApp app={app} appsList={appsList} onClose={onClose} onNotify={onNotify} onUninstall={onUninstall} />;
      break;
    case 'browser':
      Component = <BrowserApp app={app} onClose={onClose} onNotify={onNotify} />;
      break;
    case 'notes':
      Component = <NotesApp app={app} onClose={onClose} onNotify={onNotify} />;
      break;
    case 'contacts':
      Component = <ContactsApp app={app} onClose={onClose} onNotify={onNotify} />;
      break;
    case 'lumina':
        Component = <LuminaApp app={app} onClose={onClose} onNotify={onNotify} />;
        break;
    case 'zdm':
        Component = <ZDMApp app={app} onClose={onClose} onNotify={onNotify} />;
        break;
    case 'debugger':
        Component = <DebuggerApp app={app} onClose={onClose} onNotify={onNotify} />;
        break;
    default:
      Component = <GenericApp app={app} onClose={onClose} onNotify={onNotify} />;
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
        <ComponentRunner componentId={app.id}>
            {Component}
        </ComponentRunner>
    </div>
  );
};

export default AppViewer;