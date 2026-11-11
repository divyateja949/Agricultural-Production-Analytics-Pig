import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  MapPin,
  Terminal,
  TrendingUp,
  FileSpreadsheet,
  Presentation,
  Wheat,
  Info
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'charts'
  | 'map'
  | 'pigLab'
  | 'insights'
  | 'dataset'
  | 'presentation';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  filteredCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, filteredCount }) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'KPIs & overview metrics',
    },
    {
      id: 'charts' as ActiveTab,
      label: 'Visualizations',
      icon: BarChart3,
      description: '6 interactive Chart.js plots',
    },
    {
      id: 'map' as ActiveTab,
      label: 'India Agrimap',
      icon: MapPin,
      description: 'State production choropleth',
    },
    {
      id: 'pigLab' as ActiveTab,
      label: 'Apache Pig Analytics',
      icon: Terminal,
      description: 'LOAD, FILTER, GROUP & DAG runner',
    },
    {
      id: 'insights' as ActiveTab,
      label: 'Analytics & Insights',
      icon: TrendingUp,
      description: 'Yield efficiency & growth trends',
    },
    {
      id: 'dataset' as ActiveTab,
      label: 'Dataset & Upload',
      icon: FileSpreadsheet,
      description: 'CSV manager & table viewer',
    },
    {
      id: 'presentation' as ActiveTab,
      label: 'Viva Presentation',
      icon: Presentation,
      description: 'Academic slide deck & viva Q&A',
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-stone-900 text-stone-200 flex flex-col shrink-0 lg:min-h-[calc(100vh-65px)] border-r border-stone-800">
      <div className="p-4 border-b border-stone-800 hidden lg:block">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-emerald-600/20 text-emerald-400">
            <Wheat className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">Environment</div>
            <div className="text-xs text-stone-300 font-mono">Pig Latin 0.17 / Hadoop MR</div>
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-1.5 flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-sm transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-emerald-700 text-white font-semibold shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-200' : 'text-stone-400'}`} />
              <div className="flex-1">
                <div className="leading-tight">{item.label}</div>
                <div
                  className={`text-[11px] font-normal hidden xl:block leading-tight mt-0.5 ${
                    isActive ? 'text-emerald-100' : 'text-stone-500'
                  }`}
                >
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-stone-800 hidden lg:block text-xs text-stone-400 space-y-2.5">
        <div className="bg-stone-800/80 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-stone-400">Active Records:</span>
            <span className="text-emerald-400 font-bold">{filteredCount}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-stone-400">Engine Mode:</span>
            <span className="text-stone-300">Simulated DAG</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-stone-400">HDFS Input:</span>
            <span className="text-stone-300">CSV In-Memory</span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[11px] text-stone-400 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
          <span>
            Academic demonstration for college evaluation. Pig Latin scripts simulate MapReduce data flow client-side.
          </span>
        </div>
      </div>
    </aside>
  );
};
