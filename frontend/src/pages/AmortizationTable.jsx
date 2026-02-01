import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FileText, Download, TrendingDown, Calendar, DollarSign, Percent } from 'lucide-react';
import { loansAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AmortizationTable = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await loansAPI.getAll();
      setLoans(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedLoan(response.data[0].loanId);
        fetchAmortization(response.data[0].loanId);
      }
    } catch (error) {
      toast.error('Failed to load loans');
    } finally {
      setLoading(false);
    }
  };

  const fetchAmortization = async (loanId) => {
    setLoadingSchedule(true);
    try {
      const response = await loansAPI.getAmortization(loanId);
      setAmortizationSchedule(response.data.amortizationSchedule || []);
    } catch (error) {
      toast.error('Failed to load amortization schedule');
    } finally {
      setLoadingSchedule(false);
    }
  };

  const handleLoanChange = (loanId) => {
    setSelectedLoan(loanId);
    fetchAmortization(loanId);
  };

  const exportToCSV = () => {
    if (!amortizationSchedule.length || !selectedLoan) return;

    const loan = loans.find(l => l.loanId === selectedLoan);
    const headers = ['Month', 'Principal Payment', 'Interest Payment', 'Total Payment', 'Remaining Balance'];
    const rows = amortizationSchedule.map(item => [
      item.month,
      item.principal,
      item.interest,
      (item.principal + item.interest).toFixed(2),
      item.balance
    ]);

    const csvContent = [
      [loan?.loanName || 'Loan', ''],
      headers,
      ...rows
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Amortization_${loan?.loanName || 'Loan'}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Amortization table exported successfully');
  };

  // Calculate summary stats
  const selectedLoanData = loans.find(l => l.loanId === selectedLoan);
  const totalPrincipal = amortizationSchedule.reduce((sum, item) => sum + (item.principal || 0), 0);
  const totalInterest = amortizationSchedule.reduce((sum, item) => sum + (item.interest || 0), 0);
  const totalPayment = totalPrincipal + totalInterest;

  if (loading) {
    return (
      <div className="dash-root">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="dash-root">
        <div className="dash-glass-card dash-glass-card--static" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="rt-empty">
            <div className="rt-empty__icon">
              <FileText />
            </div>
            <h3 className="rt-empty__title">No Loans Found</h3>
            <p className="rt-empty__sub">You don't have any loans. Loans added during onboarding will appear here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-root">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Amortization Schedule</h1>
          <p className="dash-header__sub">View detailed EMI breakdown for your loans</p>
        </div>
        <div className="dash-header__actions">
          {amortizationSchedule.length > 0 && (
            <button onClick={exportToCSV} className="clay-btn clay-btn--primary">
              <Download /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Total EMI Summary Card */}
      <div className="dash-glass-card dash-glass-card--static" style={{ marginBottom: '24px' }}>
        <div className="dash-card-title">
          <DollarSign />
          Total Monthly EMI
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <div className="dash-highlight dash-highlight--success">
              <div className="dash-highlight__label">Combined EMI</div>
              <div className="dash-highlight__value">
                ₹{loans.reduce((total, loan) => total + (loan.emiAmount || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <div className="dash-stats-row" style={{ gridColumn: 'span 1' }}>
            <div className="dash-stat-box">
              <div className="dash-stat-box__label">Active Loans</div>
              <div className="dash-stat-box__value dash-stat-box__value--success">{loans.length}</div>
            </div>
            <div className="dash-stat-box">
              <div className="dash-stat-box__label">Deducted Monthly</div>
              <div className="dash-stat-box__value">
                ₹{loans.reduce((total, loan) => total + (loan.emiAmount || 0), 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
        <div className="dash-info-card" style={{ marginTop: '16px' }}>
          <div className="dash-info-card__title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Investment Impact
          </div>
          <div className="dash-info-card__body">
            This amount is automatically deducted from your available investment funds each month.
          </div>
        </div>
      </div>

      {/* Loan Selector */}
      <div className="dash-glass-card dash-glass-card--static" style={{ marginBottom: '24px' }}>
        <div className="dash-field">
          <label className="dash-label">Select Loan to View Schedule</label>
          <div className="dash-select-wrap">
            <Calendar style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--d-text-muted)', pointerEvents: 'none', zIndex: 1 }} />
            <select
              value={selectedLoan || ''}
              onChange={(e) => handleLoanChange(parseInt(e.target.value))}
              className="dash-input dash-input--select"
            >
              {loans.map(loan => (
                <option key={loan.loanId} value={loan.loanId}>
                  {loan.loanName} - ₹{loan.emiAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}/month
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats for Selected Loan */}
      {selectedLoanData && amortizationSchedule.length > 0 && (
        <div className="dash-glass-card" style={{ marginBottom: '24px' }}>
          <div className="dash-card-title">
            <TrendingDown />
            Loan Summary
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="dash-stat-box">
              <div className="dash-stat-box__label">Total Principal</div>
              <div className="dash-stat-box__value">
                ₹{totalPrincipal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="dash-stat-box">
              <div className="dash-stat-box__label">Total Interest</div>
              <div className="dash-stat-box__value dash-stat-box__value--success">
                ₹{totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="dash-stat-box">
              <div className="dash-stat-box__label">Total Payment</div>
              <div className="dash-stat-box__value">
                ₹{totalPayment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="dash-stat-box">
              <div className="dash-stat-box__label">Loan Duration</div>
              <div className="dash-stat-box__value">
                {amortizationSchedule.length} Months
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Amortization Table */}
      {loadingSchedule ? (
        <div className="dash-glass-card dash-glass-card--static">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      ) : amortizationSchedule.length > 0 ? (
        <div className="dash-glass-card dash-glass-card--static">
          <div className="dash-card-title">
            <FileText />
            Payment Schedule
          </div>
          <div className="dash-amort-wrap">
            <table className="dash-amort-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Principal (₹)</th>
                  <th>Interest (₹)</th>
                  <th>Total Payment (₹)</th>
                  <th>Remaining Balance (₹)</th>
                </tr>
              </thead>
              <tbody>
                {amortizationSchedule.map((item, index) => (
                  <tr key={index}>
                    <td>{item.month}</td>
                    <td>{item.principal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="dash-text--orange">
                      {item.interest?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {((item.principal || 0) + (item.interest || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="dash-text--muted">
                      {item.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="dash-glass-card dash-glass-card--static">
          <div className="rt-empty">
            <div className="rt-empty__icon">
              <FileText />
            </div>
            <h3 className="rt-empty__title">No Schedule Available</h3>
            <p className="rt-empty__sub">No amortization schedule available for this loan</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmortizationTable;

















// import { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { FileText, Download } from 'lucide-react';
// import { loansAPI } from '../services/api';
// import LoadingSpinner from '../components/LoadingSpinner';

// const AmortizationTable = () => {
//   const [loans, setLoans] = useState([]);
//   const [selectedLoan, setSelectedLoan] = useState(null);
//   const [amortizationSchedule, setAmortizationSchedule] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingSchedule, setLoadingSchedule] = useState(false);

//   useEffect(() => {
//     fetchLoans();
//   }, []);

//   const fetchLoans = async () => {
//     try {
//       const response = await loansAPI.getAll();
//       setLoans(response.data || []);
//       if (response.data && response.data.length > 0) {
//         setSelectedLoan(response.data[0].loanId);
//         fetchAmortization(response.data[0].loanId);
//       }
//     } catch (error) {
//       toast.error('Failed to load loans');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAmortization = async (loanId) => {
//     setLoadingSchedule(true);
//     try {
//       const response = await loansAPI.getAmortization(loanId);
//       // setAmortizationSchedule(response.data || []);
//       setAmortizationSchedule(response.data.amortizationSchedule || []);

//     } catch (error) {
//       toast.error('Failed to load amortization schedule');
//     } finally {
//       setLoadingSchedule(false);
//     }
//   };

//   const handleLoanChange = (loanId) => {
//     setSelectedLoan(loanId);
//     fetchAmortization(loanId);
//   };

//   const exportToCSV = () => {
//     if (!amortizationSchedule.length || !selectedLoan) return;

//     const loan = loans.find(l => l.loanId === selectedLoan);
//     const headers = ['Month', 'Principal Payment', 'Interest Payment', 'Total Payment', 'Remaining Balance'];
//     const rows = amortizationSchedule.map(item => [
//       item.month,
//       item.principal,
//       item.interest,
//       (item.principal + item.interest).toFixed(2),
//       item.balance
//     ]);

//     const csvContent = [
//       [loan?.loanName || 'Loan', ''],
//       headers,
//       ...rows
//     ].map(row => row.join(',')).join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `Amortization_${loan?.loanName || 'Loan'}_${new Date().toISOString().split('T')[0]}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//     toast.success('Amortization table exported successfully');
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-12">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   if (loans.length === 0) {
//     return (
//       <div className="bg-white rounded-lg shadow p-12 text-center">
//         <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
//         <h3 className="text-xl font-semibold text-gray-900 mb-2">No Loans Found</h3>
//         <p className="text-gray-600">You dont have any loans. Loans added during onboarding will appear here.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Amortization Schedule</h1>
//           <p className="text-gray-600 mt-1">View detailed EMI breakdown for your loans</p>
//         </div>
//         {amortizationSchedule.length > 0 && (
//           <button
//             onClick={exportToCSV}
//             className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//           >
//             <Download className="w-5 h-5" />
//             <span>Export CSV</span>
//           </button>
//         )}
//       </div>

//       {/* EMI Summary */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">Total Monthly EMI</h3>
//             <p className="text-3xl font-bold text-indigo-600">
//               ₹{loans.reduce((total, loan) => total + (loan.emiAmount || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//             </p>
//             <p className="text-sm text-gray-600 mt-1">
//               From {loans.length} active loan{loans.length !== 1 ? 's' : ''}
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">This amount is deducted from</p>
//             <p className="text-sm text-gray-600">your available investment funds</p>
//           </div>
//         </div>
//       </div>

//       {/* Loan Selector */}
//       <div className="bg-white p-4 rounded-lg shadow">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Select Loan
//         </label>
//         <select
//           value={selectedLoan || ''}
//           onChange={(e) => handleLoanChange(parseInt(e.target.value))}
//           className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//         >
//           {loans.map(loan => (
//             <option key={loan.loanId} value={loan.loanId}>
//               {loan.loanName} - ₹{loan.emiAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}/month
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Amortization Table */}
//       {loadingSchedule ? (
//         <div className="flex justify-center py-12">
//           <LoadingSpinner size="lg" />
//         </div>
//       ) : amortizationSchedule.length > 0 ? (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Month
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Principal (₹)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Interest (₹)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Total Payment (₹)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Remaining Balance (₹)
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {amortizationSchedule.map((item, index) => (
//                   <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {item.month}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {item.principal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {item.interest?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
//                       {((item.principal || 0) + (item.interest || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {item.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow p-12 text-center">
//           <p className="text-gray-600">No amortization schedule available for this loan</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AmortizationTable;


