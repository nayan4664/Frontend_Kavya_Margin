import React, { useState } from 'react';
import { Play, RotateCcw, Download, Plus, Trash2, TrendingUp, AlertCircle } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
} from 'recharts';
import { exportToCSV } from '../../utils/exportUtils';

const ScenarioSimulator = () => {
  const initialScenarios = [
    { id: 1, name: 'Current Baseline', billingRate: 45, resources: 10, margin: 28 },
    { id: 2, name: 'High Efficiency', billingRate: 45, resources: 8, margin: 35 },
    { id: 3, name: 'Premium Billing', billingRate: 60, resources: 10, margin: 42 },
  ];

  const [scenarios, setScenarios] = useState(initialScenarios);
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
  }, []);

  const handleExport = () => {
    if (currentUser?.role === 'Team Lead') {
      alert('Unauthorized: Team Leads cannot download reports.');
      return;
    }
    exportToCSV(scenarios, 'Scenario_Analysis.csv');
  };

  const [simulation, setSimulation] = useState({
    name: 'New Scenario',
    billingRate: 50,
    resources: 12,
    utilization: 85,
  });

  const runSimulation = () => {
    // Mock calculation
    const revenue = simulation.billingRate * (160 * (simulation.utilization / 100));
    const cost = 18 * 160; // Base cost $18/hr
    const margin = revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0;
    
    const newScenario = {
      ...simulation,
      id: Date.now(),
      margin: Math.max(5, Math.min(60, margin)), // realistic range
    };
    setScenarios([...scenarios, newScenario]);
  };

  const handleReset = () => {
    setSimulation({
      name: 'New Scenario',
      billingRate: 50,
      resources: 12,
      utilization: 85,
    });
    setScenarios(initialScenarios);
    alert('Simulation parameters and scenario list have been reset.');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" id="scenario-simulator-content">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
            Scenario Simulator
          </h1>
          <p className="text-slate-400 mt-2 font-bold tracking-wide">Model "What-If" scenarios to predict the impact of rate or resource changes.</p>
        </div>
        {currentUser?.role !== 'Team Lead' && (
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-black text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-xl group w-full md:w-auto"
          >
            <Download className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
            EXPORT CSV
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Simulation Controls */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-slate-800 shadow-2xl space-y-6">
          <h3 className="text-xl font-black text-white mb-2 tracking-tight">Configure Simulation</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Scenario Name</label>
              <input 
                type="text" 
                disabled={currentUser?.role === 'Team Lead'}
                value={simulation.name}
                onChange={(e) => setSimulation({ ...simulation, name: e.target.value })}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Billing Rate (₹/hr)</label>
                <span className="text-sm font-black text-blue-500">{simulation.billingRate}</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="150" 
                disabled={currentUser?.role === 'Team Lead'}
                value={simulation.billingRate}
                onChange={(e) => setSimulation({ ...simulation, billingRate: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Utilization (%)</label>
                <span className="text-sm font-black text-emerald-500">{simulation.utilization}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="100" 
                disabled={currentUser?.role === 'Team Lead'}
                value={simulation.utilization}
                onChange={(e) => setSimulation({ ...simulation, utilization: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            {currentUser?.role !== 'Team Lead' && (
              <div className="pt-6 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={runSimulation}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-sm font-black text-white transition-all shadow-xl shadow-blue-500/20 group"
                >
                  <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  RUN MODEL
                </button>
                <button 
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-sm font-black text-slate-300 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  RESET
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Visualization */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-slate-800 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-black text-white tracking-tight">Predicted Margin Impact</h3>
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                Margin %
              </div>
            </div>
          </div>
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scenarios}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 10, fontWeight: 800}}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 10, fontWeight: 800}}
                  tickFormatter={(v) => `${v}%`}
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
                <Bar dataKey="margin" radius={[8, 8, 0, 0]} barSize={40}>
                  {scenarios.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.margin > 35 ? '#10b981' : entry.margin > 25 ? '#3b82f6' : '#f43f5e'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSimulator;