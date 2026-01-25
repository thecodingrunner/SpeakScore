'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, X, MessageCircle, User } from 'lucide-react';

const HingeProfileMockup = () => {
  const scrollContainerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollInterval;
    let pauseTimeout;

    const startAutoScroll = () => {
      setIsScrolling(true);
      
      scrollInterval = setInterval(() => {
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
          // Reached bottom, pause then reset
          clearInterval(scrollInterval);
          pauseTimeout = setTimeout(() => {
            container.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(startAutoScroll, 1000);
          }, 2000);
        } else {
          container.scrollBy({ top: 2, behavior: 'auto' });
        }
      }, 30);
    };

    // Start after a brief delay
    const initialDelay = setTimeout(startAutoScroll, 1000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(scrollInterval);
      clearTimeout(pauseTimeout);
    };
  }, []);

  return (
    <div className="mockup-phone">
      <div className="camera"></div>
      <div className="display">
        <div className="artboard artboard-demo phone-1 bg-white relative overflow-hidden">
          {/* Hinge-style Top Bar */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Sarah, 28</span>
              </div>
              <div className="flex gap-1">
                <div className="h-1 w-12 bg-white/40 rounded-full"></div>
                <div className="h-1 w-12 bg-white/40 rounded-full"></div>
                <div className="h-1 w-12 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div 
            ref={scrollContainerRef}
            className="h-full overflow-y-scroll scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* Photo 1 */}
            <div className="relative w-full aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-gray-400 text-xs">Main Photo</div>
            </div>

            {/* About Me Prompt */}
            <div className="bg-white p-6">
              <div className="mb-2">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  About Me
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed italic">
                "Hey. I like music and hanging out. Swipe right if you want to chat."
              </p>
            </div>

            {/* Photo 2 */}
            <div className="relative w-full aspect-square bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <div className="text-gray-400 text-xs">Photo 2</div>
            </div>

            {/* First Prompt */}
            <div className="bg-white p-6">
              <div className="mb-2">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  My simple pleasures
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Coffee on a Sunday morning
              </p>
            </div>

            {/* Photo 3 */}
            <div className="relative w-full aspect-square bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
              <div className="text-gray-400 text-xs">Photo 3</div>
            </div>

            {/* Second Prompt */}
            <div className="bg-white p-6">
              <div className="mb-2">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  I'm looking for
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Someone who doesn't take life too seriously
              </p>
            </div>

            {/* Photo 4 */}
            <div className="relative w-full aspect-square bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
              <div className="text-gray-400 text-xs">Photo 4</div>
            </div>

            {/* Vitals Section */}
            <div className="bg-white p-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-gray-500 mb-1">Location</div>
                  <div className="text-gray-800 font-medium">New York</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Height</div>
                  <div className="text-gray-800 font-medium">5'6"</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Education</div>
                  <div className="text-gray-800 font-medium">College</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Politics</div>
                  <div className="text-gray-800 font-medium">Liberal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hinge-style Bottom Actions */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-white via-white to-transparent p-4 pt-8">
            <div className="flex items-center justify-around">
              <button className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <X className="w-7 h-7 text-red-500" />
              </button>
              <button className="w-16 h-16 rounded-full bg-blue-500 shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white fill-white" />
              </button>
              <button className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-blue-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HingeProfileMockup;