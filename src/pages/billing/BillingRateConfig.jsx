import React, { useState, useEffect } from 'react';
import { IndianRupee, Plus, Trash2, Edit2, Download, Info, Search } from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';

const BillingRateConfig = () => {
  const [rates, setRates] = useState(() => {
    const storedRates = localStorage.getItem('billingRates');
    return storedRates ? JSON.parse(storedRates) : [
      { id: 1, role: 'Senior Architect', offshore: 3500, onshore: 9500, currency: 'INR', status: 'Active' },
      { id: 2, role: 'Full Stack Developer', offshore: 2200, onshore: 7500, currency: 'INR', status: 'Active' },
      { id: 3, role: 'UI/UX Lead', offshore: 2800, onshore: 8200, currency: 'INR', status: 'Active' },
      { id: 4, role: 'Project Manager', offshore: 3200, onshore: 8800, currency: 'INR', status: 'Active' },
      { id: 5, role: 'QA Engineer', offshore: 1800, onshore: 6500, currency: 'INR', status: 'Active' },
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({ role: '', offshore: '', onshore: '', currency: 'INR' });
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    localStorage.setItem('billingRates', JSON.stringify(rates));
  }, [rates]);

  const filteredRates = rates.filter(r => r.role.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAdd = () => {
    setEditingRate(null);
    setFormData({ role: '', offshore: '', onshore: '', currency: 'INR' });
    setErrors({});
    setShowForm(true);
  };

  const handleEdit = (rate) => {
    if (currentUser?.role === 'Team Lead') {
      alert('Unauthorized: Team Leads cannot edit records.');
      return;
    }
    setEditingRate(rate);
    setFormData({ role: rate.role, offshore: rate.offshore, onshore: rate.onshore, currency: rate.currency });
    setErrors({});
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (currentUser?.role === 'Team Lead') {
      alert('Unauthorized: Team Leads cannot delete records.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this rate?')) {
      const updatedRates = rates.filter(r => r.id !== id);
      setRates(updatedRates);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation for Role (no numbers allowed)
    if (/\d/.test(formData.role)) {
      setErrors({ ...errors, role: 'Role should contain only alphabetic characters' });
      return;
    }

    if (editingRate) {
      setRates(rates.map(r => r.id === editingRate.id ? { ...r, ...formData } : r));
    } else {
      setRates([...rates, { ...formData, id: Date.now(), status: 'Active' }]);
    }
    setShowForm(false);
    setErrors({});
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <IndianRupee className="w-8 h-8 text-primary-600" />
            Billing Rate Configuration
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Standardize and manage hourly billing rates across different roles and regions.</p>
        </div>
        <div className="flex items-center gap-3">
          {currentUser?.role !== 'Team Lead' && (
            <>
              <button 
                onClick={() => exportToCSV(rates, 'Standard_Billing_Rates.csv')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button 
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
              >
                <Plus className="w-4 h-4" />
                Add New Rate
              </button>
            </>
          )}
        </div>
      </header>

      {showForm && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Role</label>
              <input 
                type="text" 
                required
                value={formData.role}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow letters and spaces
                  if (/[0-9]/.test(value)) {
                    setErrors({ ...errors, role: 'Role should contain only alphabetic characters' });
                    return;
                  }
                  setFormData({...formData, role: value});
                  if (errors.role) setErrors({ ...errors, role: '' });
                }}
                className={`w-full px-4 py-2 bg-slate-950 border ${errors.role ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-sm text-slate-200 outline-none focus:ring-2 ${errors.role ? 'focus:ring-rose-500/20' : 'focus:ring-primary-500/20'}`}
              />
              {errors.role && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.role}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Offshore Rate</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.offshore}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val < 0) return;
                  setFormData({...formData, offshore: val});
                }}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Onshore Rate</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.onshore}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val < 0) return;
                  setFormData({...formData, onshore: val});
                }}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="submit"
                className="flex-1 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all"
              >
                {editingRate ? 'Update' : 'Save'}
              </button>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm transition-colors">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-slate-800 transition-all outline-none text-slate-200"
            />
          </div>
        </div>
        <div className="bg-amber-900/10 p-4 rounded-2xl border border-amber-900/20 flex items-center gap-3">
          <Info className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-[11px] text-amber-400 font-bold leading-tight">
            Rates are updated quarterly. Last update: Jan 1st, 2026.
          </p>
        </div>
      </div>

      {/* Rates Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Role / Designation</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Offshore Rate (/hr)</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Onshore Rate (/hr)</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Currency</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRates.map((rate) => (
                <tr key={rate.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-200">{rate.role}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-black text-primary-400">₹{rate.offshore}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-black text-indigo-400">₹{rate.onshore}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md">{rate.currency}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {currentUser?.role !== 'Team Lead' && (
                      <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(rate)}
                          className="p-2 text-slate-500 hover:text-primary-400 hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(rate.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingRateConfig;
