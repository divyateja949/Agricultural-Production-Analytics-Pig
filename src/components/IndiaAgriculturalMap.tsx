import React, { useState, useMemo } from 'react';
import { AgriculturalRecord } from '../types/agriculture';
import { STATE_ZONES_DATA } from '../data/stateZones';
import {
  MapPin,
  TrendingUp,
  Wheat,
  CloudRain,
  Layers,
  Filter,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface IndiaAgriculturalMapProps {
  records: AgriculturalRecord[];
  onSelectState: (state: string) => void;
  selectedStateFilter: string;
}

// Coordinate layout and boundary approximations for Indian states on an 800x850 viewport
const INDIA_STATES_GEOMETRY: Record<
  string,
  {
    code: string;
    labelX: number;
    labelY: number;
    path: string;
    region: 'North' | 'South' | 'East' | 'West' | 'Central';
  }
> = {
  Punjab: {
    code: 'PB',
    labelX: 285,
    labelY: 220,
    path: 'M 260 190 L 310 195 L 325 240 L 290 260 L 255 235 Z',
    region: 'North'
  },
  Haryana: {
    code: 'HR',
    labelX: 325,
    labelY: 260,
    path: 'M 295 245 L 345 240 L 350 280 L 320 295 L 295 270 Z',
    region: 'North'
  },
  Rajasthan: {
    code: 'RJ',
    labelX: 240,
    labelY: 340,
    path: 'M 200 280 L 285 260 L 320 295 L 305 380 L 250 420 L 170 380 L 160 320 Z',
    region: 'West'
  },
  'Uttar Pradesh': {
    code: 'UP',
    labelX: 430,
    labelY: 330,
    path: 'M 345 245 L 430 250 L 520 290 L 525 350 L 450 380 L 375 360 L 340 310 Z',
    region: 'North'
  },
  Gujarat: {
    code: 'GJ',
    labelX: 180,
    labelY: 460,
    path: 'M 145 400 L 235 410 L 260 480 L 210 520 L 175 510 L 120 480 L 115 440 Z',
    region: 'West'
  },
  'Madhya Pradesh': {
    code: 'MP',
    labelX: 380,
    labelY: 450,
    path: 'M 270 410 L 375 370 L 480 385 L 485 470 L 430 520 L 320 520 L 275 470 Z',
    region: 'Central'
  },
  Bihar: {
    code: 'BR',
    labelX: 570,
    labelY: 350,
    path: 'M 525 305 L 615 310 L 630 375 L 560 395 L 520 365 Z',
    region: 'East'
  },
  'West Bengal': {
    code: 'WB',
    labelX: 640,
    labelY: 440,
    path: 'M 620 340 L 650 345 L 640 430 L 670 490 L 630 520 L 610 440 Z',
    region: 'East'
  },
  Maharashtra: {
    code: 'MH',
    labelX: 290,
    labelY: 570,
    path: 'M 225 505 L 340 515 L 420 535 L 430 610 L 340 655 L 260 635 L 220 570 Z',
    region: 'West'
  },
  Odisha: {
    code: 'OD',
    labelX: 550,
    labelY: 520,
    path: 'M 495 470 L 590 460 L 620 525 L 560 595 L 500 560 Z',
    region: 'East'
  },
  Karnataka: {
    code: 'KA',
    labelX: 280,
    labelY: 690,
    path: 'M 265 625 L 340 645 L 360 720 L 330 780 L 285 770 L 260 700 Z',
    region: 'South'
  },
  'Andhra Pradesh': {
    code: 'AP',
    labelX: 410,
    labelY: 660,
    path: 'M 355 625 L 440 595 L 515 620 L 460 730 L 380 750 L 365 680 Z',
    region: 'South'
  },
  'Tamil Nadu': {
    code: 'TN',
    labelX: 340,
    labelY: 795,
    path: 'M 305 765 L 380 745 L 390 810 L 340 860 L 315 820 Z',
    region: 'South'
  },
  Kerala: {
    code: 'KL',
    labelX: 285,
    labelY: 810,
    path: 'M 285 765 L 315 770 L 315 850 L 285 840 Z',
    region: 'South'
  }
};

export const IndiaAgriculturalMap: React.FC<IndiaAgriculturalMapProps> = ({
  records,
  onSelectState,
  selectedStateFilter
}) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [activeStateName, setActiveStateName] = useState<string>('Uttar Pradesh');

  // Compute production stats per state
  const stateStats = useMemo(() => {
    const map: Record<
      string,
      {
        totalProd: number;
        totalArea: number;
        avgYield: number;
        recordCount: number;
        crops: { crop: string; prod: number; yield: number }[];
      }
    > = {};

    records.forEach((r) => {
      if (!map[r.state]) {
        map[r.state] = {
          totalProd: 0,
          totalArea: 0,
          avgYield: 0,
          recordCount: 0,
          crops: []
        };
      }
      map[r.state].totalProd += r.production;
      map[r.state].totalArea += r.area;
      map[r.state].recordCount += 1;

      // Group crops inside state
      const existingCrop = map[r.state].crops.find((c) => c.crop === r.crop);
      if (existingCrop) {
        existingCrop.prod += r.production;
      } else {
        map[r.state].crops.push({ crop: r.crop, prod: r.production, yield: r.yield });
      }
    });

    Object.values(map).forEach((s) => {
      s.avgYield = s.totalArea > 0 ? Math.round((s.totalProd / s.totalArea) * 100) / 100 : 0;
      s.crops.sort((a, b) => b.prod - a.prod);
    });

    return map;
  }, [records]);

  // Total national production for percentage calculation
  const nationalTotalProd = useMemo(() => {
    return Object.values(stateStats).reduce((acc, curr) => acc + curr.totalProd, 0);
  }, [stateStats]);

  // Max production for dynamic choropleth scaling
  const maxStateProduction = useMemo(() => {
    let max = 0;
    Object.values(stateStats).forEach((s) => {
      if (s.totalProd > max) max = s.totalProd;
    });
    return max || 1;
  }, [stateStats]);

  // Determine choropleth fill color
  const getStateFillColor = (stateName: string) => {
    const stat = stateStats[stateName];
    if (!stat || stat.totalProd === 0) {
      return '#e2e8f0'; // slate-200
    }
    const ratio = stat.totalProd / maxStateProduction;

    if (ratio > 0.75) return '#14532d'; // emerald-900 (Very High)
    if (ratio > 0.45) return '#16a34a'; // emerald-600 (High)
    if (ratio > 0.20) return '#4ade80'; // emerald-400 (Medium)
    if (ratio > 0.08) return '#86efac'; // emerald-300 (Moderate)
    return '#bbf7d0'; // emerald-200 (Low)
  };

  const activeStateData = stateStats[activeStateName] || {
    totalProd: 0,
    totalArea: 0,
    avgYield: 0,
    recordCount: 0,
    crops: []
  };

  const activeZoneInfo = STATE_ZONES_DATA.find(
    (z) => z.state.toLowerCase() === activeStateName.toLowerCase()
  ) || {
    agroZone: 'Regional Agricultural Zone',
    primarySoil: 'Alluvial Loam',
    climate: 'Sub-Humid',
    avgRainfallMm: 950
  };

  const stateSharePct =
    nationalTotalProd > 0
      ? Math.round((activeStateData.totalProd / nationalTotalProd) * 1000) / 10
      : 0;

  // Sorted list of states for quick reference list
  const rankedStates = useMemo(() => {
    return Object.keys(INDIA_STATES_GEOMETRY)
      .map((st) => ({
        state: st,
        production: stateStats[st]?.totalProd || 0,
        yield: stateStats[st]?.avgYield || 0,
        area: stateStats[st]?.totalArea || 0
      }))
      .sort((a, b) => b.production - a.production);
  }, [stateStats]);

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 lg:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <MapPin className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Interactive India Agricultural Production Map
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Geographical choropleth map shaded by agricultural harvest output. Click any state to inspect crop details.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] font-mono flex-wrap">
          <span className="text-stone-400 text-xs">Output Level:</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#14532d] inline-block" />
            <span className="text-stone-700 dark:text-stone-300">&gt;75%</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#16a34a] inline-block" />
            <span className="text-stone-700 dark:text-stone-300">45-75%</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#4ade80] inline-block" />
            <span className="text-stone-700 dark:text-stone-300">20-45%</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#86efac] inline-block" />
            <span className="text-stone-700 dark:text-stone-300">8-20%</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#bbf7d0] inline-block" />
            <span className="text-stone-700 dark:text-stone-300">&lt;8%</span>
          </span>
        </div>
      </div>

      {/* Main Map & Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Choropleth Map (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[460px]">
          {/* Active tooltip indicator */}
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-300 font-mono shadow-xs">
            Hovered: <strong className="text-emerald-700 dark:text-emerald-400">{hoveredState || activeStateName}</strong>
          </div>

          <svg
            viewBox="80 150 640 730"
            className="w-full max-h-[500px] drop-shadow-sm select-none"
          >
            {/* Outline Background & Grid Accents */}
            <defs>
              <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#15803d" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Render States */}
            {Object.entries(INDIA_STATES_GEOMETRY).map(([name, geom]) => {
              const isHovered = hoveredState === name;
              const isSelected = activeStateName === name;
              const isFiltered = selectedStateFilter === name;
              const fillColor = getStateFillColor(name);

              return (
                <g key={name} className="cursor-pointer transition-all">
                  <path
                    d={geom.path}
                    fill={fillColor}
                    stroke={isSelected || isFiltered ? '#047857' : '#ffffff'}
                    strokeWidth={isSelected || isFiltered ? 3 : 1.5}
                    filter={isSelected ? 'url(#map-glow)' : undefined}
                    onMouseEnter={() => setHoveredState(name)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => {
                      setActiveStateName(name);
                    }}
                    className="transition-all duration-200 hover:opacity-90 hover:stroke-emerald-800"
                  />
                  {/* State Text Label */}
                  <text
                    x={geom.labelX}
                    y={geom.labelY}
                    textAnchor="middle"
                    fill={
                      fillColor === '#14532d' || fillColor === '#16a34a'
                        ? '#ffffff'
                        : '#1e293b'
                    }
                    fontSize={11}
                    fontWeight="bold"
                    fontFamily="Plus Jakarta Sans"
                    className="pointer-events-none select-none tracking-tight"
                  >
                    {geom.code}
                  </text>
                </g>
              );
            })}
          </svg>

          <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-2 text-center font-mono">
            Click on any state territory to view agricultural production, soil taxonomy, and leading crops.
          </p>
        </div>

        {/* Selected State Details Panel (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                    {activeStateName}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                    {stateSharePct}% National Share
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {activeZoneInfo.agroZone}
                </p>
              </div>

              <button
                onClick={() => onSelectState(activeStateName)}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors whitespace-nowrap"
              >
                <Filter className="w-3 h-3" />
                <span>Filter to State</span>
              </button>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  Total Production
                </div>
                <div className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums mt-0.5">
                  {activeStateData.totalProd >= 1000000
                    ? `${(activeStateData.totalProd / 1000000).toFixed(2)}M MT`
                    : `${(activeStateData.totalProd / 1000).toFixed(1)}K MT`}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5 font-mono">
                  {activeStateData.totalProd.toLocaleString()} MT
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  Average Yield
                </div>
                <div className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-mono tabular-nums mt-0.5">
                  {activeStateData.avgYield} MT/Ha
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 font-mono">
                  {activeStateData.totalArea.toLocaleString()} Ha Area
                </div>
              </div>
            </div>

            {/* Environmental & Agro-Climatic Profile */}
            <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 text-xs space-y-2">
              <div className="font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider">
                Agro-Climatic Reference (Apache Pig JOIN Dataset)
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-stone-400">Primary Soil:</span>
                  <div className="font-semibold text-stone-800 dark:text-stone-200">{activeZoneInfo.primarySoil}</div>
                </div>
                <div>
                  <span className="text-stone-400">Climate:</span>
                  <div className="font-semibold text-stone-800 dark:text-stone-200">{activeZoneInfo.climate}</div>
                </div>
                <div>
                  <span className="text-stone-400">Annual Rainfall:</span>
                  <div className="font-semibold text-stone-800 dark:text-stone-200">{activeZoneInfo.avgRainfallMm} mm</div>
                </div>
                <div>
                  <span className="text-stone-400">Data Records:</span>
                  <div className="font-semibold text-stone-800 dark:text-stone-200">{activeStateData.recordCount} rows</div>
                </div>
              </div>
            </div>

            {/* Top Crops Produced in This State */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                <span>Top Cultivated Crops in {activeStateName}</span>
                <span className="text-[11px] text-stone-400 font-mono">Ranked by volume</span>
              </div>
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {activeStateData.crops.length === 0 ? (
                  <div className="text-xs text-stone-400 py-3 text-center">
                    No crop records available for this state in current filter subset.
                  </div>
                ) : (
                  activeStateData.crops.slice(0, 5).map((c, i) => (
                    <div
                      key={c.crop}
                      className="flex items-center justify-between p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono text-[10px] flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">{c.crop}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-semibold text-stone-900 dark:text-stone-100">{c.prod.toLocaleString()} MT</span>
                        <span className="text-[10px] text-stone-400 block">{c.yield} MT/Ha</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick State Selector Pills */}
          <div className="p-3 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Quick Select State
            </span>
            <div className="flex flex-wrap gap-1.5">
              {rankedStates.map((st) => (
                <button
                  key={st.state}
                  onClick={() => setActiveStateName(st.state)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                    activeStateName === st.state
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-emerald-400'
                  }`}
                >
                  {st.state}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
