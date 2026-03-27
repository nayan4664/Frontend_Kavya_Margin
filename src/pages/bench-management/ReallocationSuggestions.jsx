import React, { useState } from 'react';
import { Sparkles, ArrowRight, UserPlus, Zap, CheckCircle2, Info } from 'lucide-react';

const initialSuggestions = [
  {
    id: 1,
    resource: 'Rahul Reddy',
    role: 'Product Manager',
    currentStatus: 'Bench (45 Days)',
    suggestedProject: 'Global Billing System',
    matchScore: 94,
    reason: 'Matches required 8+ years experience and BFSI domain expertise.',
    impact: '+₹2.4L Monthly Revenue'
  },
  {
    id: 2,
    resource: 'Sneha Rao',
    role: 'Data Analyst',
    currentStatus: 'Bench (62 Days)',
    suggestedProject: 'AI Engine Optimization',
    matchScore: 88,
    reason: 'Strong background in Python and predictive modeling.',
    impact: '+₹1.8L Monthly Revenue'
  },
  {
    id: 3,
    resource: 'Vikram Singh',
    role: 'DevOps Engineer',
    currentStatus: 'Bench (5 Days)',
    suggestedProject: 'Cloud Migration Phase 2',
    matchScore: 91,
    reason: 'Certified AWS Solutions Architect with Terraform skills.',
    impact: '+₹2.1L Monthly Revenue'
  }
];

const ReallocationSuggestions = () => {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
  }, []);

  const handleApprove = (id) => {
    if (currentUser?.role === 'Team Lead') {
      alert('Unauthorized: Team Leads cannot approve reallocations.');
      return;
    }
    const suggestion = suggestions.find(s => s.id === id);
    if (window.confirm(`Are you sure you want to approve reallocation for ${suggestion.resource} to ${suggestion.suggestedProject}?`)) {
      setSuggestions(suggestions.filter(s => s.id !== id));
      alert(`Reallocation for ${suggestion.resource} has been approved and status updated.`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-blue-500" />
          Reallocation Suggestions
        </h1>
        <p className="text-slate-400 mt-2 font-medium">AI-powered resource matching to optimize bench utilization and project delivery.</p>
      </header>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 gap-6">
        {suggestions.length > 0 ? (
          suggestions.map((s) => (
            <div key={s.id} className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-sm hover:border-blue-500/30 transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                {/* Resource Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center font-black">
                      {s.resource.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">{s.resource}</h4>
                      <p className="text-xs text-slate-500 font-medium">{s.role}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl inline-block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Current Status</span>
                    <span className="text-sm font-bold text-rose-400">{s.currentStatus}</span>
                  </div>
                </div>

                {/* Match Details */}
                <div className="flex-[2] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Zap className="w-3 h-3" />
                      {s.matchScore}% Match
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-bold text-slate-100">{s.suggestedProject}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {s.reason}
                  </p>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Financial Impact: {s.impact}</span>
                  </div>
                </div>

                {/* Action */}
                <div className="lg:text-right">
                  <button 
                    onClick={() => handleApprove(s.id)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 w-full lg:w-auto"
                  >
                    <UserPlus className="w-4 h-4" />
                    Approve Reallocation
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-900/50 backdrop-blur-xl p-12 rounded-2xl border border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">No pending suggestions</h3>
            <p className="text-slate-400 max-w-md mx-auto">All resource reallocation suggestions have been reviewed and processed.</p>
          </div>
        )}
      </div>

      <div className="bg-amber-500/10 p-6 rounded-2xl border border-amber-500/20 flex gap-4">
        <Info className="w-6 h-6 text-amber-400 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-amber-100">How matching works</h4>
          <p className="text-xs text-amber-300 mt-1 leading-relaxed font-medium">
            Our AI analysis engine compares resource skill sets, historical project performance, and availability timelines against open project requirements to generate these suggestions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReallocationSuggestions;
