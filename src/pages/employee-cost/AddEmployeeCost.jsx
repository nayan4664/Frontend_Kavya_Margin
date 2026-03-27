import React, { useState, useEffect } from 'react';
import { UserPlus, Save, ArrowLeft, DollarSign, Briefcase, Building2, Calendar, IndianRupee, Users, Layout } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { employeeAPI } from '../../services/api';
import { useDashboard } from '../../context/DashboardContext';

const AddEmployeeCost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { refreshDashboard } = useDashboard();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: 'Engineering',
    joiningDate: '',
    ctc: '',
    variablePay: '',
    benefits: '',
    location: 'Offshore',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    
    if (user?.role === 'Viewers') {
      navigate('/dashboard');
    }

    if (id) {
      setIsEditMode(true);
      fetchEmployeeData(id);
    }
  }, [id, navigate]);

  const isViewOnly = currentUser?.role === 'Team Lead' || currentUser?.role === 'Project Manager';

  const fetchEmployeeData = async (employeeId) => {
    try {
      setLoading(true);
      // Try API first
      const response = await employeeAPI.getById(employeeId);
      const employee = response.data;
      
      const [firstName, ...lastNameParts] = employee.name.split(' ');
      setFormData({
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        email: employee.email || '',
        role: employee.role || '',
        department: employee.department || 'Engineering',
        joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : '',
        ctc: employee.CTC || '',
        variablePay: employee.variablePay || '',
        benefits: employee.benefits || '',
        location: employee.location || 'Offshore',
      });
    } catch (error) {
      console.error('Failed to fetch employee from API:', error);
      // Fallback to localStorage
      const existingEmployees = JSON.parse(localStorage.getItem('mock_employees')) || [];
      const employeeToEdit = existingEmployees.find(emp => emp.id === employeeId || emp._id === employeeId);
      if (employeeToEdit) {
        const [firstName, ...lastNameParts] = employeeToEdit.name.split(' ');
        setFormData({
          firstName: firstName || '',
          lastName: lastNameParts.join(' ') || '',
          email: employeeToEdit.email || '',
          role: employeeToEdit.role || '',
          department: employeeToEdit.department || 'Engineering',
          joiningDate: employeeToEdit.joiningDate || '',
          ctc: employeeToEdit.CTC || '',
          variablePay: employeeToEdit.variablePay || '',
          benefits: employeeToEdit.benefits || '',
          location: employeeToEdit.location || 'Offshore',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent negative values for financial fields
    if ((name === 'ctc' || name === 'variablePay') && value !== '' && Number(value) < 0) return;
    
    // Validation for alphabetical fields: First Name, Last Name, and Role
    if (['firstName', 'lastName', 'role'].includes(name)) {
      // Only allow letters and spaces
      const alphabetRegex = /^[a-zA-Z\s]*$/;
      if (!alphabetRegex.test(value)) {
        return; // Don't update state if invalid character
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation check
    const alphabetRegex = /^[a-zA-Z\s]+$/;
    if (!alphabetRegex.test(formData.firstName.trim())) {
      alert('First Name should only contain alphabetic characters.');
      return;
    }
    if (!alphabetRegex.test(formData.lastName.trim())) {
      alert('Last Name should only contain alphabetic characters.');
      return;
    }
    if (!alphabetRegex.test(formData.role.trim())) {
      alert('Designation / Role should only contain alphabetic characters.');
      return;
    }

    if (Number(formData.ctc) < 0 || Number(formData.variablePay) < 0) {
      alert('Annual CTC and Variable Pay cannot be negative.');
      return;
    }

    const employeeData = {
      name: `${formData.firstName} ${formData.lastName}`,
      role: formData.role,
      department: formData.department,
      CTC: Number(formData.ctc),
      monthlyCost: Math.round(Number(formData.ctc) / 12),
      email: formData.email,
      joiningDate: formData.joiningDate,
      variablePay: Number(formData.variablePay),
      location: formData.location
    };

    try {
      setLoading(true);
      if (isEditMode) {
        await employeeAPI.update(id, employeeData);
      } else {
        await employeeAPI.create(employeeData);
      }
      refreshDashboard(); // Refresh dashboard data

      alert(isEditMode ? 'Employee cost data updated successfully!' : 'Employee cost data added successfully!');
      navigate('/employee-cost/list');
    } catch (error) {
      console.error('Failed to save employee:', error);
      // Show the actual error message from the backend
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save employee cost data';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <Link to="/employee-cost/list" className="p-2 hover:bg-slate-900 rounded-xl border border-transparent hover:border-slate-800 transition-all text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
            <UserPlus className="w-8 h-8 text-primary-600" />
            {isViewOnly ? (isEditMode ? 'View Employee Cost' : 'Employee Cost Details') : (isEditMode ? 'Edit Employee Cost' : 'Add Employee Cost')}
          </h1>
          <p className="text-slate-400 mt-1 font-medium">
            {isViewOnly ? 'Review resource cost configuration and details.' : (isEditMode ? 'Update existing resource cost configuration.' : 'Onboard a new resource and configure their cost structure.')}
          </p>
        </div>
      </header>

      <div className="bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-sm max-w-4xl transition-all">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Basic Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Building2 className="w-5 h-5 text-primary-500" />
              <h3 className="font-bold text-slate-100 uppercase tracking-widest text-xs">Professional Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  required
                  disabled={isViewOnly}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  required
                  disabled={isViewOnly}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">Work Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  disabled={isViewOnly}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">Designation / Role</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    name="role"
                    required
                    disabled={isViewOnly}
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">Department</label>
                <div className="relative">
                  <Layout className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select 
                    name="department"
                    required
                    disabled={isViewOnly}
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-200 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Financials */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <DollarSign className="w-5 h-5 text-primary-500" />
              <h3 className="font-bold text-slate-100 uppercase tracking-widest text-xs">Cost Structure</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">Annual CTC (Gross)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
                  <input 
                    type="number" 
                    name="ctc"
                    required
                    disabled={isViewOnly}
                    min="0"
                    value={formData.ctc}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">Variable Pay (%)</label>
                <input 
                  type="number" 
                  name="variablePay"
                  disabled={isViewOnly}
                  min="0"
                  value={formData.variablePay}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300 ml-1">Joining Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="date" 
                    name="joiningDate"
                    required
                    disabled={isViewOnly}
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">
            <button 
              type="button" 
              onClick={() => navigate('/employee-cost/list')}
              className="px-8 py-3 bg-slate-800 text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-700 transition-all"
            >
              {isViewOnly ? 'Back' : 'Cancel'}
            </button>
            {!isViewOnly && (
              <button 
                type="submit" 
                disabled={loading}
                className={`px-8 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : (isEditMode ? 'Update Employee Cost' : 'Save Employee Cost')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeCost;
