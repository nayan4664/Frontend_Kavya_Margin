import React, { useState, useEffect } from 'react';
import { IndianRupee, Plus, Trash2, CheckCircle2, Info, Download, TrendingUp } from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';
import { billingAPI } from '../../services/api';

const BillingModel = () => {
  const [models, setModels] = useState([]);
  const [newModel, setNewModel] = useState({ name: '', description: '', margin: '' });
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await billingAPI.getAll();
      // Map backend data to frontend model if necessary
      const mappedModels = response.data.map(m => ({
        id: m._id,
        name: m.modelName,
        description: m.description,
        margin: m.rate + '%', // backend uses rate for margin percentage
        status: 'Active'
      }));
      setModels(mappedModels);
    } catch (error) {
      console.error('Failed to fetch billing models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModel = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const payload = {
        modelName: newModel.name,
        description: newModel.description,
        rate: parseFloat(newModel.margin.replace('%', '')),
        type: 'Fixed' // Default type
      };
      
      const response = await billingAPI.create(payload);
      const createdModel = {
        id: response.data._id,
        name: response.data.modelName,
        description: response.data.description,
        margin: response.data.rate + '%',
        status: 'Active'
      };
      
      setModels([...models, createdModel]);
      setNewModel({ name: '', description: '', margin: '' });
      setErrors({});
      alert('Billing Model saved to MongoDB successfully!');
    } catch (error) {
      console.error('Failed to save billing model:', error);
      alert('Failed to save billing model');
    }
  };

  const deleteModel = async (id) => {
    try {
      await billingAPI.delete(id);
      setModels(models.filter(m => m.id !== id));
      alert('Billing Model deleted successfully!');
    } catch (error) {
      console.error('Failed to delete billing model:', error);
      alert('Failed to delete billing model');
    }
  };

  const handleExport = () => {
    if (currentUser?.role === 'Team Lead') {
      alert('Unauthorized: Team Leads cannot download reports.');
      return;
    }
    exportToCSV(models, 'Billing_Models.csv');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newModel.name.trim()) {
      newErrors.name = 'Model Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(newModel.name)) {
      newErrors.name = 'Model Name should contain only letters and spaces';
    }

    if (!newModel.margin.trim()) {
      newErrors.margin = 'Target Margin is required';
    } else if (!/^[\d\s\-%]+$/.test(newModel.margin) || !/\d/.test(newModel.margin)) {
      newErrors.margin = 'Accepts numeric percentage values only (e.g., 10%, 20-30)';
    }

    if (!newModel.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <IndianRupee className="w-8 h-8 text-blue-500" />
            Billing Models
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Configure and manage various billing structures for your projects.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Model */}
        {currentUser?.role !== 'Team Lead' && (
          <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-sm h-fit transition-all">
            <h3 className="text-lg font-bold text-slate-100 mb-6">Add New Model</h3>
            <form onSubmit={handleAddModel} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">Model Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Hybrid Model"
                  value={newModel.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow letters, spaces, and basic punctuation for model names (no numbers)
                    if (/[0-9]/.test(value)) return;
                    setNewModel({ ...newModel, name: value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-4 py-2.5 bg-slate-800/50 border ${errors.name ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-700 focus:ring-blue-500/20'} rounded-xl text-sm outline-none focus:ring-2 text-slate-200`} 
                />
                {errors.name && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">Target Margin (%)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 30-35%"
                  value={newModel.margin}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers, %, -, and spaces (no alphabets)
                    if (/[a-zA-Z]/.test(value)) return;
                    setNewModel({ ...newModel, margin: value });
                    if (errors.margin) setErrors({ ...errors, margin: '' });
                  }}
                  className={`w-full px-4 py-2.5 bg-slate-800/50 border ${errors.margin ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-700 focus:ring-blue-500/20'} rounded-xl text-sm outline-none focus:ring-2 text-slate-200`} 
                />
                {errors.margin && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.margin}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">Description</label>
                <textarea 
                  placeholder="Briefly describe the billing logic..."
                  value={newModel.description}
                  onChange={(e) => {
                    setNewModel({ ...newModel, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  rows="3"
                  className={`w-full px-4 py-2.5 bg-slate-800/50 border ${errors.description ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-700 focus:ring-blue-500/20'} rounded-xl text-sm outline-none focus:ring-2 text-slate-200 resize-none`}
                ></textarea>
                {errors.description && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.description}</p>}
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                <Plus className="w-4 h-4" />
                Add Billing Model
              </button>
            </form>
          </div>
        )}

        {/* List of Models */}
        <div className={`${currentUser?.role === 'Team Lead' ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-4`}>
          {models.map((model) => (
            <div key={model.id} className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between group hover:border-blue-500/50 transition-all">
              <div className="flex gap-4">
                <div className={`p-3 rounded-xl ${model.status === 'Active' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-slate-100">{model.name}</h4>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${model.status === 'Active' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {model.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{model.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs font-bold text-slate-300">Margin: {model.margin}</span>
                    </div>
                  </div>
                </div>
              </div>
              {currentUser?.role !== 'Team Lead' && (
                <button 
                  onClick={() => deleteModel(model.id)}
                  className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}

          <div className="p-4 bg-blue-900/10 rounded-xl flex gap-3 border border-blue-900/20 transition-colors">
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
            <p className="text-[11px] text-blue-300 font-medium leading-relaxed">
              Changing a billing model status to 'Inactive' will not affect existing projects but will prevent it from being selected for new ones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingModel;