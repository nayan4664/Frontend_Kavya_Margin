import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

// Pages - Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Pages - Dashboard
import Dashboard from '../pages/dashboard/Dashboard';

// Pages - Organization
import CompanySetup from '../pages/organization/CompanySetup';
import BillingModel from '../pages/organization/BillingModel';
import DepartmentMapping from '../pages/organization/DepartmentMapping';

// Pages - Employee Cost
import EmployeeCostList from '../pages/employee-cost/EmployeeCostList';
import AddEmployeeCost from '../pages/employee-cost/AddEmployeeCost';
import CostBreakdown from '../pages/employee-cost/CostBreakdown';

// Pages - Billing
import BillingRateConfig from '../pages/billing/BillingRateConfig';
import MarginCalculator from '../pages/billing/MarginCalculator';
import ScenarioSimulator from '../pages/billing/ScenarioSimulator';

// Pages - Margin Tracker
import ProjectMarginDashboard from '../pages/margin-tracker/ProjectMarginDashboard';
import BudgetTracking from '../pages/margin-tracker/BudgetTracking';
import BurnRate from '../pages/margin-tracker/BurnRate';

// Pages - AI Prediction
import MarginPrediction from '../pages/ai-prediction/MarginPrediction';
import RiskAnalysis from '../pages/ai-prediction/RiskAnalysis';
import ForecastInsights from '../pages/ai-prediction/ForecastInsights';

// Pages - Resource Allocation
import ResourceDashboard from '../pages/resource-allocation/ResourceDashboard';
import SkillMapping from '../pages/resource-allocation/SkillMapping';
import AvailabilityTracker from '../pages/resource-allocation/AvailabilityTracker';

// Pages - Bench Management
import BenchList from '../pages/bench-management/BenchList';
import BenchCostAnalysis from '../pages/bench-management/BenchCostAnalysis';
import ReallocationSuggestions from '../pages/bench-management/ReallocationSuggestions';

// Pages - Contract Analyzer
import UploadContract from '../pages/contract-analyzer/UploadContract';
import ContractInsights from '../pages/contract-analyzer/ContractInsights';
import SLAAnalysis from '../pages/contract-analyzer/SLAAnalysis';

// Pages - Invoicing
import InvoiceList from '../pages/invoicing/InvoiceList';
import GenerateInvoice from '../pages/invoicing/GenerateInvoice';
import PaymentTracking from '../pages/invoicing/PaymentTracking';

// Pages - Revenue Forecast
import RevenueDashboard from '../pages/revenue-forecast/RevenueDashboard';
import ForecastReport from '../pages/revenue-forecast/ForecastReport';
import MarginTrends from '../pages/revenue-forecast/MarginTrends';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem('currentUser');
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const currentUser = JSON.parse(userStr);
    
    // If user is logged in but has no role (shouldn't happen), redirect to login
    if (!currentUser || !currentUser.role) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  } catch (e) {
    console.error('Error parsing user in ProtectedRoute:', e);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

const RegistrationGuard = ({ children }) => {
  const hasRegistered = localStorage.getItem('registrationComplete');
  
  if (!hasRegistered) {
    return <Navigate to="/register" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route 
          path="/login" 
          element={
            <RegistrationGuard>
              <Login />
            </RegistrationGuard>
          } 
        />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  
                  {/* Organization */}
                  <Route path="organization/company-setup" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin']}><CompanySetup /></ProtectedRoute>} />
                  <Route path="organization/billing-model" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin']}><BillingModel /></ProtectedRoute>} />
                  <Route path="organization/department-mapping" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin']}><DepartmentMapping /></ProtectedRoute>} />

                  {/* Employee Cost */}
                  <Route path="employee-cost/list" element={<EmployeeCostList />} />
                  <Route path="employee-cost/add" element={<AddEmployeeCost />} />
                  <Route path="employee-cost/edit/:id" element={<AddEmployeeCost />} />
                  <Route path="employee-cost/breakdown" element={<CostBreakdown />} />

                  {/* Billing */}
                  <Route path="billing/rate-config" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Project Manager', 'Team Lead']}><BillingRateConfig /></ProtectedRoute>} />
                  <Route path="billing/margin-calculator" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Project Manager', 'Team Lead']}><MarginCalculator /></ProtectedRoute>} />
                  <Route path="billing/scenario-simulator" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Project Manager', 'Team Lead']}><ScenarioSimulator /></ProtectedRoute>} />

                  {/* Margin Tracker */}
                  <Route path="margin-tracker/dashboard" element={<ProjectMarginDashboard />} />
                  <Route path="margin-tracker/budget-tracking" element={<BudgetTracking />} />
                  <Route path="margin-tracker/burn-rate" element={<BurnRate />} />

                  {/* AI Prediction */}
                  <Route path="ai-prediction/margin-prediction" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Project Manager', 'Team Lead']}><MarginPrediction /></ProtectedRoute>} />
                  <Route path="ai-prediction/risk-analysis" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Project Manager', 'Team Lead']}><RiskAnalysis /></ProtectedRoute>} />
                  <Route path="ai-prediction/forecast-insights" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Project Manager', 'Team Lead']}><ForecastInsights /></ProtectedRoute>} />

                  {/* Resource Allocation */}
                  <Route path="resource-allocation/dashboard" element={<ResourceDashboard />} />
                  <Route path="resource-allocation/skill-mapping" element={<SkillMapping />} />
                  <Route path="resource-allocation/availability-tracker" element={<AvailabilityTracker />} />

                  {/* Bench Management */}
                  <Route path="bench-management/list" element={<BenchList />} />
                  <Route path="bench-management/cost-analysis" element={<BenchCostAnalysis />} />
                  <Route path="bench-management/reallocation-suggestions" element={<ReallocationSuggestions />} />

                  {/* Contract Analyzer */}
                  <Route path="contract-analyzer/upload" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Project Manager']}><UploadContract /></ProtectedRoute>} />
                  <Route path="contract-analyzer/insights" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Project Manager']}><ContractInsights /></ProtectedRoute>} />
                  <Route path="contract-analyzer/sla-analysis" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Project Manager']}><SLAAnalysis /></ProtectedRoute>} />

                  {/* Invoicing */}
                  <Route path="invoicing/list" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Project Manager', 'HR', 'Viewers']}><InvoiceList /></ProtectedRoute>} />
                  <Route path="invoicing/generate" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Project Manager', 'HR', 'Viewers']}><GenerateInvoice /></ProtectedRoute>} />
                  <Route path="invoicing/payment-tracking" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Project Manager', 'HR', 'Viewers']}><PaymentTracking /></ProtectedRoute>} />

                  {/* Revenue Forecast */}
                  <Route path="revenue-forecast/dashboard" element={<RevenueDashboard />} />
                  <Route path="revenue-forecast/report" element={<ForecastReport />} />
                  <Route path="revenue-forecast/margin-trends" element={<ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Project Manager', 'HR', 'Team Lead', 'Viewers']}><MarginTrends /></ProtectedRoute>} />

                  {/* Redirect for unknown dashboard routes */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
