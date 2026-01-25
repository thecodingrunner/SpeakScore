import { Heart, MessageCircle, User, X } from "lucide-react";
import { useEffect, useRef } from "react";

const HingeProfileMockupAfter = () => {
    const scrollContainerRef = useRef(null);
  
    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
  
      let scrollInterval;
      let pauseTimeout;

      const startAutoScroll = () => {
        scrollInterval = setInterval(() => {
          if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
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
  
      const initialDelay = setTimeout(startAutoScroll, 1000);
  
      return () => {
        clearTimeout(initialDelay);
        clearInterval(scrollInterval);
        clearTimeout(pauseTimeout);
      };
    }, []);
  
    return (
      <div className="mockup-phone border-2 border-green-400">
        <div className="camera"></div>
        <div className="display">
          <div className="artboard artboard-demo phone-1 bg-white relative overflow-hidden">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Sarah, 28</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-1 w-12 bg-green-400 rounded-full"></div>
                  <div className="h-1 w-12 bg-green-400 rounded-full"></div>
                  <div className="h-1 w-12 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
  
            {/* Scrollable Content */}
            <div 
              ref={scrollContainerRef}
              className="h-full overflow-y-scroll scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none' }}
            >
              {/* Main Photo - Optimized */}
              <div className="relative w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <div className="text-green-600 text-xs font-semibold">⭐ Best Photo</div>
              </div>
  
              {/* About Me - Optimized */}
              <div className="bg-white p-6">
                <div className="mb-2">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    About Me
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Weekend warrior who's equally comfortable at a jazz concert or hiking trail. 
                  Coffee snob by day, amateur chef by night. Looking for someone to join my 
                  quest for the city's best tacos 🌮
                </p>
              </div>
  
              {/* Photo 2 - Full Body */}
              <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                <div className="text-green-600 text-xs">Full Body Shot</div>
              </div>
  
              {/* First Prompt - More Engaging */}
              <div className="bg-white p-6">
                <div className="mb-2">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    My simple pleasures
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Finding a new coffee shop that makes the perfect cappuccino, 
                  then spending Sunday morning there with a good book
                </p>
              </div>
  
              {/* Photo 3 - Activity */}
              <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-green-300 to-green-400 flex items-center justify-center">
                <div className="text-green-600 text-xs">Activity Photo</div>
              </div>
  
              {/* Second Prompt - Conversation Starter */}
              <div className="bg-white p-6">
                <div className="mb-2">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Let's debate this topic
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Is a hot dog a sandwich? I have strong opinions and I'm not afraid to share them 😄
                </p>
              </div>
  
              {/* Photo 4 - Personality */}
              <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <div className="text-green-600 text-xs">Genuine Smile</div>
              </div>
  
              {/* Vitals Section */}
              <div className="bg-white p-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-gray-500 mb-1">Location</div>
                    <div className="text-gray-800 font-medium">Brooklyn</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Height</div>
                    <div className="text-gray-800 font-medium">5'6"</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Education</div>
                    <div className="text-gray-800 font-medium">NYU</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Work</div>
                    <div className="text-gray-800 font-medium">Marketing</div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-white via-white to-transparent p-4 pt-8">
              <div className="flex items-center justify-around">
                <button className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <X className="w-7 h-7 text-red-500" />
                </button>
                <button className="w-16 h-16 rounded-full bg-blue-500 shadow-lg flex items-center justify-center animate-pulse">
                  <Heart className="w-8 h-8 text-white fill-white" />
                </button>
                <button className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-blue-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default HingeProfileMockupAfter;