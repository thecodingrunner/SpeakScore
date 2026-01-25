"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggleWidget = () => {
    const [theme, setTheme] = useState('lofi');

    useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
  
    const toggleTheme = () => {
      setTheme(theme === 'lofi' ? 'dark' : 'lofi');
    };

    return (
      <div className="fixed bottom-4 left-16 z-50">
        <button 
          onClick={toggleTheme}
          className="btn btn-circle btn-ghost"
          aria-label="Toggle theme"
        >
          {theme === 'lofi' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>
    )
}

export default ThemeToggleWidget;