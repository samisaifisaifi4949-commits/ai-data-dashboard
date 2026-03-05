import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { ChartConfig, DataRow } from '../../types';
import { aggregateData } from '../../utils/dataProcessor';
import { TrendingUp, Trash2 } from 'lucide-react';

interface ChartRendererProps {
  config: ChartConfig;
  data: DataRow[];
  onDelete?: (id: string) => void;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

export const ChartRenderer: React.FC<ChartRendererProps> = ({ config, data, onDelete }) => {
  const chartData = React.useMemo(() => {
    if (config.type === 'kpi') {
      const values = data.map(row => Number(row[config.yAxis]) || 0);
      let value = 0;
      if (config.aggregation === 'sum') value = values.reduce((a, b) => a + b, 0);
      else if (config.aggregation === 'avg') value = values.reduce((a, b) => a + b, 0) / values.length;
      else if (config.aggregation === 'count') value = values.length;
      return { value };
    }
    if (config.type === 'scatter') {
      return data.map(row => ({
        x: Number(row[config.xAxis]) || 0,
        y: Number(row[config.yAxis]) || 0,
        name: String(row[config.xAxis])
      })).slice(0, 100); // Limit for performance
    }
    return aggregateData(data, { xAxis: config.xAxis, yAxis: config.yAxis, aggregation: config.aggregation });
  }, [config, data]);

  if (config.type === 'kpi') {
    const value = (chartData as any).value;
    return (
      <div className="group relative flex flex-col items-center justify-center h-full p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        {onDelete && (
          <button 
            onClick={() => onDelete(config.id)}
            className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{config.title}</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-bold text-slate-900">
            {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
          <TrendingUp size={14} />
          <span>+12.5% from last month</span>
        </div>
      </div>
    );
  }

  if (config.type === 'table') {
    return (
      <div className="group relative h-full w-full p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {onDelete && (
          <button 
            onClick={() => onDelete(config.id)}
            className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all z-10"
          >
            <Trash2 size={14} />
          </button>
        )}
        <h3 className="text-sm font-semibold text-slate-800 mb-4">{config.title}</h3>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-[10px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-2 py-1 font-bold text-slate-600">{config.xAxis}</th>
                <th className="px-2 py-1 font-bold text-slate-600">{config.yAxis}</th>
              </tr>
            </thead>
            <tbody>
              {(chartData as any[]).slice(0, 10).map((row, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="px-2 py-1 text-slate-500">{row.name}</td>
                  <td className="px-2 py-1 text-slate-900 font-bold">{row.value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative h-full w-full p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
      {onDelete && (
        <button 
          onClick={() => onDelete(config.id)}
          className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all z-10"
        >
          <Trash2 size={14} />
        </button>
      )}
      <h3 className="text-sm font-semibold text-slate-800 mb-4">{config.title}</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {config.type === 'bar' ? (
            <BarChart data={chartData as any[]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : config.type === 'line' ? (
            <LineChart data={chartData as any[]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
            </LineChart>
          ) : config.type === 'area' ? (
            <AreaChart data={chartData as any[]}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          ) : config.type === 'pie' || config.type === 'donut' ? (
            <PieChart>
              <Pie
                data={chartData as any[]}
                cx="50%"
                cy="50%"
                innerRadius={config.type === 'donut' ? 60 : 0}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {(chartData as any[]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          ) : config.type === 'scatter' ? (
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" dataKey="x" name={config.xAxis} unit="" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis type="number" dataKey="y" name={config.yAxis} unit="" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <ZAxis type="number" range={[64, 144]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name={config.title} data={chartData as any[]} fill="#6366f1" />
            </ScatterChart>
          ) : null}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
