import React, { useState, useEffect } from 'react';
import { Network, Plus, Trash2, Users, Download, Info } from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';
import { departmentAPI } from '../../services/api';

const DepartmentMapping = () => {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState({ name: '', head: '', staffCount: '', budget: '' });
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getAll();
      const mappedDepts = response.data.map(d => ({
        id: d._id,
        name: d.departmentName,
        head: d.head,
        staffCount: d.staffCount,
        budget: d.budget
      }));
      setDepartments(mappedDepts);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newDept.name.trim()) newErrors.name = 'Department Name is required';
    if (!newDept.head.trim()) newErrors.head = 'Department Head is required';
    if (!newDept.staffCount) newErrors.staffCount = 'Staff Count is required';
    if (!newDept.budget.trim()) newErrors.budget = 'Budget is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDept = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      // Format budget to ensure it has ₹ prefix
      let formattedBudget = newDept.budget.trim();
      if (!formattedBudget.startsWith('₹')) {
        formattedBudget = `₹${formattedBudget}`;
      }
      
      const payload = {
        departmentName: newDept.name,
        head: newDept.head,
        staffCount: Number(newDept.staffCount),
        budget: formattedBudget
      };
      
      const response = await departmentAPI.create(payload);
      const createdDept = {
        id: response.data._id,
        name: response.data.departmentName,
        head: response.data.head,
        staffCount: response.data.staffCount,
        budget: response.data.budget
      };
      
      setDepartments([...departments, createdDept]);
      setNewDept({ name: '', head: '', staffCount: '', budget: '' });
      setErrors({});
      alert('Department saved to MongoDB successfully!');
    } catch (error) {
      console.error('Failed to save department:', error);
      alert('Failed to save department');
    }
  };

  const deleteDept = async (id) => {
    try {
      await departmentAPI.delete(id);
      setDepartments(departments.filter(d => d.id !== id));
      alert('Department deleted successfully!');
    } catch (error) {
      console.error('Failed to delete department:', error);
      alert('Failed to delete department');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <Network className="w-8 h-8 text-blue-500" />
            Department Mapping
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Define your organizational structure and departmental ownership.</p>
        </div>
        {currentUser?.role !== 'Team Lead' && (
          <button 
            onClick={() => exportToCSV(departments, 'Departments.csv')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Dept Form */}
        {currentUser?.role !== 'Team Lead' && (
          <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-sm h-fit transition-all">
            <h3 className="text-lg font-bold text-slate-100 mb-6">Create Department</h3>
            <form onSubmit={handleAddDept} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">Department Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Quality Assurance"
                  value={newDept.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow letters and spaces
                    if (/[0-9]/.test(value)) return;
                    setNewDept({ ...newDept, name: value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-4 py-2.5 bg-slate-800/50 border ${errors.name ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-700 focus:ring-blue-500/20'} rounded-xl text-sm outline-none focus:ring-2 text-slate-200`} 
                />
                {errors.name && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">Department Head</label>
                <input 
                  type="text" 
                  placeholder="Manager Name"
                  value={newDept.head}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow letters and spaces
                    if (/[0-9]/.test(value)) return;
                    setNewDept({ ...newDept, head: value });
                    if (errors.head) setErrors({ ...errors, head: '' });
                  }}
                  className={`w-full px-4 py-2.5 bg-slate-800/50 border ${errors.head ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-700 focus:ring-blue-500/20'} rounded-xl text-sm outline-none focus:ring-2 text-slate-200`} 
                />
                {errors.head && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.head}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 ml-1">Staff Count</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    min="0"
                    value={newDept.staffCount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value !== '' && Number(value) < 0) return;
                      setNewDept({ ...newDept, staffCount: value });
                      if (errors.staffCount) setErrors({ ...errors, staffCount: '' });
                    }}
                    className={`w-full px-4 py-2.5 bg-slate-800/50 border ${errors.staffCount ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-700 focus:ring-blue-500/20'} rounded-xl text-sm outline-none focus:ring-2 text-slate-200`} 
                  />
                  {errors.staffCount && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.staffCount}</p>}
                </div>
                <div className="space-y-2 relative">
                  <label className="text-sm font-bold text-slate-300 ml-1">Budget</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
                    <input 
                      type="text" 
                      placeholder="0"
                      value={newDept.budget.replace('₹', '')}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.includes('-')) return;
                        // Only allow numbers and decimal
                        const cleanValue = value.replace(/[^0-9.]/g, '');
                        setNewDept({ ...newDept, budget: cleanValue });
                        if (errors.budget) setErrors({ ...errors, budget: '' });
                      }}
                      className={`w-full pl-8 pr-4 py-2.5 bg-slate-800/50 border ${errors.budget ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-slate-700 focus:ring-blue-500/20'} rounded-xl text-sm outline-none focus:ring-2 text-slate-200`} 
                    />
                  </div>
                  {errors.budget && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.budget}</p>}
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                <Plus className="w-4 h-4" />
                Create Department
              </button>
            </form>
          </div>
        )}

        {/* Dept Grid */}
        <div className={`${currentUser?.role === 'Team Lead' ? 'lg:col-span-3' : 'lg:col-span-2'} grid grid-cols-1 md:grid-cols-2 gap-6`}>
          {departments.map((dept) => (
            <div key={dept.id} className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-blue-500/50 transition-all group relative">
              {currentUser?.role !== 'Team Lead' && (
                <button 
                  onClick={() => deleteDept(dept.id)}
                  className="absolute top-4 right-4 p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">{dept.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">Head: {dept.head}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 bg-slate-800/50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Team Size</p>
                  <p className="text-lg font-black text-slate-300 mt-1">{dept.staffCount}</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Annual Budget</p>
                  <p className="text-lg font-black text-slate-300 mt-1">{dept.budget}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="md:col-span-2 p-4 bg-amber-900/10 rounded-xl flex gap-3 border border-amber-900/20 transition-colors">
            <span className="text-amber-400 shrink-0">
              <Info className="w-5 h-5" />
            </span>
            <p className="text-[11px] text-amber-300 font-medium leading-relaxed">
              Departments are used for cost allocation and resource grouping. Ensure the "Head of Department" is correctly mapped for approval workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentMapping;
