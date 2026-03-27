import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { authAPI } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    contactNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    userRole: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  const roleEmailMap = {
    'Super Admin': 'nayan@kavyainfoweb.com',
    'Company Admin': 'sushil@kavyainfoweb.com',
    'Project Manager': 'rajni@kavyainfoweb.com',
    'HR': 'raj@kavyainfoweb.com',
    'Team Lead': 'priti@kavyainfoweb.com',
    'Viewers': 'viewer@kavyainfoweb.com'
  };

  const validatePassword = (pass) => {
    const hasNumber = /\d/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    return pass.length >= 8 && hasNumber && hasUpper;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fullName') {
      // Allow only letters and spaces
      const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData({ ...formData, [name]: filteredValue });
    } else if (name === 'contactNo') {
      // Enforce +91 prefix and only digits
      let val = value;
      let digits = '';
      
      if (!val.startsWith('+91')) {
        digits = val.replace(/\D/g, '');
      } else {
        digits = val.slice(3).replace(/\D/g, '');
      }

      // Enforce: first digit after +91 must be 7, 8, or 9
      if (digits.length > 0 && !['7', '8', '9'].includes(digits[0])) {
        return;
      }
      
      val = '+91' + digits;
      setFormData({ ...formData, [name]: val.slice(0, 13) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Basic Required check
    Object.keys(formData).forEach(key => {
      if (!formData[key] || !formData[key].toString().trim()) {
        newErrors[key] = 'Required';
      }
    });

    // Full Name Validation
    if (formData.fullName && !/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = 'Full Name should accept only alphabetic characters';
    }

    // Contact Number Validation
    if (formData.contactNo && !/^\+91[789]\d{9}$/.test(formData.contactNo)) {
      newErrors.contactNo = 'Contact number should start with +91 followed by 7, 8, or 9 and a valid 10-digit number';
    }

    // Office Location Validation
    if (formData.address && !/^[a-zA-Z0-9\s,.-]{5,}$/.test(formData.address.trim())) {
      newErrors.address = 'Office location should be in valid text format (min 5 characters)';
    }

    if (formData.userRole && formData.email) {
      const restrictedEmails = [
        roleEmailMap['Super Admin'],
        roleEmailMap['Company Admin'],
        roleEmailMap['Project Manager'],
        roleEmailMap['HR'],
        roleEmailMap['Team Lead']
      ];

      if (formData.userRole !== 'Viewers') {
        const expectedEmail = roleEmailMap[formData.userRole];
        if (formData.email !== expectedEmail) {
          newErrors.email = `Only ${expectedEmail} is authorized for ${formData.userRole}`;
        }
      }
    }

    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password = 'Must be 8+ chars, include a number and a capital letter';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.userRole,
        contactNo: formData.contactNo,
        address: formData.address,
        companyName: 'KavyaMargin'
      });
      console.log('Register response:', response.data);
      
      localStorage.setItem('registrationComplete', 'true');
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setErrors({ email: err.response?.data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 py-12">
      <div className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 lg:p-12 shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-2xl text-blue-500 mb-4 border border-blue-500/20 shadow-lg shadow-blue-500/10">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Kavya<span className="text-blue-500">Margin</span></h1>
          <p className="text-slate-400 mt-2 font-medium">Create your enterprise account</p>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Nayan Sharma"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-950 border ${errors.fullName ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-sm focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-600 font-medium`}
                />
              </div>
              {errors.fullName && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.fullName}</p>}
            </div>

            {/* Contact No */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contact No</label>
              <div className="relative group">
                <Phone className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-950 border ${errors.contactNo ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-sm focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-600 font-medium`}
                />
              </div>
              {errors.contactNo && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.contactNo}</p>}
            </div>

            {/* User Role Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">User Role</label>
              <div className="relative group">
                <ShieldCheck className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                <select 
                  name="userRole"
                  value={formData.userRole}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-950 border ${errors.userRole ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-sm focus:border-blue-500 outline-none transition-all text-white appearance-none cursor-pointer font-medium`}
                >
                  <option value="" disabled className="bg-slate-950">Select User Role</option>
                  <option value="Super Admin" className="bg-slate-950">Super Admin</option>
                  <option value="Company Admin" className="bg-slate-950">Company Admin</option>
                  <option value="Project Manager" className="bg-slate-950">Project Manager</option>
                  <option value="HR" className="bg-slate-950">HR</option>
                  <option value="Team Lead" className="bg-slate-950">Team Lead</option>
                  <option value="Viewers" className="bg-slate-950">Viewers</option>
                </select>
              </div>
              {errors.userRole && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.userRole}</p>}
            </div>

            {/* Work Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@kavyainfoweb.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-950 border ${errors.email ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-sm focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-600 font-medium`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-slate-950 border ${errors.password ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-sm focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-600 font-medium`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-slate-950 border ${errors.confirmPassword ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-sm focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-600 font-medium`}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Office Location</label>
            <div className="relative group">
              <MapPin className="w-5 h-5 text-slate-500 absolute left-4 top-4 group-focus-within:text-blue-500 transition-colors" />
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                placeholder="Complete office address..."
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-950 border ${errors.address ? 'border-rose-500' : 'border-slate-800'} rounded-xl text-sm focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-600 resize-none font-medium`}
              ></textarea>
            </div>
            {errors.address && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.address}</p>}
          </div>

          <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] mt-4">
            Create Account
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800 pt-8">
          <p className="text-slate-400 font-medium">
            Already have an enterprise account?{' '}
            <Link to="/login" className="text-blue-500 font-bold hover:text-blue-400 transition-colors ml-1">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
