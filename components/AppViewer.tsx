
import React from 'react';
import { BankApp } from '../types';
import ScotiaApp from '../apps/scotia/index';
import TDApp from '../apps/td/index';
import StoreApp from '../apps/store/index';
import MessengerApp from '../apps/messenger/index';
import SettingsApp from '../apps/settings/index';
import GenericApp from '../apps/generic/index';
import BrowserApp from '../apps/browser/index';
import NotesApp from '../apps/notes/index';
import ContactsApp from '../apps/contacts/index';
import PHPAdminApp from '../apps/phpadmin/index';
import LuminaApp from '../apps/lumina/index';
import ResearchHub from '../apps/research/index';
import DominionApp from '../apps/dominion/index';
import HarvesterApp from '../apps/harvester/index';
import ComponentRunner from './ComponentRunner';

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
    case 'harvester':
      Component = <HarvesterApp app={app} onClose={onClose} onNotify={onNotify} />;
      break;
    case 'dominion':
      Component = <DominionApp app={app} onClose={onClose} onNotify={onNotify} />;
      break;
    case 'research':
      Component = <ResearchHub app={app} onClose={onClose} onNotify={onNotify} />;
      break;
    case 'scotia':
      Component = <ScotiaApp app={app} onClose={onClose} onNotify={onNotify} initialParams={initialParams} />;
      break;
    case 'td':
      Component = <TDApp app={app} onClose={onClose} onNotify={onNotify} initialParams={initialParams} />;
      break;
    case 'store':
      Component = <StoreApp app={app} appsList={appsList} onClose={onClose} onNotify={onNotify} onInstall={onInstall} onUninstall={onUninstall} />;
      break;
    case 'lumina':
      Component = <LuminaApp app={app} onClose={onClose} onNotify={onNotify} />;
      break;
    case 'messenger':
      Component = <MessengerApp app={app} onClose={onClose} onNotify={onNotify} />;
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
    case 'phpadmin':
      Component = <PHPAdminApp app={app} onClose={onClose} onNotify={onNotify} />;
      break;
    case 'rbc':
    case 'bmo':
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
