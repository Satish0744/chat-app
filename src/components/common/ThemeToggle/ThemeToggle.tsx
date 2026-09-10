import React, { useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="
        relative p-2.5 rounded-xl 
        bg-gray-100 dark:bg-gray-800 
        hover:bg-gray-200 dark:hover:bg-gray-700 
        transition-all duration-300 
        group
        overflow-hidden
      "
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon (Light Mode) */}
        <SunIcon 
          className={`
            absolute inset-0 w-6 h-6 text-yellow-500 
            transition-all duration-500 ease-in-out
            ${theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
            }
          `} 
        />
        
        {/* Moon Icon (Dark Mode) */}
        <MoonIcon 
          className={`
            absolute inset-0 w-6 h-6 text-slate-700 
            transition-all duration-500 ease-in-out
            ${theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
            }
          `} 
        />
      </div>

      {/* Glow effect */}
      <div className={`
        absolute inset-0 rounded-xl transition-opacity duration-300
        ${theme === 'dark' 
          ? 'bg-yellow-400/20 opacity-0 group-hover:opacity-100' 
          : 'bg-slate-900/10 opacity-0 group-hover:opacity-100'
        }
      `} />
    </button>
  );
};