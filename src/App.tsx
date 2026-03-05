import React from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Settings, 
  Share2, 
  Download, 
  Sparkles, 
  Bot, 
  Database,
  ChevronLeft,
  LayoutGrid,
  Search,
  Zap,
  Trash2,
  Users,
  History,
  Info,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Joyride, { Step } from 'react-joyride';
import { io, Socket } from 'socket.io-client';
import { LandingPage } from './components/Landing/LandingPage';
import { ModeSelection } from './components/Upload/ModeSelection';
import { Sidebar } from './components/Dashboard/Sidebar';
import { PropertiesPanel } from './components/Dashboard/PropertiesPanel';
import { FileUpload } from './components/Upload/FileUpload';
import { ChartRenderer } from './components/Dashboard/ChartRenderer';
import { AddChartModal } from './components/Dashboard/AddChartModal';
import { AIInsights } from './components/AI/AIInsights';
import { AIChat } from './components/AI/AIChat';
import { DataRow, DataColumn, ChartConfig, AIInsight, User, VersionHistory, ChartType } from './types';
import { analyzeData, analyzeDashboardScreenshot } from './services/gemini';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

export default function App() {
  const [data, setData] = React.useState<DataRow[] | null>(null);
  const [columns, setColumns] = React.useState<DataColumn[]>([]);
  const [fileName, setFileName] = React.useState('');
  const [charts, setCharts] = React.useState<ChartConfig[]>([]);
  const [insights, setInsights] = React.useState<AIInsight[]>([]);
  const [summary, setSummary] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [view, setView] = React.useState<'landing' | 'upload' | 'mode-selection' | 'dashboard'>('landing');
  const [dashboardMode, setDashboardMode] = React.useState<'ai' | 'custom' | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [showDataPreview, setShowDataPreview] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedChartId, setSelectedChartId] = React.useState<string | null>(null);
  const [activeTheme, setActiveTheme] = React.useState('corporate');

  // Collaboration State
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [collaborators, setCollaborators] = React.useState<User[]>([]);
  const [versionHistory, setVersionHistory] = React.useState<VersionHistory[]>([]);
  const [showHistory, setShowHistory] = React.useState(false);
  const [currentUser] = React.useState<User>(() => ({
    id: Math.random().toString(36).substr(2, 9),
    name: `User ${Math.floor(Math.random() * 1000)}`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]
  }));

  // Onboarding State
  const [runTour, setRunTour] = React.useState(false);
  const tourSteps: Step[] = [
    {
      target: '.upload-section',
      content: 'Start by uploading your data here. We support CSV and Excel files.',
      disableBeacon: true,
    },
    {
      target: '.ai-insights-section',
      content: 'Once uploaded, AI will automatically analyze your data and provide key insights here.',
    },
    {
      target: '.charts-grid-section',
      content: 'Your dashboard charts will appear here. You can search, filter, and delete them.',
    },
    {
      target: '.add-chart-btn',
      content: 'Want more? Manually add custom charts with specific aggregations and axes.',
    },
    {
      target: '.ask-ai-btn',
      content: 'Chat with our AI Assistant to ask questions about your data or get design suggestions.',
    },
    {
      target: '.export-btn',
      content: 'Finally, export your dashboard as a PDF or share it with your team!',
    }
  ];

  React.useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('room-state', (state) => {
      setCollaborators(state.users);
      setVersionHistory(state.versionHistory);
    });

    newSocket.on('charts-updated', (updatedCharts) => {
      setCharts(updatedCharts);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (view === 'dashboard' && socket) {
      socket.emit('join-room', { roomId: 'default-room', user: currentUser });
    }
  }, [view, socket, currentUser]);

  const updateCharts = (newCharts: ChartConfig[]) => {
    setCharts(newCharts);
    if (socket) {
      socket.emit('update-charts', { roomId: 'default-room', charts: newCharts });
    }
  };

  const handleDataLoaded = async (newData: DataRow[], newColumns: DataColumn[], name: string) => {
    setData(newData);
    setColumns(newColumns);
    setFileName(name);
    setView('mode-selection');
  };

  const handleModeSelect = async (mode: 'ai' | 'custom') => {
    setDashboardMode(mode);
    setLoading(true);
    setView('dashboard');
    setRunTour(true);

    if (mode === 'ai') {
      try {
        const analysis = await analyzeData(data!.slice(0, 10), columns);
        setInsights(analysis.insights || []);
        setSummary(analysis.summary || '');
        
        const suggestedCharts: ChartConfig[] = (analysis.suggestedCharts || []).map((c: any, i: number) => ({
          id: `chart-${Date.now()}-${i}`,
          type: c.type as any,
          title: c.title,
          xAxis: c.xAxis,
          yAxis: c.yAxis,
          aggregation: c.aggregation,
          layout: { w: 1, h: 1, x: 0, y: 0 }
        }));
        
        updateCharts(suggestedCharts);
      } catch (err) {
        console.error('AI Analysis failed:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      updateCharts([]);
    }
  };

  const handleAddChart = (type: ChartType) => {
    const newChart: ChartConfig = {
      id: `chart-${Date.now()}`,
      type,
      title: `New ${type.toUpperCase()} Chart`,
      xAxis: columns[0]?.name || '',
      yAxis: columns.find(c => c.type === 'number')?.name || columns[0]?.name || '',
      aggregation: 'sum',
      layout: { w: 1, h: 1, x: 0, y: 0 }
    };
    updateCharts([...charts, newChart]);
    setSelectedChartId(newChart.id);
  };

  const [isScreenshotLoading, setIsScreenshotLoading] = React.useState(false);

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScreenshotLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const result = await analyzeDashboardScreenshot(base64);
        // For now, just alert the suggestion or add a dummy chart based on it
        console.log('Screenshot Analysis:', result);
        alert('AI analyzed your screenshot and suggested a new layout! (Check console for details)');
      } catch (err) {
        console.error('Screenshot analysis failed:', err);
      } finally {
        setIsScreenshotLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setData(null);
    setColumns([]);
    setCharts([]);
    setInsights([]);
    setView('landing');
    setDashboardMode(null);
    setRunTour(false);
  };

  const selectedChart = charts.find(c => c.id === selectedChartId) || null;

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('upload')} />;
  }

  return (
    <div className={`min-h-screen ${activeTheme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} font-sans flex flex-col`}>
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        styles={{
          options: {
            primaryColor: '#6366f1',
          },
        }}
      />

      {/* Header */}
      <header className={`${activeTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={reset} className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <LayoutDashboard size={24} />
            </button>
            <div>
              <h1 className="text-lg font-bold tracking-tight">DataDash AI</h1>
              <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-500">Smart Dashboard Maker</p>
            </div>
          </div>

          {view === 'dashboard' && (
            <div className="flex items-center gap-4">
              {/* Collaborators */}
              <div className="flex -space-x-2 mr-4">
                {collaborators.map((u) => (
                  <div 
                    key={u.socketId} 
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: u.color }}
                    title={u.name}
                  >
                    {u.name.charAt(0)}
                  </div>
                ))}
                {collaborators.length > 0 && (
                  <div className="ml-2 flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <Users size={12} />
                    <span>{collaborators.length} Online</span>
                  </div>
                )}
              </div>

              <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'} rounded-lg border`}>
                <Database size={14} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-600 truncate max-w-[150px]">{fileName}</span>
              </div>
              <div className="h-6 w-px bg-slate-200 mx-2" />
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
                title="Version History"
              >
                <History size={20} />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500" title="Share Dashboard">
                <Share2 size={20} />
              </button>
              <button 
                onClick={() => {
                  // Manual save trigger (already handled by real-time updates)
                  // But we show a feedback for the user
                  const btn = document.getElementById('save-btn');
                  if (btn) {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = 'Saved!';
                    btn.classList.add('bg-emerald-600');
                    btn.classList.remove('bg-indigo-600');
                    setTimeout(() => {
                      btn.innerHTML = originalText;
                      btn.classList.remove('bg-emerald-600');
                      btn.classList.add('bg-indigo-600');
                    }, 2000);
                  }
                }}
                id="save-btn"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-semibold shadow-sm"
              >
                <Save size={18} />
                <span>Save</span>
              </button>
              <button className="export-btn flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors text-sm font-semibold shadow-sm">
                <Download size={18} />
                <span>Export</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {view === 'dashboard' && dashboardMode === 'custom' && (
          <Sidebar 
            onAddChart={handleAddChart} 
            activeTheme={activeTheme}
            onThemeChange={setActiveTheme}
          />
        )}

        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {view === 'upload' ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center min-h-[70vh]"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-black text-slate-900 mb-4">Upload your data</h2>
                  <p className="text-slate-500 text-lg max-w-xl mx-auto">
                    We support .xlsx, .xls, .csv, and .tsv files.
                  </p>
                </div>
                <div className="upload-section w-full">
                  <FileUpload onDataLoaded={handleDataLoaded} />
                </div>
              </motion.div>
            ) : view === 'mode-selection' ? (
              <motion.div
                key="mode-selection"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <ModeSelection onSelect={handleModeSelect} />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Dashboard Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setView('mode-selection')}
                      className="flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
                    >
                      <ChevronLeft size={18} />
                      <span>Back to Selection</span>
                    </button>
                    <div className="h-4 w-px bg-slate-300" />
                    <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search charts..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-10 pr-4 py-2 ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-64`}
                      />
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700 shadow-sm cursor-pointer">
                      <Zap size={18} className="text-amber-500" />
                      <span>{isScreenshotLoading ? 'Analyzing...' : 'Design from Screenshot'}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleScreenshotUpload} disabled={isScreenshotLoading} />
                    </label>
                    {dashboardMode === 'ai' && (
                      <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="add-chart-btn flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700 shadow-sm"
                      >
                        <Plus size={18} />
                        <span>Add Chart</span>
                      </button>
                    )}
                    <button 
                      onClick={() => setIsChatOpen(true)}
                      className="ask-ai-btn flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-bold shadow-sm border border-indigo-100"
                    >
                      <Sparkles size={18} />
                      <span>Ask AI</span>
                    </button>
                  </div>
                </div>

                {/* AI Insights Section */}
                <div className="ai-insights-section">
                  {insights.length > 0 && <AIInsights insights={insights} />}
                </div>

                {/* Charts Grid */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">AI is analyzing your data and building your dashboard...</p>
                  </div>
                ) : (
                  <div className="charts-grid-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {charts
                      .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((chart) => (
                      <div 
                        key={chart.id} 
                        onClick={() => setSelectedChartId(chart.id)}
                        className={`
                          ${chart.type === 'kpi' ? 'col-span-1' : 'col-span-1 md:col-span-2'}
                          h-[350px] cursor-pointer transition-all
                          ${selectedChartId === chart.id ? 'ring-2 ring-indigo-600 rounded-xl' : ''}
                        `}
                      >
                        <ChartRenderer 
                          config={chart} 
                          data={data || []} 
                          onDelete={(id) => updateCharts(charts.filter(c => c.id !== id))}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Data Preview Section */}
                <div className={`mt-12 ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border overflow-hidden shadow-sm`}>
                  <button 
                    onClick={() => setShowDataPreview(!showDataPreview)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Database size={20} className="text-indigo-600" />
                      <h3 className="font-bold">Raw Data Preview</h3>
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {data?.length} rows • {columns.length} columns
                      </span>
                    </div>
                    <ChevronLeft size={20} className={`text-slate-400 transition-transform ${showDataPreview ? '-rotate-90' : 'rotate-0'}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showDataPreview && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="overflow-x-auto border-t border-slate-100">
                          <table className="w-full text-left text-sm border-collapse">
                            <thead>
                              <tr className={`${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'} border-b`}>
                                {columns.map(col => (
                                  <th key={col.name} className="px-6 py-3 font-bold text-slate-600 whitespace-nowrap">
                                    <div className="flex flex-col">
                                      <span>{col.name}</span>
                                      <span className="text-[10px] uppercase text-indigo-400">{col.type}</span>
                                    </div>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {data?.slice(0, 50).map((row, i) => (
                                <tr key={i} className={`border-b ${activeTheme === 'dark' ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-50 hover:bg-slate-50/50'} transition-colors`}>
                                  {columns.map(col => (
                                    <td key={col.name} className="px-6 py-3 text-slate-600 whitespace-nowrap">
                                      {String(row[col.name])}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {data && data.length > 50 && (
                            <div className="p-4 text-center text-xs text-slate-400 bg-slate-50/50">
                              Showing first 50 rows of {data.length} total rows.
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {view === 'dashboard' && dashboardMode === 'custom' && selectedChartId && (
          <PropertiesPanel 
            selectedChart={selectedChart}
            columns={columns}
            onUpdate={(updated) => updateCharts(charts.map(c => c.id === updated.id ? updated : c))}
            onDelete={(id) => {
              updateCharts(charts.filter(c => c.id !== id));
              setSelectedChartId(null);
            }}
            onClose={() => setSelectedChartId(null)}
          />
        )}
      </div>

      {/* Version History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <History size={20} />
                <h3 className="font-semibold">Version History</h3>
              </div>
              <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {versionHistory.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Info size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No history yet. Changes will appear here as you edit.</p>
                </div>
              )}
              {versionHistory.map((v, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => updateCharts(v.charts)}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Revision {versionHistory.length - i}</span>
                    <span className="text-[10px] text-slate-400">{new Date(v.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-600">Restored {v.charts.length} charts</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Drawer */}
      <AIChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        dataSummary={summary} 
      />

      <AddChartModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        columns={columns}
        onAdd={(newChart) => updateCharts([...charts, newChart])}
      />

      {/* Floating Action Button for Chat */}
      {view === 'dashboard' && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-200 flex items-center justify-center hover:scale-110 transition-transform z-30"
        >
          <Sparkles size={24} />
        </button>
      )}
    </div>
  );
}
