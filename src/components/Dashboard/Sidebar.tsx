import React from 'react';
import { 
  Activity, 
  BarChart, 
  LineChart, 
  PieChart, 
  LayoutGrid, 
  Table as TableIcon,
  ScatterChart,
  Waves,
  Filter,
  Palette,
  Type,
  Maximize2
} from 'lucide-react';
import { ChartType } from '../../types';

interface SidebarProps {
  onAddChart: (type: ChartType) => void;
  activeTheme: string;
  onThemeChange: (theme: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddChart, activeTheme, onThemeChange }) => {
  const chartTypes: { id: ChartType, label: string, icon: any }[] = [
    { id: 'kpi', label: 'KPI Card', icon: Activity },
    { id: 'bar', label: 'Bar Chart', icon: BarChart },
    { id: 'line', label: 'Line Chart', icon: LineChart },
    { id: 'area', label: 'Area Chart', icon: LayoutGrid },
    { id: 'pie', label: 'Pie Chart', icon: PieChart },
    { id: 'donut', label: 'Donut Chart', icon: PieChart },
  ];

  const themes = [
    { id: 'corporate', label: 'Corporate Blue', color: 'bg-blue-600' },
    { id: 'dark', label: 'Modern Dark', color: 'bg-slate-900' },
    { id: 'minimal', label: 'Minimal White', color: 'bg-white border border-slate-200' },
    { id: 'finance', label: 'Finance Green', color: 'bg-emerald-600' },
    { id: 'creative', label: 'Creative Gradient', color: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Chart Types</h3>
        <div className="grid grid-cols-2 gap-3">
          {chartTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => onAddChart(t.id)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
            >
              <t.icon size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <span className="text-[10px] font-bold uppercase text-slate-500 group-hover:text-indigo-600">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-b border-slate-100">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Themes</h3>
        <div className="space-y-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`
                w-full flex items-center gap-3 p-2 rounded-xl border-2 transition-all
                ${activeTheme === t.id ? 'border-indigo-600 bg-indigo-50' : 'border-transparent hover:bg-slate-50'}
              `}
            >
              <div className={`w-8 h-8 rounded-lg shadow-sm ${t.color}`} />
              <span className="text-sm font-bold text-slate-700">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 flex-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Global Filters</h3>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Filter size={14} />
              <span className="text-[10px] font-bold uppercase">Date Range</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-indigo-600" />
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Palette size={14} />
              <span className="text-[10px] font-bold uppercase">Color Palette</span>
            </div>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-full h-4 rounded bg-indigo-500" style={{ opacity: 1 - i*0.15 }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm">
          <Maximize2 size={16} />
          <span>Full Screen</span>
        </button>
      </div>
    </aside>
  );
};
