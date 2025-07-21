import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function EquationVideo() {
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  // Hide video on auth pages
  useEffect(() => {
    const authPaths = ['/auth', '/login', '/signup'];
    setIsVisible(!authPaths.includes(location.pathname));
  }, [location.pathname]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-64 h-36 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg overflow-hidden">
      <div className="relative w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.9)' }}
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          {/* Fallback content */}
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-2 left-2 text-xs text-white font-medium bg-black/50 px-2 py-1 rounded">
          Math Equations
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-xs"
          aria-label="Close video"
        >
          ×
        </button>
      </div>
    </div>
  );
}