import React, { useState, useMemo, useEffect } from 'react';
import { SAMPLE_AGRICULTURAL_DATA } from './data/sampleDataset';
import { AgriculturalRecord, AgriculturalFilters } from './types/agriculture';
import { calculateSummaryAnalytics, exportRecordsToCsv } from './utils/analytics';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { DashboardKpis } from './components/DashboardKpis';
import { ChartsView } from './components/ChartsView';
import { ApachePigLab } from './components/ApachePigLab';
import { DataUploadTable } from './components/DataUploadTable';
import { InsightsView } from './components/InsightsView';
import { IndiaAgriculturalMap } from './components/IndiaAgriculturalMap';
import { PresentationMode } from './components/PresentationMode';
import {
  Wheat,
  Terminal,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Layers,
  Database,
  MapPin,
  Printer
} from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<AgriculturalRecord[]>(SAMPLE_AGRICULTURAL_DATA);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Synchronize dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [filters, setFilters] = useState<AgriculturalFilters>({
    state: 'ALL',
    district: 'ALL',
    crop: 'ALL',
    year: 'ALL',
    season: 'ALL',
    searchQuery: ''
  });

  // Extract unique options from current dataset
  const uniqueStates = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.state))).sort();
  }, [records]);

  const uniqueDistricts = useMemo(() => {
    if (filters.state === 'ALL') {
      return Array.from(new Set(records.map((r) => r.district))).sort();
    }
    return Array.from(
      new Set(records.filter((r) => r.state === filters.state).map((r) => r.district))
    ).sort();
  }, [records, filters.state]);

  const uniqueCrops = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.crop))).sort();
  }, [records]);

  const uniqueYears = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.cropYear))).sort((a, b) => b - a);
  }, [records]);

  const uniqueSeasons = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.season))).sort();
  }, [records]);

  // Reactive filtering
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (filters.state !== 'ALL' && r.state !== filters.state) return false;
      if (filters.district !== 'ALL' && r.district !== filters.district) return false;
      if (filters.crop !== 'ALL' && r.crop !== filters.crop) return false;
      if (filters.year !== 'ALL' && r.cropYear.toString() !== filters.year) return false;
      if (filters.season !== 'ALL' && r.season !== filters.season) return false;
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          r.state.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          r.crop.toLowerCase().includes(q) ||
          r.season.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [records, filters]);

  // Derived summary analytics
  const analytics = useMemo(() => {
    return calculateSummaryAnalytics(filteredRecords);
  }, [filteredRecords]);

  const handleResetFilters = () => {
    setFilters({
      state: 'ALL',
      district: 'ALL',
      crop: 'ALL',
      year: 'ALL',
      season: 'ALL',
      searchQuery: ''
    });
  };

  const handleExportCsv = () => {
    exportRecordsToCsv(filteredRecords, `agricultural_production_${Date.now()}.csv`);
  };

  const handleResetToSample = () => {
    setRecords(SAMPLE_AGRICULTURAL_DATA);
    handleResetFilters();
  };

  const handleStateSelectFromMap = (stateName: string) => {
    setFilters((prev) => ({
      ...prev,
      state: stateName,
      district: 'ALL'
    }));
  };

  const isFiltered =
    filters.state !== 'ALL' ||
    filters.district !== 'ALL' ||
    filters.crop !== 'ALL' ||
    filters.year !== 'ALL' ||
    filters.season !== 'ALL' ||
    filters.searchQuery.trim() !== '';

  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Navbar
        totalRecords={records.length}
        filteredCount={filteredRecords.length}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onExportCsv={handleExportCsv}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'presentation') {
              setIsPresentationOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          filteredCount={filteredRecords.length}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Universal Filter Bar */}
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            states={uniqueStates}
            districts={uniqueDistricts}
            crops={uniqueCrops}
            years={uniqueYears}
            seasons={uniqueSeasons}
            onReset={handleResetFilters}
            filteredCount={filteredRecords.length}
            totalCount={records.length}
          />

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* KPIs (6 required by prompt) */}
              <DashboardKpis analytics={analytics} />

              {/* Quick Feature Jump Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('map')}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 w-fit mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                      India Agricultural Map
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                      State-wise choropleth map shaded by harvest output. Interactive click-to-filter with agro-climatic profiles.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                    <span>Explore State Map</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('pigLab')}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 w-fit mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                      Apache Pig Processing Lab
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                      Explore LOAD, FILTER, GROUP, FOREACH, ORDER BY, LIMIT, JOIN, and STORE with real-time tuple dumps and MapReduce translation.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                    <span>Open Pig Latin Engine</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('charts')}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 w-fit mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                      Chart.js Visualizations
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                      Examine crop-wise bar charts, distribution doughnut charts, year-wise trends, state comparisons, and area-production scatter plots.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                    <span>View 6 Interactive Charts</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('insights')}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 w-fit mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                      Analytics & Intelligence
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                      Evaluate Year-over-Year (YoY) harvest growth, yield efficiency rankings, and Kharif vs Rabi seasonal productivity indices.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                    <span>Read Agrarian Findings</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* India Agricultural Map preview on Dashboard */}
              <div className="pt-2">
                <IndiaAgriculturalMap
                  records={filteredRecords}
                  onSelectState={handleStateSelectFromMap}
                  selectedStateFilter={filters.state}
                />
              </div>

              {/* Chart.js Embedded Preview on Dashboard */}
              <div className="pt-2">
                <ChartsView
                  records={filteredRecords}
                  onResetFilters={handleResetFilters}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          )}

          {/* TAB 2: VISUALIZATIONS */}
          {activeTab === 'charts' && (
            <div className="space-y-6">
              <ChartsView
                records={filteredRecords}
                onResetFilters={handleResetFilters}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* TAB 3: INDIA AGRICULTURAL MAP */}
          {activeTab === 'map' && (
            <div className="space-y-6">
              <IndiaAgriculturalMap
                records={filteredRecords}
                onSelectState={handleStateSelectFromMap}
                selectedStateFilter={filters.state}
              />
            </div>
          )}

          {/* TAB 4: APACHE PIG LAB */}
          {activeTab === 'pigLab' && (
            <div className="space-y-6">
              <ApachePigLab records={filteredRecords} />
            </div>
          )}

          {/* TAB 5: ANALYTICS & INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <InsightsView records={filteredRecords} analytics={analytics} />
            </div>
          )}

          {/* TAB 6: DATASET & UPLOAD */}
          {activeTab === 'dataset' && (
            <div className="space-y-6">
              <DataUploadTable
                records={records}
                onUpdateRecords={(newRecords) => setRecords(newRecords)}
                onResetToSample={handleResetToSample}
                onGeneratePdfReport={() => window.print()}
              />
            </div>
          )}
        </main>
      </div>

      {/* College Presentation & Viva Mode Modal */}
      <PresentationMode
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        analytics={analytics}
        totalRecords={filteredRecords.length}
      />
    </div>
  );
}
