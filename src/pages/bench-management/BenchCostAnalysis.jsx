import React from 'react';
import { IndianRupee, Download, TrendingUp, TrendingDown, AlertCircle, Info } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { exportToCSV } from '../../utils/exportUtils';

const benchCostTrend = [
  { month: 'Jan', cost: 1200000, benchCount: 15 },
  { month: 'Feb', cost: 1450000, benchCount: 18 },
  { month: 'Mar', cost: 1300000, benchCount: 16 },
  { month: 'Apr', cost: 1800000, benchCount: 22 },
  { month: 'May', cost: 1600000, benchCount: 20 },
  { month: 'Jun', cost: 1550000, benchCount: 19 },
];

const BenchCostAnalysis = () => {
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
  }, []);

  const handleExport = () => {
    if (currentUser?.role === 'Team Lead') {
      alert('Unauthorized: Team Leads cannot download reports.');
      return;
    }
    exportToCSV(benchCostTrend, 'Bench_Cost_Analysis.csv');
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500" id="bench-cost-content">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <IndianRupee className="w-8 h-8 text-blue-500" />
            Bench Cost Analysis
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Financial impact assessment of unallocated resources on organizational margins.</p>
        </div>
        {currentUser?.role !== 'Team Lead' && (
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </header>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingDown className="w-16 h-16 text-rose-500" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monthly Bench Leakage</p>
          <h3 className="text-3xl font-black text-rose-500 mt-2">₹15.5L</h3>
          <p className="text-xs text-slate-500 mt-2 font-medium italic">Direct salary cost of unallocated staff</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-16 h-16 text-amber-500" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Margin Impact</p>
          <h3 className="text-3xl font-black text-amber-500 mt-2">-4.2%</h3>
          <p className="text-xs text-slate-500 mt-2 font-medium italic">Reduction in overall gross margin</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recoverable Revenue</p>
          <h3 className="text-3xl font-black text-emerald-500 mt-2">₹42.8L</h3>
          <p className="text-xs text-slate-500 mt-2 font-medium italic">Potential revenue if 100% billable</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-100 mb-8">Cost Trend vs Bench Count</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={benchCostTrend}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    color: '#f1f5f9'
                  }}
                  itemStyle={{ color: '#f1f5f9' }}
                  formatter={(val, name) => [name === 'cost' ? formatCurrency(val) : val, name === 'cost' ? 'Cost' : 'Resources']}
                />
                <Area type="monotone" dataKey="cost" stroke="#f43f5e" fill="url(#colorCost)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-100 mb-8">Bench Count per Month</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchCostTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    color: '#f1f5f9'
                  }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="benchCount" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Bench Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 p-6 rounded-2xl border border-blue-500/20 flex gap-4">
        <Info className="w-6 h-6 text-blue-400 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-blue-100">Cost Optimization Recommendation</h4>
          <p className="text-xs text-blue-300 mt-1 leading-relaxed font-medium">
            Bench costs peaked in April due to project closures. A 12% reduction is projected for July following the scheduled ramp-up of the "Global Billing" project.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BenchCostAnalysis;
