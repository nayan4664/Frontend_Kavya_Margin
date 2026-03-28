import React, { useState, useEffect } from 'react';
import { Calendar, Search, Download, Filter, UserPlus, ArrowRight, CheckCircle2, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';
import { resourceAPI } from '../../services/api';

const AvailabilityTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [newResource, setNewResource] = useState({
    name: '',
    role: '',
    primarySkill: '',
    secondarySkill: '',
    proficiencyLevel: 'Intermediate',
    experienceYears: '',
    currentProject: 'None',
    releaseDate: 'Immediate',
    availabilityPercentage: 100,
    allocationPercentage: 0,
    department: 'Engineering'
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await resourceAPI.getAll();
      setResources(response.data);
    } catch (err) {
      console.error("Error fetching resources:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditResource = (res) => {
    setEditingResource(res);
    setNewResource({
      name: res.name,
      role: res.role,
      primarySkill: res.primarySkill,
      secondarySkill: res.secondarySkill,
      proficiencyLevel: res.proficiencyLevel,
      experienceYears: res.experienceYears,
      currentProject: res.currentProject,
      releaseDate: res.releaseDate,
      availabilityPercentage: res.availabilityPercentage,
      allocationPercentage: res.allocationPercentage,
      department: res.department
    });
    setShowAddModal(true);
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource tracking?")) {
      try {
        await resourceAPI.delete(id);
        setResources(resources.filter(r => r._id !== id));
      } catch (err) {
        console.error("Error deleting resource:", err);
        alert('Failed to delete resource tracking');
      }
    }
  };

  const handleSubmitResource = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...newResource,
        experienceYears: Number(newResource.experienceYears),
        availabilityPercentage: Number(newResource.availabilityPercentage),
        allocationPercentage: Number(newResource.allocationPercentage)
      };

      if (editingResource) {
        const response = await resourceAPI.update(editingResource._id, data);
        setResources(resources.map(r => r._id === editingResource._id ? response.data : r));
        alert('Resource tracking updated successfully!');
      } else {
        const response = await resourceAPI.create(data);
        setResources([response.data, ...resources]);
        alert('Resource added to tracker successfully!');
      }
      setShowAddModal(false);
      setEditingResource(null);
      setNewResource({
        name: '',
        role: '',
        primarySkill: '',
        secondarySkill: '',
        proficiencyLevel: 'Intermediate',
        experienceYears: '',
        currentProject: 'None',
        releaseDate: 'Immediate',
        availabilityPercentage: 100,
        allocationPercentage: 0,
        department: 'Engineering'
      });
    } catch (err) {
      console.error("Error saving resource:", err);
      alert('Failed to save resource tracking');
    }
  };

  const handleExport = () => {
    if (currentUser?.role === 'Team Lead' || currentUser?.role?.toLowerCase() === 'hr') {
      alert(`Unauthorized: ${currentUser.role}s cannot download reports.`);
      return;
    }
    exportToCSV(resources, 'Resource_Availability.csv');
  };

  const filteredAvailability = resources.filter(res => 
    res.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.currentProject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const availableNow = resources.filter(r => r.releaseDate === 'Immediate' || r.availabilityPercentage === 100).length;
  
  const getDaysDiff = (dateStr) => {
    if (dateStr === 'Immediate') return 0;
    const releaseDate = new Date(dateStr);
    const today = new Date();
    const diffTime = releaseDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const releasing30 = resources.filter(r => {
    const days = getDaysDiff(r.releaseDate);
    return days > 0 && days <= 30;
  }).length;

  const releasing60 = resources.filter(r => {
    const days = getDaysDiff(r.releaseDate);
    return days > 30 && days <= 60;
  }).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-500" />
            Resource Availability Tracker
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Monitor upcoming roll-offs and resource availability for future planning.</p>
        </div>
        <div className="flex items-center gap-3">
          {currentUser?.role !== 'Team Lead' && currentUser?.role?.toLowerCase() !== 'hr' && currentUser?.role !== 'Project Manager' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Resource
            </button>
          )}
          {currentUser?.role !== 'Team Lead' && currentUser?.role?.toLowerCase() !== 'hr' && (
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          )}
        </div>
      </header>

      {/* Release Timeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-sm border-t-4 border-t-emerald-500/80">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Available Now</h4>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-100">{availableNow}</h3>
            <span className="text-xs font-bold text-emerald-400">Resources</span>
          </div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-sm border-t-4 border-t-blue-500/80">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Releasing in 30 Days</h4>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-100">{releasing30}</h3>
            <span className="text-xs font-bold text-blue-400">Resources</span>
          </div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-sm border-t-4 border-t-amber-500/80">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Releasing in 60 Days</h4>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-100">{releasing60}</h3>
            <span className="text-xs font-bold text-amber-400">Resources</span>
          </div>
        </div>
      </div>

      {/* Availability Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search resource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-200"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Resource Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Current Project</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Release Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Availability</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-bold tracking-widest uppercase text-[10px]">Loading tracking...</td>
                </tr>
              ) : filteredAvailability.length > 0 ? (
                filteredAvailability.map((res) => (
                  <tr key={res._id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-200">{res.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400 font-medium">{res.currentProject}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold ${res.releaseDate === 'Immediate' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {res.releaseDate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              res.availabilityPercentage > 70 ? 'bg-emerald-500' : 
                              res.availabilityPercentage > 30 ? 'bg-blue-500' : 'bg-slate-600'
                            }`}
                            style={{ width: `${res.availabilityPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-slate-300">{res.availabilityPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200">
                        <button 
                          onClick={() => handleEditResource(res)}
                          className="p-2 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteResource(res._id)}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-bold tracking-widest uppercase text-[10px]">No resources found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {editingResource ? 'Edit Resource Tracking' : 'Add Resource Tracking'}
                </h2>
                <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">
                  {editingResource ? 'Update allocation and availability' : 'Monitor resource availability and project allocation'}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingResource(null);
                  setNewResource({
                    name: '',
                    role: '',
                    primarySkill: '',
                    secondarySkill: '',
                    proficiencyLevel: 'Intermediate',
                    experienceYears: '',
                    currentProject: 'None',
                    releaseDate: 'Immediate',
                    availabilityPercentage: 100,
                    allocationPercentage: 0,
                    department: 'Engineering'
                  });
                }}
                className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitResource} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Resource Name</label>
                  <input 
                    type="text" 
                    required
                    value={newResource.name}
                    onChange={e => setNewResource({...newResource, name: e.target.value})}
                    placeholder="e.g. Amit Verma"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Current Project</label>
                  <input 
                    type="text" 
                    value={newResource.currentProject}
                    onChange={e => setNewResource({...newResource, currentProject: e.target.value})}
                    placeholder="e.g. Project Alpha"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Release Date</label>
                  <input 
                    type="text" 
                    value={newResource.releaseDate}
                    onChange={e => setNewResource({...newResource, releaseDate: e.target.value})}
                    placeholder="YYYY-MM-DD or Immediate"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Availability %</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={newResource.availabilityPercentage}
                    onChange={e => setNewResource({...newResource, availabilityPercentage: Number(e.target.value)})}
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
                    placeholder="e.g. Backend Developer"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Primary Skill</label>
                  <input 
                    type="text" 
                    required
                    value={newResource.primarySkill}
                    onChange={e => setNewResource({...newResource, primarySkill: e.target.value})}
                    placeholder="e.g. Node.js"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Exp. (Years)</label>
                  <input 
                    type="number" 
                    required
                    value={newResource.experienceYears}
                    onChange={e => setNewResource({...newResource, experienceYears: Number(e.target.value)})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
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
                  SAVE RESOURCE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityTracker;