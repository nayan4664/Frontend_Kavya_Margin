import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Target, 
  Zap, 
  Calendar,
  Info,
  BrainCircuit
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

const predictionData = [
  { month: 'Jan', actual: 18.5, predicted: 18.5 },
  { month: 'Feb', actual: 19.2, predicted: 19.0 },
  { month: 'Mar', actual: 20.1, predicted: 19.8 },
  { month: 'Apr', actual: 19.5, predicted: 20.5 },
  { month: 'May', predicted: 21.2 },
  { month: 'Jun', predicted: 22.5 },
  { month: 'Jul', predicted: 23.8 },
];

const MarginPrediction = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState('Q3 2026');
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
  }, []);

  const handleRunSimulation = () => {
    if (currentUser?.role === 'Team Lead') {
      alert('Unauthorized: Team Leads cannot run simulations.');
      return;
    }
    setIsSimulating(true);
    // Mock simulation delay
    setTimeout(() => {
      setIsSimulating(false);
      alert('AI Simulation completed! Forecast updated based on latest resource allocation and market trends.');
    }, 2000);
  };

  const handleQuarterChange = () => {
    const quarters = ['Q3 2026', 'Q4 2026', 'Q1 2027', 'Q2 2027'];
    const currentIndex = quarters.indexOf(selectedQuarter);
    const nextIndex = (currentIndex + 1) % quarters.length;
    setSelectedQuarter(quarters[nextIndex]);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
            Margin Prediction
          </h1>
          <p className="text-slate-400 mt-2 font-bold tracking-wide">AI-driven margin forecasts and performance projections.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleQuarterChange}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-black text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-xl w-full sm:w-auto"
          >
            <Calendar className="w-4 h-4 text-blue-500" />
            {selectedQuarter}
          </button>
          <button 
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className={`flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-sm font-black text-white transition-all shadow-xl shadow-blue-500/20 w-full sm:w-auto ${isSimulating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <Zap className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'SIMULATING...' : 'RUN SIMULATION'}
          </button>
        </div>
      </header>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500 cursor-pointer">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
            <Target className="w-16 h-16 text-blue-500" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Projected Q3 Margin</p>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white tracking-tight">23.8%</h3>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +2.4%
            </span>
          </div>
          <p className="mt-2 text-xs font-bold text-slate-500 tracking-wide">Confidence Score: 94.2%</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-500 cursor-pointer">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
            <TrendingUp className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Revenue Forecast</p>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white tracking-tight">₹42.8M</h3>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +5.1%
            </span>
          </div>
          <p className="mt-2 text-xs font-bold text-slate-500 tracking-wide">Growth Trajectory: Aggressive</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500 cursor-pointer sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
            <BrainCircuit className="w-16 h-16 text-purple-500" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Risk Assessment</p>
          <div className="mt-4 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white tracking-tight">Low</h3>
            <span className="text-xs font-bold text-blue-500 px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20">Stable</span>
          </div>
          <p className="mt-2 text-xs font-bold text-slate-500 tracking-wide">3 potential volatility drivers identified</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forecast Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Margin Forecast Trend</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Actual vs Predicted performance comparison</p>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                  dx={-10}
                  unit="%"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    padding: '12px'
                  }} 
                />
                <Legend iconType="circle" />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#0ea5e9" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#0f172a' }}
                  name="Actual Margin"
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#475569" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#475569', strokeWidth: 1, stroke: '#0f172a' }}
                  name="AI Prediction"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prediction Drivers */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-100 mb-6">Key Prediction Drivers</h3>
          <div className="space-y-6">
            {[
              { label: 'Resource Utilization', impact: '+1.4%', desc: 'Expected increase in billable hours' },
              { label: 'Project Portfolio Mix', impact: '+0.8%', desc: 'Shift towards high-margin offshore projects' },
              { label: 'Currency Volatility', impact: '-0.3%', desc: 'Predicted INR-USD fluctuations' },
              { label: 'Bench Cost reduction', impact: '+0.5%', desc: 'Scheduled project ramp-ups' }
            ].map((driver, i) => (
              <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 group hover:border-blue-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-200">{driver.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${driver.impact.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                    {driver.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">{driver.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 flex gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
            <p className="text-[11px] text-blue-300 font-medium leading-relaxed">
              Predictions are generated using historical data from the past 24 months and current project pipelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarginPrediction;