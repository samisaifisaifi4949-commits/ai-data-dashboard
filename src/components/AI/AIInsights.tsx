import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import { AIInsight } from '../../types';

interface AIInsightsProps {
  insights: AIInsight[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {insights.map((insight, i) => (
        <div 
          key={i} 
          className={`
            p-4 rounded-xl border flex gap-3
            ${insight.type === 'positive' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 
              insight.type === 'negative' ? 'bg-rose-50 border-rose-100 text-rose-900' : 
              insight.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-900' : 
              'bg-indigo-50 border-indigo-100 text-indigo-900'}
          `}
        >
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center shrink-0
            ${insight.type === 'positive' ? 'bg-emerald-100 text-emerald-600' : 
              insight.type === 'negative' ? 'bg-rose-100 text-rose-600' : 
              insight.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
              'bg-indigo-100 text-indigo-600'}
          `}>
            {insight.type === 'positive' ? <TrendingUp size={18} /> : 
             insight.type === 'negative' ? <TrendingDown size={18} /> : 
             insight.type === 'warning' ? <AlertTriangle size={18} /> : 
             <Lightbulb size={18} />}
          </div>
          <div>
            <h4 className="text-sm font-bold mb-1">{insight.title}</h4>
            <p className="text-xs opacity-80 leading-relaxed font-medium">{insight.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
