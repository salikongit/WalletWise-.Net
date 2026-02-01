import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { financeAPI, loansAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Material UI Icons
import CalculatorIcon    from '@mui/icons-material/Calculate';
import SaveIcon          from '@mui/icons-material/Save';
import CheckCircleIcon   from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon  from '@mui/icons-material/ErrorOutline';
import CloseIcon         from '@mui/icons-material/Close';
import TableChartIcon    from '@mui/icons-material/TableChart';
import ShowChartIcon     from '@mui/icons-material/ShowChart';

import {
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dash-tooltip">
      <div className="dash-tooltip__label">Month {label}</div>
      {payload.map((p, i) => (
        <div key={i} className="dash-tooltip__value" style={{ color: p.color }}>
          {p.name}: ₹{p.value?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
      ))}
    </div>
  );
};

const EmiPlanner = () => {
  const [formData, setFormData] = useState({
    loanName: '',
    principalAmount: '',
    interestRate: '',
    tenureMonths: '',
  });
  const [emiResult,  setEmiResult]  = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  /* ── API: calculate ── */
  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmiResult(null);
    try {
      const response = await financeAPI.calculateEmi({
        principalAmount: parseFloat(formData.principalAmount),
        interestRate:    parseFloat(formData.interestRate),
        tenureMonths:    parseInt(formData.tenureMonths),
      });
      setEmiResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate EMI');
    } finally {
      setLoading(false);
    }
  };

  /* ── API: save loan ── */
  const handleSave = async () => {
    if (!emiResult) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await loansAPI.create({
        loanName:        formData.loanName || 'Untitled Loan',
        principalAmount: parseFloat(formData.principalAmount),
        interestRate:    parseFloat(formData.interestRate),
        tenureMonths:    parseInt(formData.tenureMonths),
      });
      setSuccess('Loan saved successfully!');
      setFormData({ loanName: '', principalAmount: '', interestRate: '', tenureMonths: '' });
      setEmiResult(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save loan');
    } finally {
      setSaving(false);
    }
  };

  const chartData = emiResult?.amortizationSchedule?.slice(0, 12) || [];

  /* ─────────────────────────────────────
     RENDER
     ───────────────────────────────────── */
  return (
    <div className="dash-root">

      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">EMI Planner</h1>
          <p className="dash-header__sub">Calculate and manage your loan EMIs</p>
        </div>
      </div>

      {/* Two-column: Form | Results */}
      <div className="emi-grid">

        {/* ── Form Card ── */}
        <div className="dash-glass-card dash-glass-card--static">
          <div className="dash-card-title">
            <CalculatorIcon /> Loan Details
          </div>

          {/* Error */}
          {error && (
            <div className="dash-error-banner">
              <div className="dash-error-banner__left">
                <ErrorOutlineIcon style={{ color: '#ff6b6b', width: 18, height: 18 }} />
                <span className="dash-error-banner__text">{error}</span>
              </div>
              <button className="dash-error-banner__close" onClick={() => setError('')}>
                <CloseIcon style={{ color: '#ff6b6b', width: 16, height: 16 }} />
              </button>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="dash-success-banner">
              <div className="dash-success-banner__left">
                <CheckCircleIcon style={{ color: '#00d4aa', width: 18, height: 18 }} />
                <span className="dash-success-banner__text">{success}</span>
              </div>
              <button className="dash-success-banner__close" onClick={() => setSuccess('')}>
                <CloseIcon style={{ color: '#00d4aa', width: 16, height: 16 }} />
              </button>
            </div>
          )}

          <form onSubmit={handleCalculate}>
            <div className="dash-field">
              <label className="dash-label">Loan Name (Optional)</label>
              <input type="text" name="loanName" className="dash-input" placeholder="e.g., Home Loan" value={formData.loanName} onChange={handleChange} />
            </div>

            <div className="dash-field">
              <label className="dash-label">Principal Amount (₹)</label>
              <input type="number" name="principalAmount" required min="0" step="0.01" className="dash-input" placeholder="1000000" value={formData.principalAmount} onChange={handleChange} />
            </div>

            <div className="dash-field">
              <label className="dash-label">Annual Interest Rate (%)</label>
              <input type="number" name="interestRate" required min="0" max="100" step="0.01" className="dash-input" placeholder="8.5" value={formData.interestRate} onChange={handleChange} />
            </div>

            <div className="dash-field">
              <label className="dash-label">Tenure (Months)</label>
              <input type="number" name="tenureMonths" required min="1" max="600" className="dash-input" placeholder="240" value={formData.tenureMonths} onChange={handleChange} />
            </div>

            <button type="submit" disabled={loading} className="clay-btn clay-btn--primary clay-btn--full">
              {loading ? <LoadingSpinner size="sm" /> : <><CalculatorIcon /> Calculate EMI</>}
            </button>
          </form>
        </div>

        {/* ── Results Card ── */}
        {emiResult && (
          <div className="dash-glass-card dash-glass-card--static">
            <div className="dash-card-title">
              <ShowChartIcon /> EMI Results
            </div>

            {/* Big EMI number */}
            <div className="dash-highlight">
              <div className="dash-highlight__label">Monthly EMI</div>
              <div className="dash-highlight__value">
                ₹{emiResult.emiAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Total Amount | Total Interest */}
            <div className="dash-stats-row">
              <div className="dash-stat-box">
                <div className="dash-stat-box__label">Total Amount</div>
                <div className="dash-stat-box__value">
                  ₹{emiResult.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="dash-stat-box">
                <div className="dash-stat-box__label">Total Interest</div>
                <div className="dash-stat-box__value">
                  ₹{emiResult.totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Save */}
            <button onClick={handleSave} disabled={saving} className="clay-btn clay-btn--primary clay-btn--full">
              <SaveIcon /> {saving ? 'Saving…' : 'Save Loan'}
            </button>
          </div>
        )}
      </div>

      {/* ── Amortization Chart ── */}
      {emiResult && chartData.length > 0 && (
        <div className="dash-glass-card dash-glass-card--static" style={{ marginBottom: 24 }}>
          <div className="dash-card-title">
            <ShowChartIcon /> Amortization Schedule — First 12 Months
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="principal" stroke="#29b6f6" name="Principal" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="interest"  stroke="#ff6b6b" name="Interest"  strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Full Amortization Table ── */}
      {emiResult?.amortizationSchedule && (
        <div className="dash-glass-card dash-glass-card--static">
          <div className="dash-card-title">
            <TableChartIcon /> Full Amortization Schedule
          </div>
          <div className="dash-amort-wrap">
            <table className="dash-amort-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {emiResult.amortizationSchedule.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>₹{row.principal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td>₹{row.interest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td>₹{row.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmiPlanner;



// import { useState } from 'react';
// import { financeAPI, loansAPI } from '../services/api';
// import LoadingSpinner from '../components/LoadingSpinner';
// import ErrorMessage from '../components/ErrorMessage';
// import SuccessMessage from '../components/SuccessMessage';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';
// import { Calculator, Save } from 'lucide-react';

// const EmiPlanner = () => {
//   const [formData, setFormData] = useState({
//     loanName: '',
//     principalAmount: '',
//     interestRate: '',
//     tenureMonths: '',
//   });
//   const [emiResult, setEmiResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     setError('');
//     setSuccess('');
//   };

//   const handleCalculate = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setEmiResult(null);

//     try {
//       const response = await financeAPI.calculateEmi({
//         principalAmount: parseFloat(formData.principalAmount),
//         interestRate: parseFloat(formData.interestRate),
//         tenureMonths: parseInt(formData.tenureMonths),
//       });
//       setEmiResult(response.data);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to calculate EMI');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!emiResult) return;

//     setSaving(true);
//     setError('');
//     setSuccess('');

//     try {
//       await loansAPI.create({
//         loanName: formData.loanName || 'Untitled Loan',
//         principalAmount: parseFloat(formData.principalAmount),
//         interestRate: parseFloat(formData.interestRate),
//         tenureMonths: parseInt(formData.tenureMonths),
//       });
//       setSuccess('Loan saved successfully!');
//       setFormData({
//         loanName: '',
//         principalAmount: '',
//         interestRate: '',
//         tenureMonths: '',
//       });
//       setEmiResult(null);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to save loan');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const chartData = emiResult?.amortizationSchedule?.slice(0, 12) || [];

//   return (
//     <div className="space-y-6">
//       <h1 className="page-title">EMI Planner</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Input Form */}
//         <div className="card">
//           <div className="flex items-center mb-4">
//             <Calculator className="h-6 w-6 text-primary-600 mr-2" />
//             <h2 className="section-title">Loan Details</h2>
//           </div>

//           <ErrorMessage message={error} onClose={() => setError('')} />
//           <SuccessMessage message={success} onClose={() => setSuccess('')} />

//           <form onSubmit={handleCalculate} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Loan Name (Optional)
//               </label>
//               <input
//                 type="text"
//                 name="loanName"
//                 className="input-field"
//                 placeholder="e.g., Home Loan"
//                 value={formData.loanName}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Principal Amount (₹)
//               </label>
//               <input
//                 type="number"
//                 name="principalAmount"
//                 required
//                 min="0"
//                 step="0.01"
//                 className="input-field"
//                 placeholder="1000000"
//                 value={formData.principalAmount}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Annual Interest Rate (%)
//               </label>
//               <input
//                 type="number"
//                 name="interestRate"
//                 required
//                 min="0"
//                 max="100"
//                 step="0.01"
//                 className="input-field"
//                 placeholder="8.5"
//                 value={formData.interestRate}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Tenure (Months)
//               </label>
//               <input
//                 type="number"
//                 name="tenureMonths"
//                 required
//                 min="1"
//                 max="600"
//                 className="input-field"
//                 placeholder="240"
//                 value={formData.tenureMonths}
//                 onChange={handleChange}
//               />
//             </div>

//             <button type="submit" disabled={loading} className="w-full btn-primary">
//               {loading ? <LoadingSpinner size="sm" /> : 'Calculate EMI'}
//             </button>
//           </form>
//         </div>

//         {/* Results */}
//         {emiResult && (
//           <div className="card">
//             <h2 className="section-title">EMI Calculation Results</h2>
            
//             <div className="space-y-4">
//               <div className="bg-primary-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-600">Monthly EMI</p>
//                 <p className="text-3xl font-bold text-primary-600">
//                   ₹{emiResult.emiAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-sm text-gray-600">Total Amount</p>
//                   <p className="text-xl font-bold">
//                     ₹{emiResult.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                   </p>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-sm text-gray-600">Total Interest</p>
//                   <p className="text-xl font-bold">
//                     ₹{emiResult.totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                   </p>
//                 </div>
//               </div>

//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="w-full btn-primary flex items-center justify-center"
//               >
//                 <Save className="mr-2 h-4 w-4" />
//                 {saving ? 'Saving...' : 'Save Loan'}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Amortization Chart */}
//       {emiResult && chartData.length > 0 && (
//         <div className="card">
//           <h2 className="section-title">Amortization Schedule (First 12 Months)</h2>
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
//               <Legend />
//               <Line type="monotone" dataKey="principal" stroke="#0ea5e9" name="Principal" />
//               <Line type="monotone" dataKey="interest" stroke="#ef4444" name="Interest" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}

//       {/* Amortization Table */}
//       {emiResult && emiResult.amortizationSchedule && (
//         <div className="card">
//           <h2 className="section-title">Full Amortization Schedule</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {emiResult.amortizationSchedule.map((row) => (
//                   <tr key={row.month}>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">{row.month}</td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">₹{row.principal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">₹{row.interest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">₹{row.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmiPlanner;




