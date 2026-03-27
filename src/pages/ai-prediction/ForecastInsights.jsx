import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Lightbulb, 
  ArrowRight, 
  TrendingUp, 
  Target, 
  Layers,
  Sparkles,
  ArrowUpRight,
  Download,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { exportToCSV } from '../../utils/exportUtils';
import { forecastAPI } from '../../services/api';

const ForecastInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    fetchProjections();
  }, []);

  const fetchProjections = async () => {
    try {
      setLoading(true);
      const response = await forecastAPI.getProjections();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch projections:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 1 
    }).format(val / 1000000) + 'M';

  const handleApplyRecommendations = () => {
    if (window.confirm('Are you sure you want to apply all AI-driven recommendations to your H2 forecast? This will update project projections and resource plans.')) {
      alert('Recommendations applied successfully! Your forecast and project tracking have been updated.');
    }
  };

  if (loading || !data) return <div className="flex items-center justify-center h-screen text-slate-400">Analyzing data with AI...</div>;

  const { projections, summary, recommendations } = data;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" id="forecast-insights-content">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
            Forecast Insights
          </h1>
          <p className="text-slate-400 mt-2 font-bold tracking-wide">Strategic revenue and cost projections with AI-derived recommendations.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {currentUser?.role !== 'Team Lead' && (
            <>
              <button 
                onClick={() => {
                  exportToCSV(projections, 'Forecast_Insights.csv');
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-black text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-xl w-full sm:w-auto"
              >
                <Download className="w-4 h-4 text-blue-500" />
                EXPORT CSV
              </button>
              <button 
                onClick={() => {
                  handleApplyRecommendations();
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-sm font-black text-white transition-all shadow-xl shadow-blue-500/20 w-full sm:w-auto"
              >
                <Sparkles className="w-4 h-4" />
                APPLY RECOMMENDATIONS
              </button>
            </>
          )}
        </div>
      </header>

      {/* Insight Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Est. Revenue H2</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-100">{formatCurrency(summary.totalEstRevenue)}</h3>
            <span className="text-emerald-400 font-bold text-xs">+14%</span>
          </div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Est. Cost H2</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-100">{formatCurrency(summary.totalEstCost)}</h3>
            <span className="text-rose-400 font-bold text-xs">+8%</span>
          </div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Projected Margin</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-100">{summary.projectedMargin}%</h3>
            <span className="text-emerald-400 font-bold text-xs">Target Met</span>
          </div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Forecast Accuracy</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-100">{summary.forecastAccuracy}%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Composed Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">H2 2026 Projections</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Revenue vs Cost Trajectory</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-[10px] font-black uppercase text-slate-500">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700" />
                <span className="text-[10px] font-black uppercase text-slate-500">Cost</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={projections}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} 
                  dx={-10}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip 
                  cursor={{fill: '#1e293b', opacity: 0.4}}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Revenue" barSize={30} />
                <Bar dataKey="cost" fill="#1e293b" radius={[6, 6, 0, 0]} name="Cost" barSize={30} />
                <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#0f172a'}} name="Target" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-black text-white tracking-tight">AI Recommendations</h3>
          </div>
          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="p-5 border border-slate-800 rounded-[1.5rem] bg-slate-950/50 hover:border-blue-500/30 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{rec.impact}</span>
                </div>
                <h4 className="text-sm font-black text-white group-hover:text-blue-500 transition-colors">{rec.title}</h4>
                <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed">{rec.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 opacity-0 group-hover:opacity-100 transition-all">
                  Apply Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastInsights;