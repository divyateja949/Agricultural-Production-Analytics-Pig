import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  CircleGauge,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Copy,
  Check,
  Wheat,
  Sprout,
  Printer,
  Sparkles,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { AgriculturalRecord, SummaryAnalytics } from '../types/agriculture';
import { getSeasonalAnalysis, getYearlyTrendChartData, getTop10CropsData } from '../utils/analytics';

interface InsightsViewProps {
  records: AgriculturalRecord[];
  analytics: SummaryAnalytics;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ records, analytics }) => {
  const [copiedReport, setCopiedReport] = useState(false);
  const seasonalData = getSeasonalAnalysis(records);
  const yearlyTrend = getYearlyTrendChartData(records);
  const top10Crops = getTop10CropsData(records);

  // Compute Year-over-Year (YoY) growth rates
  const yoyGrowth: { year: string; production: number; growthPct: number | null }[] = [];
  for (let i = 0; i < yearlyTrend.years.length; i++) {
    const yr = yearlyTrend.years[i];
    const prod = yearlyTrend.productions[i];
    if (i === 0) {
      yoyGrowth.push({ year: yr, production: prod, growthPct: null });
    } else {
      const prevProd = yearlyTrend.productions[i - 1];
      const pct = prevProd > 0 ? ((prod - prevProd) / prevProd) * 100 : 0;
      yoyGrowth.push({ year: yr, production: prod, growthPct: Math.round(pct * 10) / 10 });
    }
  }

  // Generate automated smart recommendations & observations
  const smartInsights = [
    {
      title: 'Monsoon Dependency & Kharif Area Concentration',
      text: `Kharif season commands the highest crop diversity with ${records.filter((r) => r.season === 'Kharif').length} records, requiring robust canal and groundwater backup during precipitation variations.`,
      type: 'insight'
    },
    {
      title: 'High Biomass vs Cereal Productivity Gap',
      text: `${analytics.highestYieldCrop.crop} achieves ${analytics.highestYieldCrop.yield} MT/Ha due to high-sucrose biomass density, whereas cereals like Wheat and Rice average 3.5 to 5.0 MT/Ha with higher caloric food security value.`,
      type: 'efficiency'
    },
    {
      title: 'State Production Specialization',
      text: `${analytics.highestProducingState.state} leads national output with ${analytics.highestProducingState.sharePercent}% share, driven by favorable agro-climatic alluvial plains and extensive irrigation networks.`,
      type: 'state'
    }
  ];

  // Generate executive summary text report
  const generateSummaryReport = () => {
    return `========================================================================
AGRICULTURAL PRODUCTION ANALYTICS REPORT (APACHE PIG DATA PROCESSING)
Generated on: ${new Date().toLocaleDateString()}
Total Records Analyzed: ${records.length}
========================================================================

1. EXECUTIVE DASHBOARD SUMMARY
------------------------------------------------------------------------
- Total Agricultural Production : ${analytics.totalProduction.toLocaleString()} Metric Tonnes
- Total Cultivated Area         : ${analytics.totalArea.toLocaleString()} Hectares
- Overall Average Crop Yield    : ${analytics.averageYield} MT / Hectare
- Number of Agricultural States : ${analytics.totalStates}
- Number of Crops Surveyed      : ${analytics.totalCrops}
- Dominant Farming Season       : ${analytics.dominantSeason.season} (${analytics.dominantSeason.percentage}% share)
- YoY Growth Rate (Latest)      : ${analytics.yoyGrowthRate !== null ? (analytics.yoyGrowthRate > 0 ? '+' : '') + analytics.yoyGrowthRate + '%' : 'Baseline'}

2. MOST & LEAST PRODUCTIVE CROPS
------------------------------------------------------------------------
- Highest-Producing Crop (Volume) : ${analytics.mostProducedCrop.crop}
  * Volume                        : ${analytics.mostProducedCrop.production.toLocaleString()} Metric Tonnes
  * National Share                : ${analytics.mostProducedCrop.sharePercent}% of total harvest
- Most Productive Crop (Yield)    : ${analytics.highestYieldCrop.crop} (${analytics.highestYieldCrop.yield} MT/Ha)
- Least Productive Crop (Yield)   : ${analytics.leastProductiveCrop.crop} (${analytics.leastProductiveCrop.yield} MT/Ha)
- Lowest Volume Crop              : ${analytics.lowestProducedCrop.crop} (${analytics.lowestProducedCrop.production.toLocaleString()} MT)

3. BEST PERFORMING AGRICULTURAL STATE
------------------------------------------------------------------------
- Lead State             : ${analytics.highestProducingState.state}
- Total Output           : ${analytics.highestProducingState.production.toLocaleString()} Metric Tonnes
- National Contribution  : ${analytics.highestProducingState.sharePercent}% of aggregate production

4. SEASONAL PRODUCTION BREAKDOWN
------------------------------------------------------------------------
${seasonalData.map((s) => `- ${s.season.padEnd(12)}: ${s.production.toLocaleString().padStart(12)} MT | Area: ${s.area.toLocaleString().padStart(10)} Ha | Avg Yield: ${s.avgYield} MT/Ha`).join('\n')}

5. YEAR-OVER-YEAR PRODUCTION TRAJECTORY
------------------------------------------------------------------------
${yoyGrowth.map((y) => `- Year ${y.year}: ${y.production.toLocaleString()} MT | YoY Change: ${y.growthPct !== null ? (y.growthPct > 0 ? '+' : '') + y.growthPct + '%' : 'Baseline'}`).join('\n')}

========================================================================
Report generated via Apache Pig Latin processing pipeline simulation.
========================================================================`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateSummaryReport());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Smart Agricultural Insights & Intelligence
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Key findings derived from Apache Pig aggregations, yield efficiency ratios, and seasonal patterns
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 text-stone-800 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400">Report Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Spotlight Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Most Productive Crop (Highest Yield) */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
                Most Productive Crop
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                <CircleGauge className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
              {analytics.highestYieldCrop.crop}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Top yield efficiency of <strong className="text-stone-800 dark:text-stone-200 font-mono">{analytics.highestYieldCrop.yield} MT/Ha</strong>, producing maximum output per unit of cultivated land.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
            Efficiency Benchmark
          </div>
        </div>

        {/* Least Productive Crop */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-mono">
                Least Productive Crop
              </span>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                <Sprout className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
              {analytics.leastProductiveCrop.crop}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Yield of <strong className="text-stone-800 dark:text-stone-200 font-mono">{analytics.leastProductiveCrop.yield} MT/Ha</strong>. Represents specialty plantation/pulse crop with lower biomass per hectare.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
            Specialized Rotation
          </div>
        </div>

        {/* Best Performing State */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-mono">
                Highest-Performing State
              </span>
              <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
              {analytics.highestProducingState.state}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Contributes <strong className="text-stone-800 dark:text-stone-200">{analytics.highestProducingState.sharePercent}%</strong> of total national harvest with{' '}
              <span className="font-mono tabular-nums">{analytics.highestProducingState.production.toLocaleString()} MT</span>.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
            Regional Producer #1
          </div>
        </div>

        {/* Production Growth / Decline */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-lime-800 dark:text-lime-300 font-mono">
                Production Growth
              </span>
              <div className="p-2 rounded-lg bg-lime-50 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100 font-mono">
              {analytics.yoyGrowthRate !== null
                ? `${analytics.yoyGrowthRate > 0 ? '+' : ''}${analytics.yoyGrowthRate}%`
                : 'Steady'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {analytics.yoyGrowthRate !== null && analytics.yoyGrowthRate >= 0 ? (
                <span>
                  Positive agrarian expansion of <strong className="text-emerald-700 dark:text-emerald-400">+{analytics.yoyGrowthRate}%</strong> YoY across active monitored years.
                </span>
              ) : (
                <span>Year-over-year production remains stable across active filters.</span>
              )}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
            {analytics.yoyGrowthRate && analytics.yoyGrowthRate >= 0 ? 'Expansion Phase' : 'Baseline Reference'}
          </div>
        </div>
      </div>

      {/* Two-Column Deep Dive: YoY Growth & Seasonal Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* YoY Production Growth Table */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Yearly Production Trajectory & YoY Growth
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Calculated growth and contraction rates across sequential crop years
              </p>
            </div>
            <span className="text-xs font-mono text-stone-400">YoY %</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-mono border-b border-stone-200 dark:border-stone-700">
                <tr>
                  <th className="px-3.5 py-2.5">Crop Year</th>
                  <th className="px-3.5 py-2.5 text-right">Production (MT)</th>
                  <th className="px-3.5 py-2.5 text-right">YoY Change</th>
                  <th className="px-3.5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono">
                {yoyGrowth.map((row, idx) => {
                  const isPositive = row.growthPct !== null && row.growthPct >= 0;
                  return (
                    <tr key={idx} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40">
                      <td className="px-3.5 py-2.5 font-bold text-stone-900 dark:text-stone-100">{row.year}</td>
                      <td className="px-3.5 py-2.5 text-right tabular-nums text-stone-800 dark:text-stone-200">
                        {row.production.toLocaleString()}
                      </td>
                      <td className="px-3.5 py-2.5 text-right tabular-nums">
                        {row.growthPct === null ? (
                          <span className="text-stone-400">Baseline</span>
                        ) : (
                          <span
                            className={`font-semibold flex items-center justify-end gap-0.5 ${
                              isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                            }`}
                          >
                            {isPositive ? (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5" />
                            )}
                            {row.growthPct > 0 ? `+${row.growthPct}%` : `${row.growthPct}%`}
                          </span>
                        )}
                      </td>
                      <td className="px-3.5 py-2.5 font-sans">
                        {row.growthPct === null ? (
                          <span className="text-stone-400 text-[11px]">Initial Reference</span>
                        ) : isPositive ? (
                          <span className="text-emerald-800 dark:text-emerald-300 text-[11px] font-medium">Expansion</span>
                        ) : (
                          <span className="text-rose-800 dark:text-rose-300 text-[11px] font-medium">Contraction</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Seasonal Production Breakdown */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Seasonal Production Analysis (Kharif vs Rabi vs Summer)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Harvest volume, land utilization, and yield comparisons by farming season
              </p>
            </div>
            <span className="text-xs font-mono text-stone-400">Seasons</span>
          </div>

          <div className="space-y-3">
            {seasonalData.map((s) => {
              const sharePct =
                analytics.totalProduction > 0
                  ? Math.round((s.production / analytics.totalProduction) * 1000) / 10
                  : 0;

              return (
                <div
                  key={s.season}
                  className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">{s.season} Season</span>
                    <span className="text-xs font-mono font-semibold text-emerald-800 dark:text-emerald-300">
                      {s.production.toLocaleString()} MT ({sharePct}%)
                    </span>
                  </div>

                  <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-700 dark:bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(3, sharePct))}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                    <span>Cultivated: {s.area.toLocaleString()} Ha</span>
                    <span>Avg Yield: {s.avgYield} MT/Ha</span>
                    <span>Varieties: {s.cropsCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Automated Analytical Recommendations */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Agronomic Trends & Intelligence Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {smartInsights.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-1.5"
            >
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{item.title}</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
