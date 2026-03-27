import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Activity,
  Briefcase,
  BrainCircuit,
  FileText,
  Receipt,
  ShieldCheck,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  Building2,
  ArrowRight,
  BarChart3,
  PieChart,
  IndianRupee
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { dashboardAPI } from '../../services/api';
import { useDashboard } from '../../context/DashboardContext';

const StatCard = ({ title, value, change, icon: Icon, trend, color, isDarkMode }) => (
  <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all duration-300 group ${
    isDarkMode 
      ? 'bg-slate-900/40 border-slate-800/50 shadow-lg hover:shadow-blue-500/5 hover:border-blue-500/30' 
      : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200'
  }`}>
    <div className="flex items-start justify-between">
      <div className="space-y-3 md:space-y-4 w-full">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'} ${color}`}>
            <Icon className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{title}</p>
        </div>
        <h3 className={`text-2xl md:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
        <div className="flex items-center flex-wrap gap-2">
          <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold ${
            trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}%
          </div>
          <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-tighter ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>vs prev month</span>
        </div>
      </div>
    </div>
  </div>
);

const ModuleCard = ({ label, status, value, icon: Icon, color, link, isDarkMode }) => (
  <Link to={link} className="block group">
    <div className={`backdrop-blur-xl border p-6 rounded-[1.5rem] md:rounded-[2rem] hover:border-blue-500/50 transition-all duration-500 shadow-2xl h-full flex flex-col ${
      isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ${
          isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'
        } ${color}`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className={`px-2 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${
          isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-gray-50 border-gray-100 text-slate-500'
        }`}>
          {status}
        </div>
      </div>
      <h3 className={`text-sm md:text-base font-black mb-1 group-hover:text-blue-500 transition-colors ${
        isDarkMode ? 'text-slate-100' : 'text-slate-900'
      }`}>{label}</h3>
      <div className={`text-lg md:text-xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
        {value}
      </div>
      <div className="mt-auto flex items-center gap-2 text-[8px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest">
        View Details
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Link>
);

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const { lastUpdated } = useDashboard();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      setIsRefreshing(true);
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [lastUpdated]);

  const refreshData = () => {
    fetchStats();
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  const { kpis, moduleInsights } = stats;

  const iconMap = {
    'Organization': Building2,
    'Employee Cost': Users,
    'Billing': IndianRupee,
    'Bench Management': Briefcase,
    'Contract Analyzer': FileText,
    'AI Prediction': BrainCircuit,
    'Invoicing': Receipt,
    'Margin Tracker': BarChart3,
    'Resource Allocation': PieChart,
    'Revenue Forecast': TrendingUp
  };

  const linkMap = {
    'Organization': '/organization/company-setup',
    'Employee Cost': '/employee-cost/list',
    'Billing': '/billing/rate-config',
    'Bench Management': '/bench-management/list',
    'Contract Analyzer': '/contract-analyzer/insights',
    'AI Prediction': '/ai-prediction/forecast-insights',
    'Invoicing': '/invoicing/list',
    'Margin Tracker': '/margin-tracker/dashboard',
    'Resource Allocation': '/resource-allocation/dashboard',
    'Revenue Forecast': '/revenue-forecast/dashboard'
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black tracking-tight flex flex-wrap items-center gap-4 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Enterprise Dashboard
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-xs font-black uppercase tracking-widest text-blue-500 animate-pulse">Live</span>
            </div>
          </h1>
          <p className="text-slate-400 mt-2 font-bold tracking-wide text-sm md:text-base">Real-time resource allocation & margin intelligence</p>
        </div>
        <button 
          onClick={refreshData}
          disabled={isRefreshing}
          className={`flex items-center justify-center gap-2.5 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-black text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-xl group w-full md:w-auto ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <RefreshCcw className={`w-4 h-4 text-blue-500 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          {isRefreshing ? 'REFRESHING...' : 'REFRESH DATA'}
        </button>
      </header>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Total Portfolio Margin" 
          value={kpis.totalMargin} 
          change="8.4" 
          trend="up" 
          icon={TrendingUp}
          color="text-blue-400"
          isDarkMode={isDarkMode}
        />
        <StatCard 
          title="Operational Cost" 
          value={kpis.operationalCost} 
          change="2.1" 
          trend="down" 
          icon={TrendingDown}
          color="text-rose-400"
          isDarkMode={isDarkMode}
        />
        <StatCard 
          title="Resource Utilization" 
          value={kpis.utilization} 
          change="5.6" 
          trend="up" 
          icon={Activity}
          color="text-emerald-400"
          isDarkMode={isDarkMode}
        />
        <StatCard 
          title="Project Success Rate" 
          value={kpis.successRate} 
          change="0.4" 
          trend="up" 
          icon={ShieldCheck}
          color="text-purple-400"
          isDarkMode={isDarkMode}
        />
      </div>

      <div className="space-y-6 md:space-y-10">
        {/* Module Quick Links Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`text-xl md:text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Module Insights</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Real-time status across all systems</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {moduleInsights.map((module, index) => (
              <ModuleCard 
                key={index}
                label={module.label}
                status={module.status}
                value={module.value}
                icon={iconMap[module.label] || ShieldCheck}
                color={module.color}
                link={linkMap[module.label] || '#'}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;