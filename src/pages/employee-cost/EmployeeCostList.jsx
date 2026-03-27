import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Download, Plus, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { exportToCSV, exportToXML } from '../../utils/exportUtils';
import { Link } from 'react-router-dom';
import { employeeAPI } from '../../services/api';

const EmployeeCostList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    fetchEmployees();
  }, []);

  const departments = ['All', ...new Set(employees.map(e => e.department))];

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      // Fallback to localStorage or default if API fails
      const storedEmployees = JSON.parse(localStorage.getItem('mock_employees'));
      if (storedEmployees) setEmployees(storedEmployees);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    if (currentUser?.role === 'Team Lead' || currentUser?.role === 'Viewers' || currentUser?.role === 'Project Manager') {
      alert('Unauthorized: You do not have permission to delete records.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await employeeAPI.delete(id);
        fetchEmployees();
      } catch (err) {
        alert("Error deleting employee");
      }
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    
    return matchesSearch && matchesDept;
  });

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(val);

  const handleExport = () => {
    if (currentUser?.role === 'Team Lead' || currentUser?.role === 'Project Manager') {
      alert(`Unauthorized: ${currentUser.role}s cannot download reports.`);
      return;
    }
    exportToCSV(employees, 'Employee_Cost_Report.csv');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500" id="employee-cost-content">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            Employee Directory
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Manage resource costs, allocation, and professional profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          {currentUser?.role !== 'Team Lead' && currentUser?.role !== 'Project Manager' && (
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          )}
          {currentUser?.role !== 'Viewers' && currentUser?.role !== 'Team Lead' && currentUser?.role !== 'Project Manager' && (
            <Link 
              to="/employee-cost/add"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </Link>
          )}
        </div>
      </header>

      {/* Filters & Search */}
      <div className="bg-slate-900/50 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name, role, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-200 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                showFilters ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Department</label>
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="block w-48 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Employee</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Department</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Annual CTC</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Monthly Cost</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredEmployees.map((emp) => (
                <tr key={emp._id || emp.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center font-bold text-xs">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-100">{emp.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-400">{emp.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-100">{formatCurrency(emp.CTC)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-100">{formatCurrency(emp.monthlyCost)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {currentUser?.role !== 'Viewers' && currentUser?.role !== 'Team Lead' && currentUser?.role !== 'Project Manager' && (
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/employee-cost/edit/${emp._id || emp.id}`}
                          className="p-2 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => deleteEmployee(emp._id || emp.id)}
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

export default EmployeeCostList;
