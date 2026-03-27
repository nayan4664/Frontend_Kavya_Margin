import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Download, Filter, Clock, Edit2, Trash2, Check, X, Plus } from 'lucide-react';
import { exportToCSV, exportToXML } from '../../utils/exportUtils';
import { benchAPI } from '../../services/api';

const BenchList = () => {
  const [benchList, setBenchList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [currentUser, setCurrentUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResource, setNewResource] = useState({
    name: '',
    role: '',
    bench_duration_weeks: 0,
    cost_impact: 0,
    primary_skill: '',
    status: 'Available'
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    fetchBenchData();
  }, []);

  const fetchBenchData = async () => {
    try {
      setLoading(true);
      const response = await benchAPI.getAll();
      setBenchList(response.data);
    } catch (err) {
      console.error("Error fetching bench data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newResource };
      await benchAPI.create(payload);
      alert('Resource added to bench successfully and saved to MongoDB!');
      setShowAddModal(false);
      setNewResource({
        name: '',
        role: '',
        bench_duration_weeks: 0,
        cost_impact: 0,
        primary_skill: '',
        status: 'Available'
      });
      fetchBenchData();
    } catch (err) {
      console.error("Error adding resource to bench:", err.response ? err.response.data : err.message);
      alert(`Failed to add resource: ${err.response ? err.response.data.message : 'Server error'}`);
    }
  };

  const handleExport = (type) => {
    if (currentUser?.role === 'Team Lead' || currentUser?.role === 'Project Manager') {
      alert(`Unauthorized: ${currentUser.role}s cannot download reports.`);
      return;
    }
    if (type === 'CSV') exportToCSV(benchList, 'Bench_Resources.csv');
    else exportToXML(benchList, 'Bench_Resources.xml', 'BenchResources');
  };

  const departments = ['All', ...new Set(benchList.map(res => res.primary_skill))];

  const handleEditClick = (res) => {
    if (currentUser?.role === 'Team Lead' || currentUser?.role === 'Project Manager') {
      alert(`Unauthorized: ${currentUser.role}s cannot edit records.`);
      return;
    }
    setEditingId(res._id);
    setEditFormData({ ...res });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      await benchAPI.update(editingId, editFormData);
      setEditingId(null);
      setEditFormData({});
      fetchBenchData();
    } catch (err) {
      console.error("Error updating resource:", err);
      alert('Failed to update resource');
    }
  };

  const handleDelete = async (id) => {
    if (currentUser?.role === 'Team Lead' || currentUser?.role === 'Project Manager') {
      alert(`Unauthorized: ${currentUser.role}s cannot delete records.`);
      return;
    }
    if (window.confirm('Are you sure you want to delete this resource from the bench?')) {
      try {
        await benchAPI.delete(id);
        fetchBenchData();
      } catch (err) {
        console.error("Error deleting resource:", err);
        alert('Failed to delete resource');
      }
    }
  };

  const filteredBench = benchList.filter(res => {
    const matchesSearch = 
      res.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.primary_skill?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || res.primary_skill === selectedDept;
    
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
            Bench List
          </h1>
          <p className="text-slate-400 mt-2 font-bold tracking-wide">Detailed inventory of unallocated resources and their bench duration.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {currentUser?.role !== 'Team Lead' && currentUser?.role !== 'Project Manager' && (
            <>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 group w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                ADD RESOURCE
              </button>
              <button 
                onClick={() => handleExport('CSV')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-black text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-xl group w-full sm:w-auto"
              >
                <Download className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                EXPORT CSV
              </button>
            </>
          )}
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] overflow-hidden backdrop-blur-xl">
        <div className="p-4 md:p-8 border-b border-slate-800/50 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, role or department..."
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
            <select
              className="bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors flex-1 md:flex-none"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept} Department</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/30">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">Resource Name</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">Department / Role</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">Bench Duration</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">Monthly Cost</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-bold tracking-widest uppercase text-[10px]">Loading bench data...</td>
                </tr>
              ) : filteredBench.length > 0 ? (
                filteredBench.map((res) => (
                  <tr key={res._id} className="group hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-5">
                      {editingId === res._id ? (
                        <input 
                          type="text" 
                          name="name"
                          value={editFormData.name} 
                          onChange={handleInputChange}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm font-bold text-white w-full"
                        />
                      ) : (
                        <p className="text-sm font-black text-white">{res.name}</p>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {editingId === res._id ? (
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            name="primary_skill"
                            value={editFormData.primary_skill} 
                            onChange={handleInputChange}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-slate-400 w-full"
                          />
                          <input 
                            type="text" 
                            name="role"
                            value={editFormData.role} 
                            onChange={handleInputChange}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-slate-400 w-full"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-black text-blue-500">{res.primary_skill}</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{res.role}</p>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="text-sm font-bold text-slate-400">{res.bench_duration_weeks} Weeks</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-white">₹{(res.cost_impact / 100000).toFixed(1)}L/mo</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === res._id ? (
                          <>
                            <button onClick={handleSaveEdit} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={handleCancelEdit} className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          currentUser?.role !== 'Team Lead' && currentUser?.role !== 'Project Manager' && (
                            <>
                              <button 
                                onClick={() => handleEditClick(res)}
                                className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(res._id)}
                                className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-bold tracking-widest uppercase text-[10px]">No resources on bench.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Add Bench Resource</h2>
                <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Register unallocated talent</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddResource} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Resource Name</label>
                  <input 
                    type="text" 
                    required
                    value={newResource.name}
                    onChange={e => setNewResource({...newResource, name: e.target.value})}
                    placeholder="e.g. Rahul Reddy"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Role</label>
                  <input 
                    type="text" 
                    required
                    value={newResource.role}
                    onChange={e => setNewResource({...newResource, role: e.target.value})}
                    placeholder="e.g. PM, QA, Developer"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Primary Skill / Dept</label>
                  <input 
                    type="text" 
                    required
                    value={newResource.primary_skill}
                    onChange={e => setNewResource({...newResource, primary_skill: e.target.value})}
                    placeholder="e.g. Engineering, Data"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Bench Weeks</label>
                  <input 
                    type="number" 
                    required
                    value={newResource.bench_duration_weeks}
                    onChange={e => setNewResource({...newResource, bench_duration_weeks: Number(e.target.value)})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Monthly Cost (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={newResource.cost_impact}
                    onChange={e => setNewResource({...newResource, cost_impact: Number(e.target.value)})}
                    placeholder="e.g. 150000"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Status</label>
                  <select 
                    value={newResource.status}
                    onChange={e => setNewResource({...newResource, status: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  >
                    <option value="Available">Available</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Allocated">Allocated</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-sm font-black transition-all"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-blue-500/20"
                >
                  ADD TO BENCH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenchList;