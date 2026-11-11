import React from 'react';
import {
  Wheat,
  Sprout,
  MapPin,
  TrendingUp,
  Award,
  CircleGauge,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Percent
} from 'lucide-react';
import { SummaryAnalytics } from '../types/agriculture';

interface DashboardKpisProps {
  analytics: SummaryAnalytics;
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({ analytics }) => {
  const formatProduction = (val: number) => {
    if (val >= 10000000) return `${(val / 1000000).toFixed(1)}M MT`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M MT`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K MT`;
    return `${val.toLocaleString()} MT`;
  };

  const formatArea = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M Ha`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K Ha`;
    return `${val.toLocaleString()} Ha`;
  };

  // Primary 6 KPI Cards mandated by requirement 1:
  // 1. Total agricultural production
  // 2. Total cultivated area
  // 3. Average crop yield
  // 4. Highest-producing crop
  // 5. Highest-producing state
  // 6. Year-over-year production growth
  const kpis = [
    {
      id: 'kpi-prod',
      title: 'Total Agricultural Production',
      value: formatProduction(analytics.totalProduction),
      subtext: `${analytics.totalProduction.toLocaleString()} Metric Tonnes (MT)`,
      icon: Wheat,
      colorClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
      badge: 'Primary Yield'
    },
    {
      id: 'kpi-area',
      title: 'Total Cultivated Area',
      value: formatArea(analytics.totalArea),
      subtext: `${analytics.totalArea.toLocaleString()} Hectares in active cultivation`,
      icon: Layers,
      colorClass: 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800',
      badge: 'Land Cover'
    },
    {
      id: 'kpi-yield',
      title: 'Average Crop Yield',
      value: `${analytics.averageYield} MT/Ha`,
      subtext: `Weighted land productivity ratio (Prod/Area)`,
      icon: CircleGauge,
      colorClass: 'text-lime-700 dark:text-lime-300 bg-lime-50 dark:bg-lime-950/50 border-lime-200 dark:border-lime-800',
      badge: 'Productivity'
    },
    {
      id: 'kpi-crop-lead',
      title: 'Highest-Producing Crop',
      value: analytics.mostProducedCrop.crop,
      subtext: `${formatProduction(analytics.mostProducedCrop.production)} (${analytics.mostProducedCrop.sharePercent}% of total harvest)`,
      icon: Sprout,
      colorClass: 'text-emerald-800 dark:text-emerald-200 bg-emerald-100/50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-700',
      badge: 'Volume Champion'
    },
    {
      id: 'kpi-state-lead',
      title: 'Highest-Producing State',
      value: analytics.highestProducingState.state,
      subtext: `${formatProduction(analytics.highestProducingState.production)} (${analytics.highestProducingState.sharePercent}% national share)`,
      icon: Award,
      colorClass: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
      badge: 'Top State'
    },
    {
      id: 'kpi-yoy',
      title: 'YoY Production Growth',
      value: analytics.yoyGrowthRate !== null 
        ? `${analytics.yoyGrowthRate > 0 ? '+' : ''}${analytics.yoyGrowthRate}%`
        : 'Baseline',
      subtext: analytics.previousYear
        ? `${analytics.latestYear} vs ${analytics.previousYear} (${analytics.yoyGrowthVolume ? (analytics.yoyGrowthVolume > 0 ? '+' : '') + formatProduction(analytics.yoyGrowthVolume) : 'steady'})`
        : 'Single year or multi-year baseline',
      icon: analytics.yoyGrowthRate !== null && analytics.yoyGrowthRate >= 0 ? ArrowUpRight : ArrowDownRight,
      colorClass: analytics.yoyGrowthRate !== null && analytics.yoyGrowthRate >= 0
        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
        : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800',
      badge: analytics.yoyGrowthRate !== null && analytics.yoyGrowthRate >= 0 ? 'Expansion' : 'Trend Rate'
    }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* 6 Core Dashboard KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold">
                        {kpi.badge}
                      </span>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 truncate">
                      {kpi.title}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-lg border shrink-0 ${kpi.colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight font-mono tabular-nums truncate">
                  {kpi.value}
                </p>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-3 font-medium truncate pt-2 border-t border-stone-100 dark:border-stone-800/80">
                {kpi.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {/* Secondary Contextual Indicators Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Dominant Farming Season</div>
              <div className="text-sm font-bold text-stone-800 dark:text-stone-200 font-mono">
                {analytics.dominantSeason.season} ({analytics.dominantSeason.percentage}% share)
              </div>
            </div>
          </div>
          <span className="text-[10px] text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-mono font-semibold">
            Seasonal Lead
          </span>
        </div>

        <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Yield Efficiency Leader</div>
              <div className="text-sm font-bold text-stone-800 dark:text-stone-200 font-mono">
                {analytics.highestYieldCrop.crop} ({analytics.highestYieldCrop.yield} MT/Ha)
              </div>
            </div>
          </div>
          <span className="text-[10px] text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded font-mono font-semibold">
            Max Efficiency
          </span>
        </div>

        <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" />
            <div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">States & Districts Mapped</div>
              <div className="text-sm font-bold text-stone-800 dark:text-stone-200 font-mono">
                {analytics.totalStates} States · {analytics.totalDistricts} Districts
              </div>
            </div>
          </div>
          <span className="text-[10px] text-teal-800 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/60 px-2 py-0.5 rounded font-mono font-semibold">
            Coverage
          </span>
        </div>
      </div>
    </div>
  );
};
