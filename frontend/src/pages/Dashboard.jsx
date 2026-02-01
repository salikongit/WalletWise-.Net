// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { dashboardAPI, reportsAPI, userDataAPI } from '../services/api';
// import LoadingSpinner from '../components/LoadingSpinner';
// import ErrorMessage from '../components/ErrorMessage';
// import { DollarSign, TrendingUp, TrendingDown, Wallet, Download, Trash2, AlertCircle } from 'lucide-react';
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [downloading, setDownloading] = useState(false);
//   const [showResetDialog, setShowResetDialog] = useState(false);
//   const [resetting, setResetting] = useState(false);

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   const fetchDashboard = async () => {
//     try {
//       const response = await dashboardAPI.getDashboard();
//       console.log('Dashboard API Response:', response.data); // Debug log
//       setDashboardData(response.data);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadReport = async () => {
//     setDownloading(true);
//     try {
//       const response = await reportsAPI.downloadFinancialReport();
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `FinancialReport_${new Date().toISOString().split('T')[0]}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//       toast.success('Report downloaded successfully');
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Failed to download report');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const handleResetData = async () => {
//     setResetting(true);
//     try {
//       await userDataAPI.resetData();
//       toast.success('All data deleted successfully. Redirecting to onboarding...');
//       setTimeout(() => {
//         navigate('/onboarding-wizard');
//       }, 2000);
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Failed to reset data');
//     } finally {
//       setResetting(false);
//       setShowResetDialog(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   if (error && !dashboardData) {
//     return <ErrorMessage message={error} />;
//   }

//   const expenseData = dashboardData?.recentExpenses?.map((exp) => ({
//     name: exp.expenseName,
//     amount: exp.amount,
//   })) || [];

//   const incomeData = dashboardData?.recentIncomes?.map((inc) => ({
//     name: inc.incomeSource,
//     amount: inc.amount,
//   })) || [];

//   const categoryData = [
//     { name: 'Income', value: dashboardData?.totalIncome || 0 },
//     { name: 'Expenses', value: dashboardData?.totalExpenses || 0 },
//     { name: 'EMI', value: dashboardData?.totalMonthlyEmi || 0 },
//     { name: 'Available for Investment', value: Math.max(0, dashboardData?.availableForInvestment || 0) },
//   ].filter(item => item.value > 0); // Only show categories with values

//   const COLORS = ['#22c55e', '#ef4444', '#f97316', '#0ea5e9'];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="page-title">Financial Dashboard</h1>
//         <div className="flex gap-3">
//           <button
//             onClick={() => setShowResetDialog(true)}
//             className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//           >
//             <Trash2 className="mr-2 h-4 w-4" />
//             Reset Data
//           </button>
//           <button
//             onClick={handleDownloadReport}
//             disabled={downloading}
//             className="btn-primary flex items-center"
//           >
//             <Download className="mr-2 h-4 w-4" />
//             {downloading ? 'Downloading...' : 'Download Report'}
//           </button>
//         </div>
//       </div>

//       <ErrorMessage message={error} onClose={() => setError('')} />

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//         <div className="card">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Income</p>
//               <p className="text-2xl font-bold text-success-600">
//                 ₹{dashboardData?.totalIncome?.toLocaleString('en-IN') || '0'}
//               </p>
//             </div>
//             <TrendingUp className="h-10 w-10 text-success-600" />
//           </div>
//         </div>

//         <div className="card">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Expenses</p>
//               <p className="text-2xl font-bold text-danger-600">
//                 ₹{dashboardData?.totalExpenses?.toLocaleString('en-IN') || '0'}
//               </p>
//             </div>
//             <TrendingDown className="h-10 w-10 text-danger-600" />
//           </div>
//         </div>

//         <div className="card">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Monthly EMI</p>
//               <p className="text-2xl font-bold text-orange-600">
//                 ₹{dashboardData?.totalMonthlyEmi?.toLocaleString('en-IN') || '0'}
//               </p>
//             </div>
//             <AlertCircle className="h-10 w-10 text-orange-600" />
//           </div>
//         </div>

//         <div className="card">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Net Savings</p>
//               <p className={`text-2xl font-bold ${
//                 (dashboardData?.totalSavings || 0) >= 0 ? 'text-primary-600' : 'text-red-600'
//               }`}>
//                 ₹{dashboardData?.totalSavings?.toLocaleString('en-IN') || '0'}
//               </p>
//               <p className="text-xs text-gray-500">After EMI deduction</p>
//             </div>
//             <Wallet className="h-10 w-10 text-primary-600" />
//           </div>
//         </div>

//         <div className="card">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Available for Investment</p>
//               <p className={`text-2xl font-bold ${
//                 (dashboardData?.availableForInvestment || 0) > 0 ? 'text-green-600' : 'text-gray-400'
//               }`}>
//                 ₹{dashboardData?.availableForInvestment?.toLocaleString('en-IN') || '0'}
//               </p>
//               {(dashboardData?.availableForInvestment || 0) > 0 && (
//                 <button 
//                   onClick={() => navigate('/investment-selection')}
//                   className="text-xs text-blue-600 hover:text-blue-800 mt-1"
//                 >
//                   Invest Now →
//                 </button>
//               )}
//             </div>
//             <DollarSign className="h-10 w-10 text-green-600" />
//           </div>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="card">
//           <h2 className="section-title">Financial Breakdown</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={categoryData}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {categoryData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="card">
//           <h2 className="section-title">Recent Expenses</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={expenseData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
//               <Bar dataKey="amount" fill="#ef4444" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="card">
//           <h2 className="section-title">Recent Incomes</h2>
//           <div className="space-y-3">
//             {dashboardData?.recentIncomes?.length > 0 ? (
//               dashboardData.recentIncomes.map((income) => (
//                 <div key={income.incomeId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                   <div>
//                     <p className="font-medium">{income.incomeSource}</p>
//                     <p className="text-sm text-gray-500">{income.category}</p>
//                   </div>
//                   <p className="font-bold text-success-600">₹{income.amount.toLocaleString('en-IN')}</p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 text-center py-4">No income records found</p>
//             )}
//           </div>
//         </div>

//         <div className="card">
//           <h2 className="section-title">Recent Expenses</h2>
//           <div className="space-y-3">
//             {dashboardData?.recentExpenses?.length > 0 ? (
//               dashboardData.recentExpenses.map((expense) => (
//                 <div key={expense.expenseId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                   <div>
//                     <p className="font-medium">{expense.expenseName}</p>
//                     <p className="text-sm text-gray-500">{expense.category}</p>
//                   </div>
//                   <p className="font-bold text-danger-600">₹{expense.amount.toLocaleString('en-IN')}</p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 text-center py-4">No expense records found</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Active Loans Table */}
//       {dashboardData?.activeLoans?.length > 0 && (
//         <div className="card">
//           <h2 className="section-title">Active Loans & EMI Details</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Loan Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Principal Amount
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Monthly EMI
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Tenure (Months)
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {dashboardData.activeLoans.map((loan, index) => (
//                   <tr key={loan.loanId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {loan.loanName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       ₹{loan.principalAmount?.toLocaleString('en-IN')}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
//                       ₹{loan.emiAmount?.toLocaleString('en-IN')}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {loan.tenureMonths} months
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Reset Data Confirmation Dialog */}
//       {showResetDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <div className="flex items-center mb-4">
//               <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
//               <h3 className="text-xl font-bold text-gray-900">Reset All Data</h3>
//             </div>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete all your financial data? This action cannot be undone. 
//               You will be redirected to the onboarding wizard to start fresh.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowResetDialog(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                 disabled={resetting}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleResetData}
//                 disabled={resetting}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
//               >
//                 {resetting ? 'Deleting...' : 'Yes, Delete All'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;



import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { dashboardAPI, reportsAPI, userDataAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Material UI Icons
import TrendingUpIcon         from '@mui/icons-material/TrendingUp';
import TrendingDownIcon       from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon        from '@mui/icons-material/AttachMoney';
import DownloadIcon           from '@mui/icons-material/Download';
import DeleteSweepIcon        from '@mui/icons-material/DeleteSweep';
import WarningAmberIcon       from '@mui/icons-material/WarningAmber';
import CreditCardIcon         from '@mui/icons-material/CreditCard';
import BarChartIcon           from '@mui/icons-material/BarChart';
import PieChartIcon           from '@mui/icons-material/PieChart';
import WalletIcon from '@mui/icons-material/Wallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CloseIcon from '@mui/icons-material/Close';

import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ─────────────────────────────────────────────
   CUSTOM RECHARTS TOOLTIP
   ───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="dash-tooltip">
      <div className="dash-tooltip__label">{label}</div>
      <div
        className="dash-tooltip__value"
        style={{ color: payload[0].color || '#6c63ff' }}
      >
        ₹{payload[0].value?.toLocaleString('en-IN')}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SUMMARY CARD — reusable sub-component
   ───────────────────────────────────────────── */
const SummaryCard = ({
  label,
  value,
  textClass,
  iconBgClass,
  Icon,
  iconColor,
  sub,
  showInvest,
  onInvest,
}) => (
  <div className="dash-glass-card dash-summary-card">
    <div className="dash-summary-card__top">
      <div>
        <p className="dash-summary-card__label">{label}</p>
        <p className={`dash-summary-card__value ${textClass}`}>
          ₹{value?.toLocaleString('en-IN') || '0'}
        </p>
        {sub && <p className="dash-summary-card__sub">{sub}</p>}
        {showInvest && (
          <span className="dash-invest-link" onClick={onInvest}>
            Invest Now →
          </span>
        )}
      </div>
      <div className={`dash-summary-card__icon ${iconBgClass}`}>
        <Icon style={{ color: iconColor }} />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   TRANSACTION ROW — reusable sub-component
   ───────────────────────────────────────────── */
const TransactionRow = ({ id, name, category, amount, amountClass }) => (
  <div className="dash-transaction-item" key={id}>
    <div>
      <p className="dash-transaction-item__name">{name}</p>
      <p className="dash-transaction-item__cat">{category}</p>
    </div>
    <p className={`dash-transaction-item__amount ${amountClass}`}>
      ₹{amount.toLocaleString('en-IN')}
    </p>
  </div>
);

/* ─────────────────────────────────────────────
   DASHBOARD
   ───────────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData]     = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState('');
  const [downloading, setDownloading]         = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetting, setResetting]             = useState(false);

  useEffect(() => { fetchDashboard(); }, []);

  /* ── API Handlers (logic unchanged) ── */
  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      console.log('Dashboard API Response:', response.data);
      setDashboardData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const response = await reportsAPI.downloadFinancialReport();
      const blob    = new Blob([response.data], { type: 'application/pdf' });
      const url     = window.URL.createObjectURL(blob);
      const link    = document.createElement('a');
      link.href     = url;
      link.download = `FinancialReport_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to download report');
    } finally {
      setDownloading(false);
    }
  };

  const handleResetData = async () => {
    setResetting(true);
    try {
      await userDataAPI.resetData();
      toast.success('All data deleted successfully. Redirecting to onboarding...');
      setTimeout(() => { navigate('/onboarding-wizard'); }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset data');
    } finally {
      setResetting(false);
      setShowResetDialog(false);
    }
  };

  /* ── Loading / hard-error states ── */
  if (loading) {
    return (
      <div className="dash-root" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="dash-root">
        <ErrorMessage message={error} />
      </div>
    );
  }

  /* ── Derived data for charts ── */
  const expenseData = dashboardData?.recentExpenses?.map((exp) => ({
    name: exp.expenseName,
    amount: exp.amount,
  })) || [];

  const categoryData = [
    { name: 'Income',                value: dashboardData?.totalIncome || 0 },
    { name: 'Expenses',             value: dashboardData?.totalExpenses || 0 },
    { name: 'EMI',                  value: dashboardData?.totalMonthlyEmi || 0 },
    { name: 'Available for Invest', value: Math.max(0, dashboardData?.availableForInvestment || 0) },
  ].filter((item) => item.value > 0);

  const PIE_COLORS = ['#00d4aa', '#ff6b6b', '#f9a825', '#29b6f6'];

  /* ── Summary card definitions ── */
  const summaryCards = [
    {
      label: 'Total Income',
      value: dashboardData?.totalIncome,
      textClass: 'dash-text--success',
      iconBgClass: 'dash-icon-bg--success',
      Icon: TrendingUpIcon,
      iconColor: '#00d4aa',
    },
    {
      label: 'Total Expenses',
      value: dashboardData?.totalExpenses,
      textClass: 'dash-text--danger',
      iconBgClass: 'dash-icon-bg--danger',
      Icon: TrendingDownIcon,
      iconColor: '#ff6b6b',
    },
    {
      label: 'Monthly EMI',
      value: dashboardData?.totalMonthlyEmi,
      textClass: 'dash-text--orange',
      iconBgClass: 'dash-icon-bg--orange',
      Icon: CreditCardIcon,
      iconColor: '#f9a825',
    },
    {
      label: 'Net Savings',
      value: dashboardData?.totalSavings,
      textClass: (dashboardData?.totalSavings || 0) >= 0 ? 'dash-text--primary' : 'dash-text--danger',
      iconBgClass: 'dash-icon-bg--primary',
      Icon: AccountBalanceWalletIcon,
      iconColor: '#6c63ff',
      sub: 'After EMI deduction',
    },
    {
      label: 'Available for Investment',
      value: dashboardData?.availableForInvestment,
      textClass: (dashboardData?.availableForInvestment || 0) > 0 ? 'dash-text--blue' : 'dash-text--muted',
      iconBgClass: 'dash-icon-bg--blue',
      Icon: AttachMoneyIcon,
      iconColor: '#29b6f6',
      showInvest: (dashboardData?.availableForInvestment || 0) > 0,
      onInvest: () => navigate('/investment-selection'),
    },
  ];

  /* ─────────────────────────────────────
     RENDER
     ───────────────────────────────────── */
  return (
    <div className="dash-root">

      {/* ────── Header ────── */}
      <div className="dash-header">
        <h1 className="dash-header__title">Financial Dashboard</h1>
        <div className="dash-header__actions">
          <button className="clay-btn clay-btn--danger" onClick={() => setShowResetDialog(true)}>
            <DeleteSweepIcon /> Reset Data
          </button>
          <button
            className="clay-btn clay-btn--primary"
            onClick={handleDownloadReport}
            disabled={downloading}
          >
            <DownloadIcon /> {downloading ? 'Downloading…' : 'Download Report'}
          </button>
        </div>
      </div>

      {/* ────── Inline error (non-fatal) ────── */}
      {error && dashboardData && (
        <div className="dash-error-banner">
          <div className="dash-error-banner__left">
            <WarningAmberIcon style={{ color: '#ff6b6b', width: 18, height: 18 }} />
            <span className="dash-error-banner__text">{error}</span>
          </div>
          <button className="dash-error-banner__close" onClick={() => setError('')}>
            <CloseIcon style={{ color: '#ff6b6b', width: 16, height: 16 }} />
          </button>
        </div>
      )}

      {/* ────── Summary Cards ────── */}
      <div className="dash-summary-grid">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      {/* ────── Charts ────── */}
      <div className="dash-charts-grid">
        {/* Pie – Financial Breakdown */}
        <div className="dash-glass-card">
          <div className="dash-card-title">
            <PieChartIcon /> Financial Breakdown
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={75}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar – Recent Expenses */}
        <div className="dash-glass-card">
          <div className="dash-card-title">
            <BarChartIcon /> Recent Expenses
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={expenseData}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#c0392b" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="url(#barGrad)" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ────── Recent Transactions ────── */}
      <div className="dash-transactions-grid">
        {/* Incomes */}
        <div className="dash-glass-card">
          <div className="dash-card-title">
            <WalletIcon /> Recent Incomes
          </div>
          {dashboardData?.recentIncomes?.length > 0 ? (
            dashboardData.recentIncomes.map((income) => (
              <TransactionRow
                key={income.incomeId}
                id={income.incomeId}
                name={income.incomeSource}
                category={income.category}
                amount={income.amount}
                amountClass="dash-text--success"
              />
            ))
          ) : (
            <p className="dash-empty-state">No income records found</p>
          )}
        </div>

        {/* Expenses */}
        <div className="dash-glass-card">
          <div className="dash-card-title">
            <ReceiptLongIcon /> Recent Expenses
          </div>
          {dashboardData?.recentExpenses?.length > 0 ? (
            dashboardData.recentExpenses.map((expense) => (
              <TransactionRow
                key={expense.expenseId}
                id={expense.expenseId}
                name={expense.expenseName}
                category={expense.category}
                amount={expense.amount}
                amountClass="dash-text--danger"
              />
            ))
          ) : (
            <p className="dash-empty-state">No expense records found</p>
          )}
        </div>
      </div>

      {/* ────── Active Loans Table ────── */}
      {dashboardData?.activeLoans?.length > 0 && (
        <div className="dash-glass-card" style={{ marginBottom: 28 }}>
          <div className="dash-card-title">
            <CreditCardIcon /> Active Loans &amp; EMI Details
          </div>
          <div className="dash-loans-wrap">
            <table className="dash-loans-table">
              <thead>
                <tr>
                  <th>Loan Name</th>
                  <th>Principal Amount</th>
                  <th>Monthly EMI</th>
                  <th>Tenure</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.activeLoans.map((loan) => (
                  <tr key={loan.loanId}>
                    <td>{loan.loanName}</td>
                    <td>₹{loan.principalAmount?.toLocaleString('en-IN')}</td>
                    <td className="dash-loans-table__emi">₹{loan.emiAmount?.toLocaleString('en-IN')}</td>
                    <td>{loan.tenureMonths} months</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ────── Reset Confirmation Modal ────── */}
      {showResetDialog && (
        <div className="dash-modal-overlay">
          <div className="dash-modal">
            <div className="dash-modal__header">
              <div className="dash-modal__icon">
                <WarningAmberIcon />
              </div>
              <h3 className="dash-modal__title">Reset All Data</h3>
            </div>
            <p className="dash-modal__body">
              Are you sure you want to delete all your financial data? This action cannot be undone.
              You will be redirected to the onboarding wizard to start fresh.
            </p>
            <div className="dash-modal__actions">
              <button
                className="clay-btn clay-btn--ghost"
                onClick={() => setShowResetDialog(false)}
                disabled={resetting}
              >
                Cancel
              </button>
              <button
                className="clay-btn clay-btn--danger"
                onClick={handleResetData}
                disabled={resetting}
              >
                {resetting ? 'Deleting…' : 'Yes, Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;