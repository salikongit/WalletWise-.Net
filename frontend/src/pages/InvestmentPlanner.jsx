import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { financeAPI, investmentsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Material UI Icons
import TrendingUpIcon     from '@mui/icons-material/TrendingUp';
import SaveIcon           from '@mui/icons-material/Save';
import CheckCircleIcon    from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon   from '@mui/icons-material/ErrorOutline';
import CloseIcon          from '@mui/icons-material/Close';
import InfoOutlinedIcon   from '@mui/icons-material/InfoOutlined';
import ShowChartIcon      from '@mui/icons-material/ShowChart';

/* ── Select icon overlay wrapper (reusable) ── */
const SelectWithIcon = ({ Icon, children, ...props }) => (
  <div className="dash-select-wrap">
    <Icon style={{ width: 16, height: 16, color: 'rgba(200,210,230,0.55)' }} />
    <select className="dash-input dash-input--select" {...props}>
      {children}
    </select>
  </div>
);

const InvestmentPlanner = () => {
  const [formData, setFormData] = useState({
    investmentName:        '',
    investmentType:        'SIP',
    principalAmount:       '',
    expectedReturnRate:    '',
    investmentPeriodYears: '',
  });
  const [investmentResult, setInvestmentResult] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

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
    setInvestmentResult(null);
    try {
      const response = await financeAPI.calculateInvestment({
        investmentType:        formData.investmentType,
        principalAmount:       parseFloat(formData.principalAmount),
        expectedReturnRate:    parseFloat(formData.expectedReturnRate),
        investmentPeriodYears: parseInt(formData.investmentPeriodYears),
      });
      setInvestmentResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate investment');
    } finally {
      setLoading(false);
    }
  };

  /* ── API: save ── */
  const handleSave = async () => {
    if (!investmentResult) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await investmentsAPI.create({
        investmentName:        formData.investmentName || 'Untitled Investment',
        investmentType:        formData.investmentType,
        principalAmount:       parseFloat(formData.principalAmount),
        expectedReturnRate:    parseFloat(formData.expectedReturnRate),
        investmentPeriodYears: parseInt(formData.investmentPeriodYears),
      });
      setSuccess('Investment saved successfully!');
      setFormData({ investmentName: '', investmentType: 'SIP', principalAmount: '', expectedReturnRate: '', investmentPeriodYears: '' });
      setInvestmentResult(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save investment');
    } finally {
      setSaving(false);
    }
  };

  /* Derived */
  const returnPct = investmentResult
    ? ((investmentResult.totalReturns / investmentResult.totalInvestment) * 100).toFixed(2)
    : 0;

  /* ─────────────────────────────────────
     RENDER
     ───────────────────────────────────── */
  return (
    <div className="dash-root">

      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Investment Planner</h1>
          <p className="dash-header__sub">Project returns for SIP and Lumpsum investments</p>
        </div>
      </div>

      {/* Two-column: Form | Results */}
      <div className="emi-grid">

        {/* ── Form Card ── */}
        <div className="dash-glass-card dash-glass-card--static">
          <div className="dash-card-title">
            <TrendingUpIcon /> Investment Details
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
              <label className="dash-label">Investment Name (Optional)</label>
              <input type="text" name="investmentName" className="dash-input" placeholder="e.g., Mutual Fund SIP" value={formData.investmentName} onChange={handleChange} />
            </div>

            <div className="dash-field">
              <label className="dash-label">Investment Type</label>
              <SelectWithIcon Icon={ShowChartIcon} name="investmentType" value={formData.investmentType} onChange={handleChange}>
                <option value="SIP">SIP (Systematic Investment Plan)</option>
                <option value="Lumpsum">Lumpsum</option>
              </SelectWithIcon>
            </div>

            <div className="dash-field">
              <label className="dash-label">
                {formData.investmentType === 'SIP' ? 'Monthly Investment Amount (₹)' : 'Principal Amount (₹)'}
              </label>
              <input type="number" name="principalAmount" required min="0" step="0.01" className="dash-input" placeholder={formData.investmentType === 'SIP' ? '5000' : '100000'} value={formData.principalAmount} onChange={handleChange} />
            </div>

            <div className="dash-field">
              <label className="dash-label">Expected Annual Return Rate (%)</label>
              <input type="number" name="expectedReturnRate" required min="0" max="100" step="0.01" className="dash-input" placeholder="12" value={formData.expectedReturnRate} onChange={handleChange} />
            </div>

            <div className="dash-field">
              <label className="dash-label">Investment Period (Years)</label>
              <input type="number" name="investmentPeriodYears" required min="1" max="100" className="dash-input" placeholder="10" value={formData.investmentPeriodYears} onChange={handleChange} />
            </div>

            <button type="submit" disabled={loading} className="clay-btn clay-btn--primary clay-btn--full">
              {loading ? <LoadingSpinner size="sm" /> : <><TrendingUpIcon /> Calculate Returns</>}
            </button>
          </form>
        </div>

        {/* ── Results Card ── */}
        {investmentResult && (
          <div className="dash-glass-card dash-glass-card--static">
            <div className="dash-card-title">
              <ShowChartIcon /> Investment Projection
            </div>

            {/* Big future value */}
            <div className="dash-highlight">
              <div className="dash-highlight__label">Future Value</div>
              <div className="dash-highlight__value">
                ₹{investmentResult.futureValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Total Investment | Total Returns */}
            <div className="dash-stats-row">
              <div className="dash-stat-box">
                <div className="dash-stat-box__label">Total Investment</div>
                <div className="dash-stat-box__value">
                  ₹{investmentResult.totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="dash-stat-box">
                <div className="dash-stat-box__label">Total Returns</div>
                <div className="dash-stat-box__value dash-stat-box__value--success">
                  ₹{investmentResult.totalReturns.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Return % highlight */}
            <div className="dash-highlight dash-highlight--success" style={{ marginBottom: 20 }}>
              <div className="dash-highlight__label">Return Percentage</div>
              <div className="dash-highlight__value">{returnPct}%</div>
            </div>

            {/* Save */}
            <button onClick={handleSave} disabled={saving} className="clay-btn clay-btn--primary clay-btn--full">
              <SaveIcon /> {saving ? 'Saving…' : 'Save Investment'}
            </button>
          </div>
        )}
      </div>

      {/* ── Info Card ── */}
      <div className="dash-info-card">
        <div className="dash-info-card__title">
          <InfoOutlinedIcon /> {formData.investmentType === 'SIP' ? 'About SIP' : 'About Lumpsum Investment'}
        </div>
        <p className="dash-info-card__body">
          {formData.investmentType === 'SIP'
            ? 'SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly. This helps in rupee cost averaging and building wealth over time through compounding.'
            : 'Lumpsum investment involves investing a large amount at once. This strategy works well when you have a large corpus and want to maximize returns over a long period.'}
        </p>
      </div>
    </div>
  );
};

export default InvestmentPlanner;






// import { useState } from 'react';
// import { financeAPI, investmentsAPI } from '../services/api';
// import LoadingSpinner from '../components/LoadingSpinner';
// import ErrorMessage from '../components/ErrorMessage';
// import SuccessMessage from '../components/SuccessMessage';
// import { TrendingUp, Save } from 'lucide-react';

// const InvestmentPlanner = () => {
//   const [formData, setFormData] = useState({
//     investmentName: '',
//     investmentType: 'SIP',
//     principalAmount: '',
//     expectedReturnRate: '',
//     investmentPeriodYears: '',
//   });
//   const [investmentResult, setInvestmentResult] = useState(null);
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
//     setInvestmentResult(null);

//     try {
//       const response = await financeAPI.calculateInvestment({
//         investmentType: formData.investmentType,
//         principalAmount: parseFloat(formData.principalAmount),
//         expectedReturnRate: parseFloat(formData.expectedReturnRate),
//         investmentPeriodYears: parseInt(formData.investmentPeriodYears),
//       });
//       setInvestmentResult(response.data);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to calculate investment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!investmentResult) return;

//     setSaving(true);
//     setError('');
//     setSuccess('');

//     try {
//       await investmentsAPI.create({
//         investmentName: formData.investmentName || 'Untitled Investment',
//         investmentType: formData.investmentType,
//         principalAmount: parseFloat(formData.principalAmount),
//         expectedReturnRate: parseFloat(formData.expectedReturnRate),
//         investmentPeriodYears: parseInt(formData.investmentPeriodYears),
//       });
//       setSuccess('Investment saved successfully!');
//       setFormData({
//         investmentName: '',
//         investmentType: 'SIP',
//         principalAmount: '',
//         expectedReturnRate: '',
//         investmentPeriodYears: '',
//       });
//       setInvestmentResult(null);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to save investment');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="page-title">Investment Planner</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Input Form */}
//         <div className="card">
//           <div className="flex items-center mb-4">
//             <TrendingUp className="h-6 w-6 text-primary-600 mr-2" />
//             <h2 className="section-title">Investment Details</h2>
//           </div>

//           <ErrorMessage message={error} onClose={() => setError('')} />
//           <SuccessMessage message={success} onClose={() => setSuccess('')} />

//           <form onSubmit={handleCalculate} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Investment Name (Optional)
//               </label>
//               <input
//                 type="text"
//                 name="investmentName"
//                 className="input-field"
//                 placeholder="e.g., Mutual Fund SIP"
//                 value={formData.investmentName}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Investment Type
//               </label>
//               <select
//                 name="investmentType"
//                 className="input-field"
//                 value={formData.investmentType}
//                 onChange={handleChange}
//               >
//                 <option value="SIP">SIP (Systematic Investment Plan)</option>
//                 <option value="Lumpsum">Lumpsum</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 {formData.investmentType === 'SIP' ? 'Monthly Investment Amount (₹)' : 'Principal Amount (₹)'}
//               </label>
//               <input
//                 type="number"
//                 name="principalAmount"
//                 required
//                 min="0"
//                 step="0.01"
//                 className="input-field"
//                 placeholder={formData.investmentType === 'SIP' ? '5000' : '100000'}
//                 value={formData.principalAmount}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Expected Annual Return Rate (%)
//               </label>
//               <input
//                 type="number"
//                 name="expectedReturnRate"
//                 required
//                 min="0"
//                 max="100"
//                 step="0.01"
//                 className="input-field"
//                 placeholder="12"
//                 value={formData.expectedReturnRate}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Investment Period (Years)
//               </label>
//               <input
//                 type="number"
//                 name="investmentPeriodYears"
//                 required
//                 min="1"
//                 max="100"
//                 className="input-field"
//                 placeholder="10"
//                 value={formData.investmentPeriodYears}
//                 onChange={handleChange}
//               />
//             </div>

//             <button type="submit" disabled={loading} className="w-full btn-primary">
//               {loading ? <LoadingSpinner size="sm" /> : 'Calculate Returns'}
//             </button>
//           </form>
//         </div>

//         {/* Results */}
//         {investmentResult && (
//           <div className="card">
//             <h2 className="section-title">Investment Projection</h2>
            
//             <div className="space-y-4">
//               <div className="bg-primary-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-600">Future Value</p>
//                 <p className="text-3xl font-bold text-primary-600">
//                   ₹{investmentResult.futureValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-sm text-gray-600">Total Investment</p>
//                   <p className="text-xl font-bold">
//                     ₹{investmentResult.totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                   </p>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-sm text-gray-600">Total Returns</p>
//                   <p className="text-xl font-bold text-success-600">
//                     ₹{investmentResult.totalReturns.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                   </p>
//                 </div>
//               </div>

//               <div className="bg-success-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-600">Return Percentage</p>
//                 <p className="text-2xl font-bold text-success-600">
//                   {((investmentResult.totalReturns / investmentResult.totalInvestment) * 100).toFixed(2)}%
//                 </p>
//               </div>

//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="w-full btn-primary flex items-center justify-center"
//               >
//                 <Save className="mr-2 h-4 w-4" />
//                 {saving ? 'Saving...' : 'Save Investment'}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Information Card */}
//       <div className="card bg-blue-50 border-blue-200">
//         <h3 className="font-semibold text-blue-900 mb-2">
//           {formData.investmentType === 'SIP' ? 'About SIP' : 'About Lumpsum Investment'}
//         </h3>
//         <p className="text-sm text-blue-800">
//           {formData.investmentType === 'SIP' 
//             ? 'SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly. This helps in rupee cost averaging and building wealth over time through compounding.'
//             : 'Lumpsum investment involves investing a large amount at once. This strategy works well when you have a large corpus and want to maximize returns over a long period.'}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default InvestmentPlanner;




