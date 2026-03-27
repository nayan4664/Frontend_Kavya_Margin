import React from 'react';
import { PieChart as PieChartIcon, BarChart3, TrendingUp, Download, Info } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { exportToCSV } from '../../utils/exportUtils';

const deptCostData = [
  { name: 'Engineering', value: 4500000 },
  { name: 'Product', value: 1200000 },
  { name: 'Design', value: 800000 },
  { name: 'Sales', value: 1500000 },
  { name: 'HR', value: 500000 },
];

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

const monthlyTrend = [
  { month: 'Jan', cost: 1200000 },
  { month: 'Feb', cost: 1250000 },
  { month: 'Mar', cost: 1300000 },
  { month: 'Apr', cost: 1450000 },
  { month: 'May', cost: 1500000 },
  { month: 'Jun', cost: 1550000 },
];

const CostBreakdown = () => {
  const totalCost = deptCostData.reduce((acc, curr) => acc + curr.value, 0);
  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500" id="cost-breakdown-content">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3      ">
            <PieChartIcon className="w-8 h-8 text-primary-600" />
            Cost Breakdown
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Visual analysis of organizational spending and cost distribution.</p>
        </div>
        <button 
          onClick={() => exportToCSV(deptCostData, 'Cost_Breakdown_Analysis.csv')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm transition-colors">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Monthly Cost</p>
          <h3 className="text-3xl font-black text-slate-100 mt-2">{formatCurrency(totalCost / 12)}</h3>
          <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Within Budget
          </p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm transition-colors">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg. Cost Per Resource</p>
          <h3 className="text-3xl font-black text-slate-100 mt-2">{formatCurrency(85000)}</h3>
          <p className="text-xs text-slate-500 font-medium mt-2 italic">Based on 231 active resources</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm transition-colors">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Highest Spending Dept</p>
          <h3 className="text-3xl font-black text-slate-100 mt-2">Engineering</h3>
          <p className="text-xs text-slate-500 font-medium mt-2 italic">52% of total organization cost</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-slate-100 mb-8">Department-wise Distribution</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptCostData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deptCostData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#0f172a',
                    color: '#f8fafc'
                  }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-slate-100 mb-8">Monthly Cost Trend</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                  tickFormatter={(val) => `₹${val/100000}L`}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#0f172a',
                    color: '#f8fafc'
                  }}
                />
                <Bar dataKey="cost" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-primary-900/10 p-6 rounded-2xl border border-primary-900/20 flex gap-4 transition-colors">
        <Info className="w-6 h-6 text-primary-500 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-primary-400">Cost Analysis Insight</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            The 15% increase in Engineering costs in April is attributed to the Q1 hiring cycle. Current projections show stabilization for the remainder of H1.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdown;
