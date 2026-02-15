import React, { useState, useRef, useEffect } from 'react';
import { BankApp } from '../types';
import { motion, Reorder } from 'framer-motion';

interface HomeScreenProps {
  apps: BankApp[];
  dockApps: BankApp[];
  onOpenApp: (id: string) => void;
}

const APPS_PER_PAGE = 20;

const HomeScreen: React.FC<HomeScreenProps> = ({
  apps,
  dockApps,
  onOpenApp
}) => {
  const [pages, setPages] = useState<BankApp[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<any>(null);

  // Split apps into pages
  useEffect(() => {
    const split = [];
    for (let i = 0; i < apps.length; i += APPS_PER_PAGE) {
      split.push(apps.slice(i, i + APPS_PER_PAGE));
    }
    setPages(split);
  }, [apps]);

  // Swipe paging
  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;

    const handleMove = (moveEvent: TouchEvent) => {
      const diff = moveEvent.touches[0].clientX - startX;

      if (diff > 100 && currentPage > 0) {
        setCurrentPage(p => p - 1);
        window.removeEventListener('touchmove', handleMove);
      }

      if (diff < -100 && currentPage < pages.length - 1) {
        setCurrentPage(p => p + 1);
        window.removeEventListener('touchmove', handleMove);
      }
    };

    window.addEventListener('touchmove', handleMove, { once: true });
  };

  // Long press = edit mode
  const handleHoldStart = () => {
    holdTimer.current = setTimeout(() => {
      setIsEditMode(true);
      if (navigator.vibrate) navigator.vibrate(30);
    }, 500);
  };

  const cancelHold = () => {
    clearTimeout(holdTimer.current);
  };

  const updatePageOrder = (pageIndex: number, newOrder: BankApp[]) => {
    const newPages = [...pages];
    newPages[pageIndex] = newOrder;
    setPages(newPages);
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-black">

      {/* Pages Container */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        className="flex h-full transition-transform duration-300 ease-out"
        style={{
          width: `${pages.length * 100}%`,
          transform: `translateX(-${currentPage * (100 / pages.length)}%)`
        }}
      >
        {pages.map((pageApps, pageIndex) => (
          <div
            key={pageIndex}
            className="w-full px-6 pt-14 grid grid-cols-4 gap-y-10 gap-x-6"
          >
            <Reorder.Group
              axis="y"
              values={pageApps}
              onReorder={(newOrder) =>
                updatePageOrder(pageIndex, newOrder)
              }
              className="contents"
            >
              {pageApps.map(app => (
                <Reorder.Item
                  key={app.id}
                  value={app}
                  whileDrag={{ scale: 1.1 }}
                  className={`flex flex-col items-center ${
                    isEditMode ? 'animate-[wiggle_0.4s_infinite]' : ''
                  }`}
                  onTouchStart={handleHoldStart}
                  onTouchEnd={cancelHold}
                  onClick={() => !isEditMode && onOpenApp(app.id)}
                >
                  <div className="w-[64px] h-[64px] rounded-[22%] overflow-hidden shadow-lg">
                    <img
                      src={app.icon}
                      alt={app.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] text-white mt-2 truncate w-20 text-center">
                    {app.name}
                  </span>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        ))}
      </div>

      {/* Dock */}
      <div className="absolute bottom-12 left-6 right-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl py-3 px-8 flex justify-between shadow-xl">
          {dockApps.map(app => (
            <motion.button
              key={app.id}
              whileTap={{ scale: 0.85 }}
              onClick={() => onOpenApp(app.id)}
              className="w-[58px] h-[58px]"
            >
              <img
                src={app.icon}
                alt={app.name}
                className="w-full h-full rounded-[22%]"
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Page Indicators */}
      <div className="absolute bottom-6 w-full flex justify-center gap-2">
        {pages.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === currentPage
                ? 'w-6 bg-white'
                : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* iPhone Floating Nav Line */}
      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1.5 rounded-full bg-white/70 backdrop-blur-sm"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default HomeScreen;