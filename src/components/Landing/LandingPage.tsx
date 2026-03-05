import React from 'react';
import { 
  BarChart3, 
  Zap, 
  Layout, 
  Share2, 
  Shield, 
  ArrowRight,
  Database,
  Sparkles,
  MousePointer2
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <BarChart3 size={24} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">DataDash AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Login</button>
            <button 
              onClick={onStart}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50 animate-pulse" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              ✨ AI-Powered Data Visualization
            </span>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
              Turn Your Data Into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Powerful Insights</span> in Seconds
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              Upload your Excel or CSV file and instantly create smart dashboards using AI or full customization. No coding required.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group"
              >
                Create Dashboard Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-lg hover:border-indigo-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Try Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 aspect-video">
              <img 
                src="https://picsum.photos/seed/dashboard/1600/900" 
                alt="Dashboard Preview" 
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 cursor-pointer hover:scale-110 transition-transform">
                  <MousePointer2 size={32} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Everything you need to visualize data</h2>
            <p className="text-slate-500 text-lg">Powerful features to help you build professional dashboards in minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Database className="text-indigo-600" />}
              title="Upload Any Data"
              description="Support for .xlsx, .xls, .csv, and .tsv files. Automatic type detection and cleaning."
            />
            <FeatureCard 
              icon={<Sparkles className="text-amber-600" />}
              title="AI-Powered Dashboard"
              description="Let Gemini AI analyze your data and automatically generate KPIs, charts, and insights."
            />
            <FeatureCard 
              icon={<Layout className="text-emerald-600" />}
              title="Full Custom Builder"
              description="Manually design your dashboard with complete control over every chart and layout."
            />
            <FeatureCard 
              icon={<Share2 className="text-blue-600" />}
              title="Share Instantly"
              description="Export as PDF, PNG, or share a live link with your team for real-time collaboration."
            />
            <FeatureCard 
              icon={<Zap className="text-violet-600" />}
              title="Fast Rendering"
              description="Built for speed. Interactive charts that respond instantly to filters and queries."
            />
            <FeatureCard 
              icon={<Shield className="text-rose-600" />}
              title="Secure & Private"
              description="Your data is processed securely and never shared. Privacy is our top priority."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <BarChart3 size={18} />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">DataDash AI</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 DataDash AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">GitHub</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{description}</p>
  </div>
);
