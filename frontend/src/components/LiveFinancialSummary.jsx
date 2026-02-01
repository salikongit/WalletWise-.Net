import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { DollarSign, TrendingDown, TrendingUp, CreditCard } from "lucide-react";

const COLORS = ["#6366F1", "#EF4444", "#22C55E"];

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 shadow-md border border-white/40">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${color}`}>
        <Icon className="text-white w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-900">
          ₹{value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  </div>
);

const LiveFinancialSummary = ({
  salary,
  salaryFrequency,
  loans,
  expenses,
}) => {
  const monthlyIncome = useMemo(() => {
    const s = parseFloat(salary || 0);
    return salaryFrequency === "Yearly" ? s / 12 : s;
  }, [salary, salaryFrequency]);

  const totalEMI = useMemo(
    () => loans.reduce((sum, l) => sum + (l.emiAmount || 0), 0),
    [loans]
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    [expenses]
  );

  const remaining = monthlyIncome - totalEMI - totalExpenses;

  const pieData = [
    { name: "EMI", value: totalEMI },
    { name: "Expenses", value: totalExpenses },
    { name: "Savings", value: Math.max(remaining, 0) },
  ];

  const barData = [
    { name: "Income", amount: monthlyIncome },
    { name: "EMI", amount: totalEMI },
    { name: "Expenses", amount: totalExpenses },
    { name: "Savings", amount: Math.max(remaining, 0) },
  ];

  return (
    <div className="lg:sticky lg:top-6 space-y-6">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-5 shadow-lg border border-white/40">
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          Live Financial Summary
        </h3>
        <p className="text-xs text-gray-500">
          Updates automatically as you fill the form
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={DollarSign}
          label="Monthly Income"
          value={monthlyIncome}
          color="bg-indigo-500"
        />
        <StatCard
          icon={CreditCard}
          label="Total EMI"
          value={totalEMI}
          color="bg-red-500"
        />
        <StatCard
          icon={TrendingDown}
          label="Expenses"
          value={totalExpenses}
          color="bg-orange-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Available"
          value={remaining > 0 ? remaining : 0}
          color="bg-green-500"
        />
      </div>

      {/* Pie Chart */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-5 shadow-lg border border-white/40">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Income Distribution
        </h4>
        <div className="h-48">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-5 shadow-lg border border-white/40">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Monthly Cash Flow
        </h4>
        <div className="h-48">
          <ResponsiveContainer>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
              <Bar dataKey="amount" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Warnings */}
      {monthlyIncome > 0 && totalEMI / monthlyIncome > 0.4 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          ⚠️ EMI exceeds 40% of income. This may affect investment safety.
        </div>
      )}
    </div>
  );
};

export default LiveFinancialSummary;
