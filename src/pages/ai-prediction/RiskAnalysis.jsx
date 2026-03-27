import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter,
  ArrowRight,
  Info,
  BrainCircuit,
  Clock,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { riskAPI } from '../../services/api';

const RiskAnalysis = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      const response = await riskAPI.getAll();
      setRisks(response.data);
    } catch (err) {
      console.error("Error fetching risks:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRisks = risks.filter(r => {
    const matchesSearch = !searchTerm || 
      r.name?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      r.category?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      r.action?.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesLevel = filterLevel === 'All' || r.impact === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const getRiskColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const chartData = [
    { name: 'High', count: risks.filter(r => r.impact === 'High').length, color: '#ef4444' },
    { name: 'Medium', count: risks.filter(r => r.impact === 'Medium').length, color: '#f59e0b' },
    { name: 'Low', count: risks.filter(r => r.impact === 'Low').length, color: '#10b981' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 md:w-10 md:h-10 text-rose-500" />
            Risk Analysis
          </h1>
          <p className="text-slate-400 mt-2 font-bold tracking-wide">AI-identified risks and automated mitigation strategies.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search risks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <select 
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-black text-slate-300 outline-none focus:border-blue-500/50 transition-colors"
          >
            <option value="All">All Impact Levels</option>
            <option value="High">High Impact</option>
            <option value="Medium">Medium Impact</option>
            <option value="Low">Low Impact</option>
          </select>
        </div>
      </header>

      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-12 h-12 text-rose-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Critical Risks</p>
            <h3 className="text-3xl font-black text-white mt-2">{risks.filter(r => r.impact === 'High').length.toString().padStart(2, '0')}</h3>
            <p className="text-xs font-bold text-rose-500 mt-2 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              Requires Action
            </p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-12 h-12 text-emerald-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mitigated Risks</p>
            <h3 className="text-3xl font-black text-white mt-2">14</h3>
            <p className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              Last 30 Days
            </p>
          </div>
        </div>

        {/* Impact Distribution Chart */}
        <div className="lg:col-span-3 bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-white tracking-tight">Risk Distribution</h3>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Clock className="w-4 h-4" />
              Live AI Analysis
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" opacity={0.5} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} 
                  width={60}
                />
                <Tooltip 
                  cursor={{fill: '#1e293b', opacity: 0.4}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk List Section */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-800/50">
          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-blue-500" />
            AI Identified Risks
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/30">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">Risk Description</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">Impact</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">Probability</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">AI Mitigation Action</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-bold tracking-widest uppercase text-[10px]">Loading AI risks...</td>
                </tr>
              ) : filteredRisks.length > 0 ? (
                filteredRisks.map((risk) => (
                  <tr key={risk._id} className="group hover:bg-slate-800/20 transition-all cursor-pointer">
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-white group-hover:text-blue-500 transition-colors">{risk.name}</p>
                      <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{risk.category}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRiskColor(risk.impact)}`}>
                        {risk.impact}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-400">
                      {risk.probability}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-300 group-hover:text-blue-400 transition-colors">
                        <Target className="w-4 h-4 text-blue-500" />
                        {risk.action}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className={`text-lg font-black ${
                        risk.score > 70 ? 'text-rose-500' : risk.score > 40 ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                        {risk.score}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <Search className="w-8 h-8 text-slate-500" />
                      <p className="text-sm font-bold text-slate-400">No risks found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendation Box */}
      <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[2rem] flex items-start gap-4">
        <div className="p-3 bg-blue-500/10 rounded-2xl">
          <BrainCircuit className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-2">AI Strategic Recommendation</h4>
          <p className="text-sm text-slate-400 font-bold leading-relaxed">
            Current analysis indicates a concentration of financial risks in Project Alpha and Beta. We recommend an immediate review of resource billing rates and a transition of 15% more non-core tasks to offshore centers to buffer the projected margin impact.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
