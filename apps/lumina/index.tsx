import React, { useState } from 'react';
import { ToolMode, BankApp } from '../../types';
import AppLayout from '../shared/layouts/AppLayout';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import TextGenerator from '../../components/TextGenerator';
import ImageGenerator from '../../components/ImageGenerator';
import VideoGenerator from './VideoGenerator';

interface LuminaAppProps {
  app: BankApp;
  onClose: () => void;
  onNotify: (title: string, message: string, icon: string) => void;
}

const LuminaApp: React.FC<LuminaAppProps> = ({ app, onClose, onNotify }) => {
  const [activeMode, setActiveMode] = useState<ToolMode>(ToolMode.TEXT);

  return (
    <AppLayout brandColor="#4f46e5" onClose={onClose} title="Lumina Neural Studio">
      <div className="flex h-full bg-slate-950">
        <Sidebar activeMode={activeMode} onSelectMode={setActiveMode} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header activeMode={activeMode} />
          <main className="flex-1 relative overflow-hidden">
            {activeMode === ToolMode.TEXT && <TextGenerator />}
            {activeMode === ToolMode.IMAGE && <ImageGenerator />}
            {activeMode === ToolMode.VIDEO && <VideoGenerator onNotify={onNotify} />}
          </main>
        </div>
      </div>
    </AppLayout>
  );
};

export default LuminaApp;