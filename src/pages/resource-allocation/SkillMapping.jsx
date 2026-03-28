import React, { useState, useEffect } from 'react';
import { Target, Search, Download, Star, Filter, Code2, Database, Layout, Settings, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';
import { resourceAPI } from '../../services/api';

const SkillMapping = () => {
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
      department: res.department
    });
    setShowAddModal(true);
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource mapping?")) {
      try {
        await resourceAPI.delete(id);
        setResources(resources.filter(r => r._id !== id));
      } catch (err) {
        console.error("Error deleting resource:", err);
        alert('Failed to delete resource mapping');
      }
    }
  };

  const handleSubmitResource = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...newResource,
        experienceYears: Number(newResource.experienceYears)
      };

      if (editingResource) {
        const response = await resourceAPI.update(editingResource._id, data);
        setResources(resources.map(r => r._id === editingResource._id ? response.data : r));
        alert('Resource skills updated successfully!');
      } else {
        const response = await resourceAPI.create(data);
        setResources([response.data, ...resources]);
        alert('Resource skills mapped successfully!');
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
        department: 'Engineering'
      });
    } catch (err) {
      console.error("Error saving resource:", err);
      alert('Failed to save resource skills');
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState({
    level: 'All',
    experience: 'All',
    primarySkill: 'All'
  });

  const levels = ['All', 'Expert', 'Advanced', 'Intermediate', 'Beginner'];
  const primarySkills = ['All', ...new Set(resources.map(s => s.primarySkill))];
  const expRanges = ['All', '0-3 Years', '4-7 Years', '8+ Years'];

  const filteredSkills = resources.filter(s => {
    const matchesSearch = 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.primarySkill?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.secondarySkill?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = filters.level === 'All' || s.proficiencyLevel === filters.level;
    const matchesSkill = filters.primarySkill === 'All' || s.primarySkill === filters.primarySkill;
    
    let matchesExp = true;
    if (filters.experience !== 'All') {
      const exp = s.experienceYears;
      if (filters.experience === '0-3 Years') matchesExp = exp <= 3;
      else if (filters.experience === '4-7 Years') matchesExp = exp >= 4 && exp <= 7;
      else if (filters.experience === '8+ Years') matchesExp = exp >= 8;
    }

    return matchesSearch && matchesLevel && matchesSkill && matchesExp;
  });

  const handleExport = () => {
    if (currentUser?.role === 'Team Lead' || currentUser?.role?.toLowerCase() === 'hr') {
      alert(`Unauthorized: ${currentUser.role}s cannot download reports.`);
      return;
    }
    exportToCSV(resources, 'Skill_Matrix.csv');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-500" />
            Skill Mapping
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Inventory and analysis of core competencies across the workforce.</p>
        </div>
        <div className="flex items-center gap-3">
          {currentUser?.role !== 'Team Lead' && currentUser?.role?.toLowerCase() !== 'hr' && currentUser?.role !== 'Project Manager' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Skill Mapping
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

      {/* Skill Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-sm text-center">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-100">Frontend</h4>
          <p className="text-2xl font-black text-slate-100 mt-1">{resources.filter(r => r.department === 'Frontend' || r.primarySkill?.toLowerCase().includes('react') || r.primarySkill?.toLowerCase().includes('angular')).length}</p>
          <p className="text-xs text-slate-500 font-medium">Resources</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-sm text-center">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Database className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-100">Backend</h4>
          <p className="text-2xl font-black text-slate-100 mt-1">{resources.filter(r => r.department === 'Backend' || r.primarySkill?.toLowerCase().includes('node') || r.primarySkill?.toLowerCase().includes('java') || r.primarySkill?.toLowerCase().includes('python')).length}</p>
          <p className="text-xs text-slate-500 font-medium">Resources</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-sm text-center">
          <div className="w-12 h-12 bg-pink-500/10 text-pink-400 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Layout className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-100">Design</h4>
          <p className="text-2xl font-black text-slate-100 mt-1">{resources.filter(r => r.department === 'Design' || r.primarySkill?.toLowerCase().includes('figma') || r.primarySkill?.toLowerCase().includes('ui/ux')).length}</p>
          <p className="text-xs text-slate-500 font-medium">Resources</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-sm text-center">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-100">DevOps</h4>
          <p className="text-2xl font-black text-slate-100 mt-1">{resources.filter(r => r.department === 'DevOps' || r.primarySkill?.toLowerCase().includes('aws') || r.primarySkill?.toLowerCase().includes('docker')).length}</p>
          <p className="text-xs text-slate-500 font-medium">Resources</p>
        </div>
      </div>

      {/* Skill Matrix Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by name or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-200"
              />
            </div>
            <button 
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                showAdvancedSearch ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-slate-800/50 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Filter className="w-4 h-4" />
              Advanced Search
            </button>
          </div>

          {showAdvancedSearch && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Proficiency</label>
                <select 
                  value={filters.level}
                  onChange={(e) => setFilters({...filters, level: e.target.value})}
                  className="block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Primary Skill</label>
                <select 
                  value={filters.primarySkill}
                  onChange={(e) => setFilters({...filters, primarySkill: e.target.value})}
                  className="block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {primarySkills.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Experience</label>
                <select 
                  value={filters.experience}
                  onChange={(e) => setFilters({...filters, experience: e.target.value})}
                  className="block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {expRanges.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Resource</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Primary Skill</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Secondary Skill</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Proficiency</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Exp.</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-bold tracking-widest uppercase text-[10px]">Loading skills...</td>
                </tr>
              ) : filteredSkills.length > 0 ? (
                filteredSkills.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-200">{s.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">{s.primarySkill}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md">{s.secondarySkill || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < (s.proficiencyLevel === 'Expert' ? 5 : s.proficiencyLevel === 'Advanced' ? 4 : s.proficiencyLevel === 'Intermediate' ? 3 : 2) ? 'text-amber-500 fill-amber-500' : 'text-slate-700'}`} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400 font-medium">{s.experienceYears} Years</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200">
                        <button 
                          onClick={() => handleEditResource(s)}
                          className="p-2 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteResource(s._id)}
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
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-bold tracking-widest uppercase text-[10px]">No resources found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Skill Mapping Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {editingResource ? 'Edit Skill Mapping' : 'Add Skill Mapping'}
                </h2>
                <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">
                  {editingResource ? 'Update talent competencies' : 'Register talent competencies'}
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Role</label>
                  <input 
                    type="text" 
                    required
                    value={newResource.role}
                    onChange={e => setNewResource({...newResource, role: e.target.value})}
                    placeholder="e.g. Frontend Developer"
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
                    placeholder="e.g. React.js"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Secondary Skill</label>
                  <input 
                    type="text" 
                    value={newResource.secondarySkill}
                    onChange={e => setNewResource({...newResource, secondarySkill: e.target.value})}
                    placeholder="e.g. Node.js"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Proficiency</label>
                  <select 
                    value={newResource.proficiencyLevel}
                    onChange={e => setNewResource({...newResource, proficiencyLevel: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  >
                    <option value="Expert">Expert</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Beginner">Beginner</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Experience (Years)</label>
                  <input 
                    type="number" 
                    required
                    value={newResource.experienceYears}
                    onChange={e => setNewResource({...newResource, experienceYears: Number(e.target.value)})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Department</label>
                  <select 
                    value={newResource.department}
                    onChange={e => setNewResource({...newResource, department: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Design">Design</option>
                    <option value="DevOps">DevOps</option>
                    <option value="QA">QA</option>
                    <option value="Management">Management</option>
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
                  SAVE SKILLS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillMapping;
