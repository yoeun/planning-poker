import { useState, useEffect, useRef } from 'react';
import ResetIcon from '../icons/ResetIcon';
import ShareIcon from '../icons/ShareIcon';
import ThreeDots from '../icons/ThreeDots';
import PlusIcon from '../icons/PlusIcon';
import TrashIcon from '../icons/TrashIcon';

interface SessionHeaderProps {
  sessionId: string;
  onReset: () => void;
  onShare: () => void;
  onNewSession: (e: React.MouseEvent<HTMLElement>) => void;
  onEndSession: () => void;
}

export default function SessionHeader({
  sessionId,
  onReset,
  onShare,
  onNewSession,
  onEndSession,
}: SessionHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Planning Poker</h1>
          <p className="text-gray-600 text-sm">
            Session ID: <span className="font-mono font-semibold">{sessionId}</span>
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={onReset}
            className="hidden md:flex px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition items-center gap-2"
          >
            <ResetIcon className="w-5 h-5" />
            Reset
          </button>
          <button
            onClick={onShare}
            className="hidden md:flex px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg shadow-sm transition items-center gap-2"
            title="Share session"
          >
            <ShareIcon className="w-5 h-5" style={{ transform: 'rotate(-45deg)' }} />
            Share
          </button>
          <button
            onClick={onShare}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg shadow-sm transition flex items-center justify-center md:hidden"
            title="Share session"
          >
            <ShareIcon className="w-5 h-5" style={{ transform: 'rotate(-45deg)' }} />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg shadow-sm transition flex items-center justify-center"
              title="More options"
            >
              <ThreeDots className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    onReset();
                    setShowMenu(false);
                  }}
                  className="md:hidden w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-100 transition text-left"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Reset
                </button>
                <a
                  href="/"
                  onClick={(e) => {
                    onNewSession(e);
                    setShowMenu(false);
                  }}
                  onAuxClick={(e) => {
                    // Handle middle-click (button 1) - let it open in new tab
                    if (e.button === 1) {
                      // Don't prevent default, let the browser handle it
                      return;
                    }
                    setShowMenu(false);
                  }}
                  className="px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  <PlusIcon className="w-5 h-5" />
                  New Session
                </a>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => {
                    onEndSession();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-100 transition text-left"
                >
                  <TrashIcon className="w-5 h-5" />
                  End Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

