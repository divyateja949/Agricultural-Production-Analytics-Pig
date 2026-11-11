import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { AgriculturalFilters } from '../types/agriculture';

interface FilterBarProps {
  filters: AgriculturalFilters;
  setFilters: React.Dispatch<React.SetStateAction<AgriculturalFilters>>;
  states: string[];
  districts: string[];
  crops: string[];
  years: number[];
  seasons: string[];
  onReset: () => void;
  filteredCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  states,
  districts,
  crops,
  years,
  seasons,
  onReset,
  filteredCount,
  totalCount
}) => {
  const isFiltered =
    filters.state !== 'ALL' ||
    filters.district !== 'ALL' ||
    filters.crop !== 'ALL' ||
    filters.year !== 'ALL' ||
    filters.season !== 'ALL' ||
    filters.searchQuery.trim() !== '';

  const handleStateChange = (newState: string) => {
    setFilters((prev) => ({
      ...prev,
      state: newState,
      district: 'ALL' // Reset district when state changes
    }));
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-xs mb-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
            <Filter className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            Interactive Agricultural Filters
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
            ({filteredCount} / {totalCount} records matched)
          </span>
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* State Filter */}
        <div>
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">State</label>
          <select
            value={filters.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-2 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white dark:focus:bg-stone-900"
          >
            <option value="ALL">All States ({states.length})</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* District Filter (cascades with state) */}
        <div>
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">District</label>
          <select
            value={filters.district}
            onChange={(e) => setFilters((prev) => ({ ...prev, district: e.target.value }))}
            className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-2 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white dark:focus:bg-stone-900"
          >
            <option value="ALL">All Districts ({districts.length})</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Crop Filter */}
        <div>
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">Crop</label>
          <select
            value={filters.crop}
            onChange={(e) => setFilters((prev) => ({ ...prev, crop: e.target.value }))}
            className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-2 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white dark:focus:bg-stone-900"
          >
            <option value="ALL">All Crops ({crops.length})</option>
            {crops.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Crop Year Filter */}
        <div>
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">Crop Year</label>
          <select
            value={filters.year}
            onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}
            className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-2 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white dark:focus:bg-stone-900"
          >
            <option value="ALL">All Years ({years.length})</option>
            {years.map((y) => (
              <option key={y} value={y.toString()}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Season Filter */}
        <div>
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">Season</label>
          <select
            value={filters.season}
            onChange={(e) => setFilters((prev) => ({ ...prev, season: e.target.value }))}
            className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-2 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white dark:focus:bg-stone-900"
          >
            <option value="ALL">All Seasons ({seasons.length})</option>
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Text Search Filter */}
        <div>
          <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">Search Keyword</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg pl-8 pr-2.5 py-2 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white dark:focus:bg-stone-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
