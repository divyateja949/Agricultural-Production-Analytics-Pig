import React from 'react';
import {
  Sprout,
  Download,
  Presentation,
  RotateCcw,
  Database,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  totalRecords: number;
  filteredCount: number;
  onOpenPresentation: () => void;
  onExportCsv: () => void;
  onResetFilters: () => void;
  isFiltered: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalRecords,
  filteredCount,
  onOpenPresentation,
  onExportCsv,
  onResetFilters,
  isFiltered,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
        {/* Zone 1: Single text element wordmark with subtle agriculture icon */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <h1 className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight whitespace-nowrap">
              AgriPig Analytics
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
              Agricultural Production Analytics Using Apache Pig
            </p>
          </div>
        </div>

        {/* Zone 2: Informative metadata display */}
        <div className="hidden md:flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 dark:bg-stone-800 rounded-md text-stone-700 dark:text-stone-300">
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-stone-900 dark:text-stone-100">{filteredCount}</span> of {totalRecords} records
          </span>
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:underline px-1.5 py-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>

        {/* Zone 3: Action buttons & Light/Dark Mode */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            aria-label="Toggle theme mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-600" />
            )}
          </button>

          <button
            onClick={onExportCsv}
            title="Download active records as CSV"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span> CSV
          </button>

          <button
            onClick={onOpenPresentation}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs hover:shadow-sm transition-all whitespace-nowrap"
          >
            <Presentation className="w-3.5 h-3.5 text-emerald-200" />
            <span>Viva Presentation</span>
          </button>
        </div>
      </div>
    </header>
  );
};
