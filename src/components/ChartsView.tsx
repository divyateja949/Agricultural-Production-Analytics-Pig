import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { AgriculturalRecord } from '../types/agriculture';
import {
  getCropProductionChartData,
  getCropDistributionChartData,
  getYearlyTrendChartData,
  getStateProductionChartData,
  getAreaVsProductionScatterData,
  getTop10CropsData
} from '../utils/analytics';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  MapPin,
  ScatterChart,
  Award,
  Download,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

ChartJS.register(...registerables);

interface ChartsViewProps {
  records: AgriculturalRecord[];
  onResetFilters?: () => void;
  isDarkMode?: boolean;
}

export const ChartsView: React.FC<ChartsViewProps> = ({
  records,
  onResetFilters,
  isDarkMode = false
}) => {
  const [activeChartTab, setActiveChartTab] = useState<
    'all' | 'crops' | 'states' | 'trends' | 'efficiency'
  >('all');
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  const cropBarRef = useRef<HTMLCanvasElement | null>(null);
  const cropPieRef = useRef<HTMLCanvasElement | null>(null);
  const yearlyLineRef = useRef<HTMLCanvasElement | null>(null);
  const stateBarRef = useRef<HTMLCanvasElement | null>(null);
  const scatterRef = useRef<HTMLCanvasElement | null>(null);
  const top10BarRef = useRef<HTMLCanvasElement | null>(null);

  const cropBarChart = useRef<ChartJS | null>(null);
  const cropPieChart = useRef<ChartJS | null>(null);
  const yearlyLineChart = useRef<ChartJS | null>(null);
  const stateBarChart = useRef<ChartJS | null>(null);
  const scatterChart = useRef<ChartJS | null>(null);
  const top10BarChart = useRef<ChartJS | null>(null);

  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDarkMode ? '#cbd5e1' : '#475569';

  // Helper function to download any chart canvas as high-res PNG
  const downloadChartAsPng = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    chartTitle: string
  ) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    const filename = `${chartTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}.png`;
    link.download = filename;
    link.href = image;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (records.length === 0) {
      // Destroy any existing instances if records are empty
      cropBarChart.current?.destroy();
      cropPieChart.current?.destroy();
      yearlyLineChart.current?.destroy();
      stateBarChart.current?.destroy();
      scatterChart.current?.destroy();
      top10BarChart.current?.destroy();
      return;
    }

    // 1. Bar chart: Crop-wise production comparison
    if (cropBarRef.current) {
      if (cropBarChart.current) cropBarChart.current.destroy();
      const cropData = getCropProductionChartData(records);

      cropBarChart.current = new ChartJS(cropBarRef.current, {
        type: 'bar',
        data: {
          labels: cropData.labels,
          datasets: [
            {
              label: 'Production (Metric Tonnes)',
              data: cropData.values,
              backgroundColor: '#16a34a',
              borderRadius: 6,
              hoverBackgroundColor: '#15803d'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              padding: 10,
              backgroundColor: isDarkMode ? '#0f172a' : '#1e293b',
              callbacks: {
                label: (ctx) => `Production: ${Number(ctx.raw).toLocaleString()} MT`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { size: 11, family: 'Plus Jakarta Sans' }, maxRotation: 45 }
            },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                font: { size: 11, family: 'JetBrains Mono' },
                callback: (val) => {
                  const num = Number(val);
                  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M MT`;
                  if (num >= 1000) return `${(num / 1000).toFixed(0)}K MT`;
                  return num.toString();
                }
              }
            }
          }
        }
      });
    }

    // 2. Pie / Doughnut chart: Crop distribution
    if (cropPieRef.current) {
      if (cropPieChart.current) cropPieChart.current.destroy();
      const pieData = getCropDistributionChartData(records);

      cropPieChart.current = new ChartJS(cropPieRef.current, {
        type: 'doughnut',
        data: {
          labels: pieData.labels,
          datasets: [
            {
              data: pieData.values,
              backgroundColor: [
                '#15803d',
                '#16a34a',
                '#4ade80',
                '#ca8a04',
                '#eab308',
                '#0284c7',
                '#94a3b8'
              ],
              borderWidth: 2,
              borderColor: isDarkMode ? '#1c1917' : '#ffffff'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: textColor,
                font: { size: 11, family: 'Plus Jakarta Sans' },
                boxWidth: 12,
                padding: 10
              }
            },
            tooltip: {
              padding: 10,
              backgroundColor: isDarkMode ? '#0f172a' : '#1e293b',
              callbacks: {
                label: (ctx) => {
                  const val = Number(ctx.raw);
                  const total = pieData.values.reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0';
                  return `${ctx.label}: ${val.toLocaleString()} MT (${pct}%)`;
                }
              }
            }
          },
          cutout: '62%'
        }
      });
    }

    // 3. Line chart: Year-wise production trends
    if (yearlyLineRef.current) {
      if (yearlyLineChart.current) yearlyLineChart.current.destroy();
      const trendData = getYearlyTrendChartData(records);

      yearlyLineChart.current = new ChartJS(yearlyLineRef.current, {
        type: 'line',
        data: {
          labels: trendData.years,
          datasets: [
            {
              label: 'Annual Production (MT)',
              data: trendData.productions,
              borderColor: '#15803d',
              backgroundColor: 'rgba(21, 128, 61, 0.14)',
              fill: true,
              tension: 0.35,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: '#15803d',
              yAxisID: 'y'
            },
            {
              label: 'Area Cultivated (Ha)',
              data: trendData.areas,
              borderColor: '#ca8a04',
              backgroundColor: 'transparent',
              borderDash: [5, 5],
              tension: 0.35,
              pointRadius: 3,
              pointHoverRadius: 5,
              pointBackgroundColor: '#ca8a04',
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: textColor, font: { size: 11, family: 'Plus Jakarta Sans' }, boxWidth: 12 }
            },
            tooltip: {
              padding: 10,
              backgroundColor: isDarkMode ? '#0f172a' : '#1e293b',
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString()}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { size: 11, family: 'JetBrains Mono' } }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                font: { size: 10, family: 'JetBrains Mono' },
                callback: (val) => `${(Number(val) / 1000000).toFixed(1)}M MT`
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              grid: { drawOnChartArea: false },
              ticks: {
                color: textColor,
                font: { size: 10, family: 'JetBrains Mono' },
                callback: (val) => `${(Number(val) / 1000).toFixed(0)}K Ha`
              }
            }
          }
        }
      });
    }

    // 4. Bar chart: State-wise agricultural production ranking
    if (stateBarRef.current) {
      if (stateBarChart.current) stateBarChart.current.destroy();
      const stateData = getStateProductionChartData(records);

      stateBarChart.current = new ChartJS(stateBarRef.current, {
        type: 'bar',
        data: {
          labels: stateData.states,
          datasets: [
            {
              label: 'State Output (MT)',
              data: stateData.productions,
              backgroundColor: '#0d9488',
              borderRadius: 6,
              hoverBackgroundColor: '#0f766e'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              padding: 10,
              backgroundColor: isDarkMode ? '#0f172a' : '#1e293b',
              callbacks: {
                label: (ctx) => `State Harvest: ${Number(ctx.raw).toLocaleString()} MT`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { size: 11, family: 'Plus Jakarta Sans' }, maxRotation: 40 }
            },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                font: { size: 11, family: 'JetBrains Mono' },
                callback: (val) => {
                  const num = Number(val);
                  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M MT`;
                  if (num >= 1000) return `${(num / 1000).toFixed(0)}K MT`;
                  return num.toString();
                }
              }
            }
          }
        }
      });
    }

    // 5. Scatter plot: Area versus production
    if (scatterRef.current) {
      if (scatterChart.current) scatterChart.current.destroy();
      const scatterPoints = getAreaVsProductionScatterData(records);

      scatterChart.current = new ChartJS(scatterRef.current, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Crop Record (Area vs Production)',
              data: scatterPoints.map((p) => ({ x: p.x, y: p.y })),
              backgroundColor: 'rgba(22, 163, 74, 0.70)',
              borderColor: '#15803d',
              pointRadius: 5,
              pointHoverRadius: 7
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              padding: 10,
              backgroundColor: isDarkMode ? '#0f172a' : '#1e293b',
              callbacks: {
                label: (ctx) => {
                  const raw = ctx.raw as { x: number; y: number };
                  const match = scatterPoints[ctx.dataIndex];
                  return `${match?.crop || 'Crop'} (${match?.state || 'State'}): Area=${raw.x.toLocaleString()} Ha, Prod=${raw.y.toLocaleString()} MT (Yield=${match?.yield || 0} MT/Ha)`;
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Cultivated Area (Hectares)',
                color: textColor,
                font: { size: 11, family: 'Plus Jakarta Sans' }
              },
              grid: { color: gridColor },
              ticks: { color: textColor, font: { size: 10, family: 'JetBrains Mono' } }
            },
            y: {
              title: {
                display: true,
                text: 'Production (Metric Tonnes)',
                color: textColor,
                font: { size: 11, family: 'Plus Jakarta Sans' }
              },
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                font: { size: 10, family: 'JetBrains Mono' },
                callback: (val) => {
                  const num = Number(val);
                  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M MT`;
                  return `${(num / 1000).toFixed(0)}K MT`;
                }
              }
            }
          }
        }
      });
    }

    // 6. Top 10 highest-producing crops (ranking horizontal bar)
    if (top10BarRef.current) {
      if (top10BarChart.current) top10BarChart.current.destroy();
      const top10 = getTop10CropsData(records);

      top10BarChart.current = new ChartJS(top10BarRef.current, {
        type: 'bar',
        data: {
          labels: top10.map((c) => c.crop),
          datasets: [
            {
              label: 'Total Production (MT)',
              data: top10.map((c) => c.production),
              backgroundColor: [
                '#15803d',
                '#166534',
                '#16a34a',
                '#22c55e',
                '#4ade80',
                '#86efac',
                '#ca8a04',
                '#eab308',
                '#f59e0b',
                '#fbbf24'
              ],
              borderRadius: 6
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              padding: 10,
              backgroundColor: isDarkMode ? '#0f172a' : '#1e293b',
              callbacks: {
                label: (ctx) => {
                  const item = top10[ctx.dataIndex];
                  return `Production: ${Number(ctx.raw).toLocaleString()} MT | Avg Yield: ${item?.avgYield} MT/Ha`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                font: { size: 10, family: 'JetBrains Mono' },
                callback: (val) => {
                  const num = Number(val);
                  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M MT`;
                  return `${(num / 1000).toFixed(0)}K MT`;
                }
              }
            },
            y: {
              grid: { display: false },
              ticks: { color: textColor, font: { size: 11, family: 'Plus Jakarta Sans', weight: 'bold' } }
            }
          }
        }
      });
    }

    return () => {
      cropBarChart.current?.destroy();
      cropPieChart.current?.destroy();
      yearlyLineChart.current?.destroy();
      stateBarChart.current?.destroy();
      scatterChart.current?.destroy();
      top10BarChart.current?.destroy();
    };
  }, [records, activeChartTab, isDarkMode, expandedChart]);

  // Empty data state handling
  if (records.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-8 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
          No Agricultural Records Match Active Filters
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
          The selected combination of State, District, Crop, Year, or Season has no matching records in the dataset.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs & Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Agricultural Visualizations & Statistical Plots
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Interactive Chart.js plots dynamically updating with filter selections · {records.length} records active
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-stone-200/80 dark:bg-stone-800 rounded-lg text-xs font-medium">
          <button
            onClick={() => {
              setActiveChartTab('all');
              setExpandedChart(null);
            }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeChartTab === 'all'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            All 6 Visualizations
          </button>
          <button
            onClick={() => {
              setActiveChartTab('crops');
              setExpandedChart(null);
            }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeChartTab === 'crops'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            Crops Focus
          </button>
          <button
            onClick={() => {
              setActiveChartTab('states');
              setExpandedChart(null);
            }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeChartTab === 'states'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            State Ranking
          </button>
          <button
            onClick={() => {
              setActiveChartTab('trends');
              setExpandedChart(null);
            }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeChartTab === 'trends'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            Yearly Trends
          </button>
          <button
            onClick={() => {
              setActiveChartTab('efficiency');
              setExpandedChart(null);
            }}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeChartTab === 'efficiency'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            Scatter & Top 10
          </button>
        </div>
      </div>

      {/* Grid of 6 Charts */}
      <div
        className={`grid gap-6 ${
          expandedChart ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
        }`}
      >
        {/* Chart 1: Bar chart: Crop-wise production */}
        {(activeChartTab === 'all' || activeChartTab === 'crops' || expandedChart === 'cropBar') &&
          (!expandedChart || expandedChart === 'cropBar') && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Crop-wise Agricultural Production Comparison
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setExpandedChart(expandedChart === 'cropBar' ? null : 'cropBar')
                      }
                      title="Expand or collapse chart"
                      className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      {expandedChart === 'cropBar' ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => downloadChartAsPng(cropBarRef, 'crop_wise_production')}
                      title="Download Chart as PNG"
                      className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md hover:bg-emerald-100 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>PNG</span>
                    </button>
                  </div>
                </div>
                <div className={`${expandedChart === 'cropBar' ? 'h-96' : 'h-72'} w-full relative`}>
                  <canvas ref={cropBarRef} />
                </div>
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span>Total harvest in Metric Tonnes (MT) grouped by commodity.</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-medium">GROUP BY crop</span>
              </div>
            </div>
          )}

        {/* Chart 2: Pie chart: Crop distribution */}
        {(activeChartTab === 'all' || activeChartTab === 'crops' || expandedChart === 'cropPie') &&
          (!expandedChart || expandedChart === 'cropPie') && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Crop Distribution Share (%)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setExpandedChart(expandedChart === 'cropPie' ? null : 'cropPie')
                      }
                      title="Expand or collapse chart"
                      className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      {expandedChart === 'cropPie' ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => downloadChartAsPng(cropPieRef, 'crop_distribution_share')}
                      title="Download Chart as PNG"
                      className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md hover:bg-emerald-100 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>PNG</span>
                    </button>
                  </div>
                </div>
                <div className={`${expandedChart === 'cropPie' ? 'h-96' : 'h-72'} w-full relative`}>
                  <canvas ref={cropPieRef} />
                </div>
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span>Proportional volume breakdown showing dominant vs rotation crops.</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-medium">Share % Ratio</span>
              </div>
            </div>
          )}

        {/* Chart 3: Line chart: Year-wise production trends */}
        {(activeChartTab === 'all' || activeChartTab === 'trends' || expandedChart === 'yearlyLine') &&
          (!expandedChart || expandedChart === 'yearlyLine') && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Yearly Production & Area Trend Analysis
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setExpandedChart(expandedChart === 'yearlyLine' ? null : 'yearlyLine')
                      }
                      title="Expand or collapse chart"
                      className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      {expandedChart === 'yearlyLine' ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => downloadChartAsPng(yearlyLineRef, 'yearly_production_trends')}
                      title="Download Chart as PNG"
                      className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md hover:bg-emerald-100 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>PNG</span>
                    </button>
                  </div>
                </div>
                <div
                  className={`${expandedChart === 'yearlyLine' ? 'h-96' : 'h-72'} w-full relative`}
                >
                  <canvas ref={yearlyLineRef} />
                </div>
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span>Multi-year output trajectory compared with total cultivated area.</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-medium">GROUP BY year</span>
              </div>
            </div>
          )}

        {/* Chart 4: Bar chart: State-wise agricultural production */}
        {(activeChartTab === 'all' || activeChartTab === 'states' || expandedChart === 'stateBar') &&
          (!expandedChart || expandedChart === 'stateBar') && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      State-wise Agricultural Production Ranking
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setExpandedChart(expandedChart === 'stateBar' ? null : 'stateBar')
                      }
                      title="Expand or collapse chart"
                      className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      {expandedChart === 'stateBar' ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => downloadChartAsPng(stateBarRef, 'state_production_ranking')}
                      title="Download Chart as PNG"
                      className="flex items-center gap-1 text-[11px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md hover:bg-teal-100 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>PNG</span>
                    </button>
                  </div>
                </div>
                <div
                  className={`${expandedChart === 'stateBar' ? 'h-96' : 'h-72'} w-full relative`}
                >
                  <canvas ref={stateBarRef} />
                </div>
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span>Ranked state harvest volume in Metric Tonnes across active filters.</span>
                <span className="font-mono text-teal-700 dark:text-teal-400 font-medium">GROUP BY state</span>
              </div>
            </div>
          )}

        {/* Chart 5: Scatter plot: Area versus production */}
        {(activeChartTab === 'all' || activeChartTab === 'efficiency' || expandedChart === 'scatter') &&
          (!expandedChart || expandedChart === 'scatter') && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <ScatterChart className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Scatter Plot: Cultivated Area vs Production
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setExpandedChart(expandedChart === 'scatter' ? null : 'scatter')
                      }
                      title="Expand or collapse chart"
                      className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      {expandedChart === 'scatter' ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => downloadChartAsPng(scatterRef, 'area_vs_production_scatter')}
                      title="Download Chart as PNG"
                      className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md hover:bg-emerald-100 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>PNG</span>
                    </button>
                  </div>
                </div>
                <div className={`${expandedChart === 'scatter' ? 'h-96' : 'h-72'} w-full relative`}>
                  <canvas ref={scatterRef} />
                </div>
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span>Higher dots denote higher yield efficiency per cultivated hectare.</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-medium">Yield = (Prod / Area)</span>
              </div>
            </div>
          )}

        {/* Chart 6: Top 10 highest-producing crops */}
        {(activeChartTab === 'all' || activeChartTab === 'efficiency' || expandedChart === 'top10Bar') &&
          (!expandedChart || expandedChart === 'top10Bar') && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Top 10 Highest-Producing Crops
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setExpandedChart(expandedChart === 'top10Bar' ? null : 'top10Bar')
                      }
                      title="Expand or collapse chart"
                      className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      {expandedChart === 'top10Bar' ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => downloadChartAsPng(top10BarRef, 'top_10_highest_crops')}
                      title="Download Chart as PNG"
                      className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md hover:bg-amber-100 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>PNG</span>
                    </button>
                  </div>
                </div>
                <div className={`${expandedChart === 'top10Bar' ? 'h-96' : 'h-72'} w-full relative`}>
                  <canvas ref={top10BarRef} />
                </div>
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span>Top 10 commodity volumes along with their average yield indices.</span>
                <span className="font-mono text-amber-700 dark:text-amber-400 font-medium">ORDER BY + LIMIT 10</span>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
