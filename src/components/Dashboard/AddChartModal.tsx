import React from 'react';
import { X, BarChart, LineChart, PieChart, Activity, LayoutGrid } from 'lucide-react';
import { ChartType, DataColumn, ChartConfig } from '../../types';

interface AddChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: DataColumn[];
  onAdd: (config: ChartConfig) => void;
}

export const AddChartModal: React.FC<AddChartModalProps> = ({ isOpen, onClose, columns, onAdd }) => {
  const [type, setType] = React.useState<ChartType>('bar');
  const [title, setTitle] = React.useState('');
  const [xAxis, setXAxis] = React.useState(columns[0]?.name || '');
  const [yAxis, setYAxis] = React.useState(columns[0]?.name || '');
  const [aggregation, setAggregation] = React.useState<'sum' | 'avg' | 'count'>('sum');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: `chart-${Date.now()}`,
      type,
      title: title || `${type.toUpperCase()} - ${yAxis}`,
      xAxis,
      yAxis,
      aggregation,
      layout: { w: 1, h: 1, x: 0, y: 0 }
    });
    onClose();
  };

  const chartTypes: { id: ChartType, label: string, icon: any }[] = [
    { id: 'kpi', label: 'KPI Card', icon: Activity },
    { id: 'bar', label: 'Bar Chart', icon: BarChart },
    { id: 'line', label: 'Line Chart', icon: LineChart },
    { id: 'area', label: 'Area Chart', icon: LayoutGrid },
    { id: 'pie', label: 'Pie Chart', icon: PieChart },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Add New Chart</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Chart Type</label>
            <div className="grid grid-cols-3 gap-3">
              {chartTypes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                    ${type === t.id ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 hover:border-slate-200 text-slate-500'}
                  `}
                >
                  <t.icon size={20} />
                  <span className="text-[10px] font-bold uppercase">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Chart Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter chart title..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">X-Axis (Category)</label>
              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {columns.map(col => (
                  <option key={col.name} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Y-Axis (Value)</label>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {columns.filter(c => c.type === 'number').map(col => (
                  <option key={col.name} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Aggregation</label>
            <div className="flex gap-2">
              {['sum', 'avg', 'count'].map((agg) => (
                <button
                  key={agg}
                  type="button"
                  onClick={() => setAggregation(agg as any)}
                  className={`
                    flex-1 py-2 rounded-lg border-2 text-xs font-bold uppercase transition-all
                    ${aggregation === agg ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-500'}
                  `}
                >
                  {agg}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
          >
            Create Chart
          </button>
        </form>
      </div>
    </div>
  );
};
