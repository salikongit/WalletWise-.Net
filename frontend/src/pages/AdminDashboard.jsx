import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Users, DollarSign, TrendingUp, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await adminAPI.getStatistics();
      setStatistics(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !statistics) {
    return <ErrorMessage message={error} />;
  }

  const userStatusData = [
    { name: 'Active Users', value: statistics?.activeUsers || 0 },
    { name: 'Inactive Users', value: statistics?.inactiveUsers || 0 },
  ];

  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="space-y-6">
      <h1 className="page-title">Admin Dashboard</h1>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-primary-600">
                {statistics?.totalUsers || 0}
              </p>
            </div>
            <Users className="h-10 w-10 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-success-600">
                {statistics?.activeUsers || 0}
              </p>
            </div>
            <Users className="h-10 w-10 text-success-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Loans</p>
              <p className="text-2xl font-bold text-primary-600">
                {statistics?.totalLoans || 0}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Investments</p>
              <p className="text-2xl font-bold text-primary-600">
                {statistics?.totalInvestments || 0}
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="section-title">Total Loan Amount</h2>
          <p className="text-3xl font-bold text-primary-600">
            ₹{statistics?.totalLoanAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>

        <div className="card">
          <h2 className="section-title">Total Investment Amount</h2>
          <p className="text-3xl font-bold text-success-600">
            ₹{statistics?.totalInvestmentAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="section-title">User Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="section-title">User Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistics?.userStatistics?.slice(0, 10) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="loanCount" fill="#0ea5e9" name="Loans" />
              <Bar dataKey="investmentCount" fill="#22c55e" name="Investments" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;




