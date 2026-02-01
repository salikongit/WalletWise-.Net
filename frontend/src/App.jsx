import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import MarketOverview from "./pages/MarketOverview";
// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';

// Onboarding Pages
import OnboardingWizard from './pages/OnboardingWizard';

// Customer Pages
import Dashboard from './pages/Dashboard';
import EmiPlanner from './pages/EmiPlanner';
import InvestmentPlanner from './pages/InvestmentPlanner';
import Transactions from './pages/Transactions';
import RealTimeInvestments from './pages/RealTimeInvestments';
import AmortizationTable from './pages/AmortizationTable';
import { ToastContainer } from 'react-toastify';
// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* ------------------ PUBLIC ROUTES ------------------ */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />

        {/* ------------------ ONBOARDING ROUTES ------------------ */}
      <Route
        path="/onboarding-wizard"
        element={
          <ProtectedRoute skipOnboarding={true}>
            <OnboardingWizard />
          </ProtectedRoute>
        }
      />


        {/* ------------------ CUSTOMER ROUTES ------------------ */}
        <Route
          path="/"
          element={
            <ProtectedRoute requiredRole="Customer">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute requiredRole="Customer">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="emi-planner"
            element={
              <ProtectedRoute requiredRole="Customer">
                <EmiPlanner />
              </ProtectedRoute>
            }
          />

          <Route
            path="investment-planner"
            element={
              <ProtectedRoute requiredRole="Customer">
                <InvestmentPlanner />
              </ProtectedRoute>
            }
          />

          <Route
            path="transactions"
            element={
              <ProtectedRoute requiredRole="Customer">
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="market"
            element={
              <ProtectedRoute requiredRole="Customer">
                <MarketOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="investments/realtime"
            element={
              <ProtectedRoute requiredRole="Customer">
                <RealTimeInvestments />
              </ProtectedRoute>
            }
          />
          <Route
            path="loans/amortization"
            element={
              <ProtectedRoute requiredRole="Customer">
                <AmortizationTable />
              </ProtectedRoute>
            }
          />
        </Route>


        {/* ------------------ ADMIN ROUTES ------------------ */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* ------------------ FALLBACK ROUTE ------------------ */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
