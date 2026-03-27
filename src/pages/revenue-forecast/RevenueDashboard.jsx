import React, { useState, useEffect } from "react";
import { TrendingUp, Download, Filter, IndianRupee, PieChart, BarChart3, Target, RotateCcw } from "lucide-react";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

import { exportToCSV, exportToXML } from "../../utils/exportUtils";
import { forecastAPI } from "../../services/api";

const RevenueDashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const response = await forecastAPI.getRevenue();
      setRevenueData(response.data);
    } catch (err) {
      console.error("Error fetching revenue data:", err);
    } finally {
      setLoading(false);
    }
  };

  /* FILTER DATA */
  const filteredData = revenueData.filter((item) => {
    const monthMatch = selectedMonth === "All" || item.month === selectedMonth;
    const yearMatch = selectedYear === "All" || item.year === Number(selectedYear);
    return monthMatch && yearMatch;
  });

  /* KPI CALCULATIONS */
  const totalBacklog = filteredData.reduce((acc, item) => acc + item.confirmed, 0);
  const pipeline = filteredData.reduce((acc, item) => acc + item.weighted, 0);
  const avgRevenue = filteredData.length > 0 ? totalBacklog / filteredData.length : 0;

  /* CURRENCY FORMATTER */
  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  const handleExport = (type) => {
    if (currentUser?.role === 'Team Lead' || currentUser?.role?.toLowerCase() === 'hr' || currentUser?.role === 'Project Manager') {
      alert(`Unauthorized: ${currentUser.role}s cannot download reports.`);
      return;
    }
    if (type === 'CSV') exportToCSV(revenueData, 'Revenue_Forecast.csv');
    else exportToXML(revenueData, 'Revenue_Forecast.xml', 'RevenueForecast');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <IndianRupee className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
            Revenue Forecast
          </h1>
          <p className="text-slate-400 mt-2 font-bold tracking-wide">Predictive analysis of future revenue streams and margin expectations.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {currentUser?.role !== 'Team Lead' && currentUser?.role?.toLowerCase() !== 'hr' && currentUser?.role !== 'Project Manager' && (
            <button 
              onClick={() => handleExport('CSV')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-black text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-xl group w-full sm:w-auto"
            >
              <Download className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
              EXPORT CSV
            </button>
          )}
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] overflow-hidden backdrop-blur-xl">
        <div className="p-4 md:p-8 border-b border-slate-800/50 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-6">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
            <select
              className="bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors flex-1 md:flex-none"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="All">All Months</option>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              className="bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors flex-1 md:flex-none"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="All">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
            <button 
              onClick={() => { setSelectedMonth("All"); setSelectedYear("All"); }}
              className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold text-slate-300 transition-all flex-1 md:flex-none justify-center"
            >
              <RotateCcw className="w-4 h-4" />
              RESET
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="p-4 md:p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-slate-950/50 p-6 rounded-[1.5rem] border border-slate-800/50 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Backlog</p>
            <h3 className="text-2xl font-black text-white tracking-tight">{formatCurrency(totalBacklog)}</h3>
          </div>
          <div className="bg-slate-950/50 p-6 rounded-[1.5rem] border border-slate-800/50 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Weighted Pipeline</p>
            <h3 className="text-2xl font-black text-blue-500 tracking-tight">{formatCurrency(pipeline)}</h3>
          </div>
          <div className="bg-slate-950/50 p-6 rounded-[1.5rem] border border-slate-800/50 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Revenue / Month</p>
            <h3 className="text-2xl font-black text-emerald-500 tracking-tight">{formatCurrency(avgRevenue)}</h3>
          </div>
        </div>

        {/* Chart Area */}
        <div className="p-4 md:p-8 border-t border-slate-800/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white tracking-tight">Revenue Projection Analysis</h3>
            <div className="hidden sm:flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-[10px] font-black uppercase text-slate-500">Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-[10px] font-black uppercase text-slate-500">Pipeline</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredData}>
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
                  tickFormatter={(v) => `₹${v/100000}L`}
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
                <Bar dataKey="confirmed" name="Confirmed" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
                <Bar dataKey="weighted" name="Pipeline" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={30} />
                <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#0f172a'}} name="Target" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;