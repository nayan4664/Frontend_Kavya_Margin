import React, { useState } from 'react';
import { Activity, Download, TrendingDown, AlertTriangle, Zap, Clock, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { exportToCSV } from '../../utils/exportUtils';

const burnData = [
  { day: 'Day 1', burn: 12000, projected: 12000 },
  { day: 'Day 5', burn: 15000, projected: 14000 },
  { day: 'Day 10', burn: 18000, projected: 16000 },
  { day: 'Day 15', burn: 22000, projected: 18000 },
  { day: 'Day 20', burn: 25000, projected: 20000 },
  { day: 'Day 25', burn: 29000, projected: 22000 },
  { day: 'Day 30', burn: 34000, projected: 24000 },
];

const BurnRate = () => {
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
  }, []);

  const navigate = useNavigate();
  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const handleActionClick = (action) => {
    if (currentUser?.role === 'Team Lead' || currentUser?.role === 'Viewers' || currentUser?.role?.toLowerCase() === 'hr') {
      alert(`Unauthorized: ${currentUser.role}s cannot perform this action.`);
      return;
    }
    if (action.label === 'Resource Swap') {
      navigate('/bench-management/reallocation-suggestions');
    } else {
      alert(`Mitigation Action "${action.label}" initiated.\nExpected impact: ${action.impact}`);
    }
  };

  const handleExport = () => {
    if (currentUser?.role === 'Team Lead' || currentUser?.role === 'Viewers' || currentUser?.role?.toLowerCase() === 'hr') {
      alert(`Unauthorized: ${currentUser.role}s cannot download reports.`);
      return;
    }
    exportToCSV(burnData, 'Burn_Rate_Analysis.csv');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500" id="burn-rate-content">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <IndianRupee className="w-8 h-8 text-primary-600" />
            Burn Rate Analysis
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Track daily expenditure velocity to prevent budget overruns.</p>
        </div>
        {currentUser?.role !== 'Team Lead' && currentUser?.role !== 'Viewers' && currentUser?.role?.toLowerCase() !== 'hr' && (
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </header>

      {/* Burn Velocity Chart */}
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm transition-all">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Cumulative Burn Velocity</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">Current month expenditure trajectory</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded-full" />
              <span className="text-rose-500">Actual Burn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-800 rounded-full" />
              <span className="text-slate-400">Projected</span>
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={burnData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} 
                tickFormatter={(val) => `₹${val/1000}k`}
              />
              <Tooltip 
                cursor={{stroke: '#1e293b', strokeWidth: 1}}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  backgroundColor: '#0f172a',
                  color: '#f8fafc'
                }}
                formatter={(val) => [formatCurrency(val), '']}
              />
              <Line type="monotone" dataKey="projected" stroke="#334155" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="burn" stroke="#f43f5e" strokeWidth={4} dot={{r: 6, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff'}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Insights */}
        <div className={`${currentUser?.role === 'Team Lead' ? 'lg:col-span-3' : 'lg:col-span-2'} grid grid-cols-1 md:grid-cols-2 gap-6`}>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Clock className="w-16 h-16 text-rose-600" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Runway Remaining</p>
            <h3 className="text-3xl font-black text-slate-100 mt-2">12 Days</h3>
            <p className="text-xs text-rose-500 font-bold mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Critical: Burn exceeding budget by 14%
            </p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Zap className="w-16 h-16 text-primary-600" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Burn Rate</p>
            <h3 className="text-3xl font-black text-slate-100 mt-2">₹1,133</h3>
            <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Stabilized in last 48 hours
            </p>
          </div>
        </div>

        {/* Action Center */}
        {currentUser?.role !== 'Team Lead' && currentUser?.role !== 'Viewers' && currentUser?.role?.toLowerCase() !== 'hr' && (
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
            <h4 className="text-slate-100 font-bold text-lg mb-6">Mitigation Actions</h4>
            <div className="space-y-4">
              {[
                { label: 'Optimize Overtime', impact: 'Save ₹45k/mo', status: 'Pending' },
                { label: 'Resource Swap', impact: 'Save ₹120k/mo', status: 'Ready' },
                { label: 'Vendor Negotiation', impact: 'Save ₹15k/mo', status: 'In Progress' }
              ].map((action, i) => (
                <div 
                  key={i} 
                  onClick={() => handleActionClick(action)}
                  className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-200">{action.label}</span>
                    <span className="text-[10px] font-black text-primary-400 uppercase">{action.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">{action.impact}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BurnRate;
