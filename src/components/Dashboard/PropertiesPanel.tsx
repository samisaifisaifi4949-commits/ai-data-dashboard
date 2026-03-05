import React from 'react';
import { X, Settings2, Trash2, ChevronDown, Palette, Type, Layout } from 'lucide-react';
import { ChartConfig, DataColumn } from '../../types';

interface PropertiesPanelProps {
  selectedChart: ChartConfig | null;
  columns: DataColumn[];
  onUpdate: (config: ChartConfig) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedChart, 
  columns, 
  onUpdate, 
  onDelete,
  onClose 
}) => {
  if (!selectedChart) return null;

  const handleUpdate = (updates: Partial<ChartConfig>) => {
    onUpdate({ ...selectedChart, ...updates });
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <Settings2 size={20} />
          <h3 className="font-bold">Chart Properties</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Basic Info */}
        <section>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Chart Title</label>
          <input 
            type="text" 
            value={selectedChart.title}
            onChange={(e) => handleUpdate({ title: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
          />
        </section>

        {/* Data Mapping */}
        <section className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Data Mapping</label>
          
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">X-Axis (Category)</label>
            <select 
              value={selectedChart.xAxis}
              onChange={(e) => handleUpdate({ xAxis: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
            >
              {columns.map(col => (
                <option key={col.name} value={col.name}>{col.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Y-Axis (Value)</label>
            <select 
              value={selectedChart.yAxis}
              onChange={(e) => handleUpdate({ yAxis: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
            >
              {columns.filter(c => c.type === 'number').map(col => (
                <option key={col.name} value={col.name}>{col.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Aggregation</label>
            <div className="grid grid-cols-3 gap-2">
              {['sum', 'avg', 'count'].map((agg) => (
                <button
                  key={agg}
                  onClick={() => handleUpdate({ aggregation: agg as any })}
                  className={`
                    py-2 rounded-lg border-2 text-[10px] font-black uppercase transition-all
                    ${selectedChart.aggregation === agg ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}
                  `}
                >
                  {agg}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Styling */}
        <section className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Styling</label>
          
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Palette size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Show Legend</span>
            </div>
            <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Layout size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Grid Lines</span>
            </div>
            <div className="w-10 h-5 bg-slate-200 rounded-full relative">
              <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
        </section>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <button 
          onClick={() => onDelete(selectedChart.id)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-rose-100 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
        >
          <Trash2 size={16} />
          <span>Delete Chart</span>
        </button>
      </div>
    </aside>
  );
};
