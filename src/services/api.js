import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee Services
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

// Auth Services
export const authAPI = {
  login: async (credentials) => {
    const { email, password } = credentials;
    const normalizedEmail = email.toLowerCase().trim();
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const HARDCODED_USERS = {
      'nayan@kavyainfoweb.com': { password: 'Nayan@4664', role: 'Super Admin', fullName: 'Nayan Sharma' },
      'sushil@kavyainfoweb.com': { password: 'Sushil@4664', role: 'Company Admin', fullName: 'Sushil Kumar' },
      'rajni@kavyainfoweb.com': { password: 'Rajni@4664', role: 'Project Manager', fullName: 'Rajni Singh' },
      'raj@kavyainfoweb.com': { password: 'Raj@4664', role: 'HR', fullName: 'Raj Malhotra' },
      'priti@kavyainfoweb.com': { password: 'Priti@4664', role: 'Team Lead', fullName: 'Priti Deshmukh' }
    };

    const user = HARDCODED_USERS[normalizedEmail];
    if (user && user.password === password) {
      return { 
        data: { 
          _id: 'mock_' + Date.now(), 
          ...user, 
          token: 'mock_token_' + Date.now() 
        } 
      };
    }
    
    // Check registered users in localStorage as fallback
    const registeredUsers = JSON.parse(localStorage.getItem('mock_registered_users')) || [];
    const registeredUser = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (registeredUser && registeredUser.password === password) {
      return { 
        data: { 
          _id: 'reg_' + Date.now(), 
          ...registeredUser, 
          token: 'mock_token_reg_' + Date.now() 
        } 
      };
    }

    throw { response: { data: { message: 'Invalid email or password' } } };
  },
  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const registeredUsers = JSON.parse(localStorage.getItem('mock_registered_users')) || [];
    const exists = registeredUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) throw { response: { data: { message: 'User already registered' } } };
    
    const newUser = { ...userData, id: 'user_' + Date.now() };
    localStorage.setItem('mock_registered_users', JSON.stringify([...registeredUsers, newUser]));
    return { data: { message: 'Registration successful!', success: true } };
  }
};

// Bench Services
export const benchAPI = {
  getAll: () => api.get('/bench'),
  create: (data) => api.post('/bench', data),
  update: (id, data) => api.put(`/bench/${id}`, data),
  delete: (id) => api.delete(`/bench/${id}`),
};

// Resource Services
export const resourceAPI = {
  getAll: () => api.get('/resources'),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
};

// Invoice Services
export const invoiceAPI = {
  getAll: () => api.get('/invoices'),
  create: (data) => api.post('/invoices', data),
};
// Revenue Forecast Services
export const revenueAPI = {
  getAll: () => api.get('/revenue'),
};

// Forecast API
export const forecastAPI = {
  getProjections: () => {
    // Mock data simulation
    const mockData = {
      projections: [
        { month: 'Jul', revenue: 450000, cost: 280000, target: 400000 },
        { month: 'Aug', revenue: 480000, cost: 300000, target: 420000 },
        { month: 'Sep', revenue: 520000, cost: 310000, target: 450000 },
        { month: 'Oct', revenue: 550000, cost: 330000, target: 480000 },
        { month: 'Nov', revenue: 580000, cost: 340000, target: 500000 },
        { month: 'Dec', revenue: 620000, cost: 360000, target: 550000 },
      ],
      summary: {
        totalEstRevenue: 3200000,
        totalEstCost: 1920000,
        projectedMargin: 40,
        forecastAccuracy: 92,
      },
      recommendations: [
        { impact: 'High', title: 'Focus on Enterprise Clients', desc: 'Upsell existing enterprise clients to higher-tier plans for a potential 15% revenue increase.' },
        { impact: 'Medium', title: 'Optimize Cloud Spend', desc: 'Implement cost-saving measures on cloud infrastructure to reduce operational costs by 8%.' },
        { impact: 'Low', title: 'Streamline Internal Workflows', desc: 'Automate repetitive tasks to improve team productivity and reduce overhead.' },
      ],
    };
    return Promise.resolve({ data: mockData });
  },
};

// Risk Analysis Services
export const riskAPI = {
  getAll: () => api.get('/risks'),
  create: (data) => api.post('/risks', data),
  update: (id, data) => api.put(`/risks/${id}`, data),
  delete: (id) => api.delete(`/risks/${id}`),
};

// Margin Tracker Services
export const marginAPI = {
  getAll: () => api.get('/margins'),
  create: (data) => api.post('/margins', data),
  update: (id, data) => api.put(`/margins/${id}`, data),
  delete: (id) => api.delete(`/margins/${id}`),
};

// Contract Services
export const contractAPI = {
  getAll: () => api.get('/contracts'),
  create: (data) => api.post('/contracts', data),
  getById: (id) => api.get(`/contracts/${id}`),
  update: (id, data) => api.put(`/contracts/${id}`, data),
  delete: (id) => api.delete(`/contracts/${id}`),
};



// Company Services
export const companyAPI = {
  get: () => api.get('/company'),
  update: (data) => api.put('/company', data),
};

// Billing Model Services
export const billingAPI = {
  getAll: () => api.get('/billing-models'),
  create: (data) => api.post('/billing-models', data),
  update: (id, data) => api.put(`/billing-models/${id}`, data),
  delete: (id) => api.delete(`/billing-models/${id}`),
};

// Department Services
export const departmentAPI = {
  getAll: () => api.get('/departments'),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// Dashboard Services
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default {};
