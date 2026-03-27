import React, { useState } from 'react';
import { Users, PieChart as PieChartIcon, Download, Search, Filter, UserCheck, UserMinus, UserPlus } from 'lucide-react';
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

const allocationData = [
  { name: 'Billable', value: 180, color: '#0ea5e9' },
  { name: 'Non-Billable', value: 30, color: '#6366f1' },
  { name: 'Bench', value: 21, color: '#f43f5e' },
];

const deptAllocation = [
  { name: 'Eng', billable: 85, nonBillable: 10, bench: 5 },
  { name: 'Prod', billable: 20, nonBillable: 2, bench: 2 },
  { name: 'Design', billable: 15, nonBillable: 2, bench: 1 },
  { name: 'Sales', billable: 25, nonBillable: 5, bench: 2 },
];

const ResourceDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
  }, []);

  const handleExport = () => {
    if (currentUser?.role === 'Team Lead' || currentUser?.role?.toLowerCase() === 'hr') {
      alert(`Unauthorized: ${currentUser.role}s cannot download reports.`);
      return;
    }
    exportToCSV(allocationData, 'Resource_Allocation_Report.csv');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" id="resource-dashboard-content">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
            Resource Allocation Dashboard
          </h1>
          <p className="text-slate-400 mt-2 font-bold tracking-wide">Real-time overview of workforce distribution and utilization.</p>
        </div>
        {currentUser?.role !== 'Team Lead' && currentUser?.role?.toLowerCase() !== 'hr' && (
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-black text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-xl group w-full md:w-auto"
          >
            <Download className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
            EXPORT CSV
          </button>
        )}
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20"><UserCheck className="w-4 h-4" /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Utilization Rate</p>
          </div>
          <h3 className="text-3xl font-black text-white tracking-tight">82.4%</h3>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20"><UserPlus className="w-4 h-4" /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Billable Resources</p>
          </div>
          <h3 className="text-3xl font-black text-white tracking-tight">180</h3>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20"><UserMinus className="w-4 h-4" /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bench Resources</p>
          </div>
          <h3 className="text-3xl font-black text-white tracking-tight">21</h3>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20"><Users className="w-4 h-4" /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Workforce</p>
          </div>
          <h3 className="text-3xl font-black text-white tracking-tight">231</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Allocation Breakdown */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
          <h3 className="text-xl font-black text-white mb-8 tracking-tight">Workforce Distribution</h3>
          <div className="h-[300px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    color: '#f1f5f9'
                  }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Wise Allocation */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-100 mb-8">Departmental Allocation</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptAllocation}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
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
                <Legend />
                <Bar dataKey="billable" stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} name="Billable" />
                <Bar dataKey="nonBillable" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} name="Non-Billable" />
                <Bar dataKey="bench" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Bench" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDashboard;
