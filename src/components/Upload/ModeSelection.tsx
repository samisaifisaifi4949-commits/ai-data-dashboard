import React from 'react';
import { Sparkles, Layout, Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ModeSelectionProps {
  onSelect: (mode: 'ai' | 'custom') => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelect }) => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 mb-4">Choose Your Dashboard Mode</h2>
        <p className="text-slate-500 text-lg">Start with AI automation or build from scratch with full control.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AI Mode Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('ai')}
          className="group relative p-8 bg-white rounded-[2rem] border-2 border-slate-100 hover:border-indigo-600 transition-all text-left shadow-sm hover:shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:bg-indigo-600 group-hover:scale-110" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
              <Sparkles size={32} />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-slate-900">AI Auto Dashboard</h3>
            <p className="text-slate-500 mb-8 leading-relaxed group-hover:text-slate-600">
              Let AI analyze your data and automatically generate KPIs, charts, and insights in seconds.
            </p>

            <ul className="space-y-4 mb-10">
              <FeatureItem text="Auto-detect important KPIs" />
              <FeatureItem text="Smart chart selection" />
              <FeatureItem text="AI-generated summaries" />
              <FeatureItem text="Optimized layout design" />
            </ul>

            <div className="flex items-center gap-2 text-indigo-600 font-bold group-hover:translate-x-2 transition-transform">
              <span>Generate Dashboard</span>
              <ArrowRight size={20} />
            </div>
          </div>
        </motion.button>

        {/* Custom Mode Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('custom')}
          className="group relative p-8 bg-white rounded-[2rem] border-2 border-slate-100 hover:border-emerald-600 transition-all text-left shadow-sm hover:shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:bg-emerald-600 group-hover:scale-110" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-white group-hover:text-emerald-600 transition-colors">
              <Layout size={32} />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-4">Full Custom Mode</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Manually design your dashboard with complete control over every component and layout.
            </p>

            <ul className="space-y-4 mb-10">
              <FeatureItem text="Drag & drop builder" />
              <FeatureItem text="Custom axis & aggregation" />
              <FeatureItem text="Advanced filter controls" />
              <FeatureItem text="Complete design freedom" />
            </ul>

            <div className="flex items-center gap-2 text-emerald-600 font-bold group-hover:translate-x-2 transition-transform">
              <span>Start Building</span>
              <ArrowRight size={20} />
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
    <div className="w-5 h-5 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
      <Check size={12} />
    </div>
    {text}
  </li>
);
