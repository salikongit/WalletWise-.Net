import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { transactionsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Material UI Icons
import AddIcon              from '@mui/icons-material/Add';
import EditIcon             from '@mui/icons-material/Edit';
import DeleteIcon           from '@mui/icons-material/Delete';
import ArrowUpwardIcon      from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon    from '@mui/icons-material/ArrowDownward';
import ReceiptLongIcon      from '@mui/icons-material/ReceiptLong';
import WalletIcon from '@mui/icons-material/Wallet';
import ErrorOutlineIcon     from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon      from '@mui/icons-material/CheckCircle';
import CloseIcon            from '@mui/icons-material/Close';

const INCOME_CATEGORIES  = ['Salary', 'Business', 'Investment', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Healthcare', 'Other'];

const Transactions = () => {
  const [activeTab,    setActiveTab]    = useState('income');
  const [incomes,      setIncomes]      = useState([]);
  const [expenses,     setExpenses]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState('');
  const [showModal,    setShowModal]    = useState(false);
  const [editingItem,  setEditingItem]  = useState(null);
  const [formData,     setFormData]     = useState({
    incomeSource: '', expenseName: '', amount: '',
    incomeDate: '', expenseDate: '', description: '', category: '',
  });

  useEffect(() => { fetchTransactions(); }, []);

  /* ── API ── */
  const fetchTransactions = async () => {
    try {
      const [incRes, expRes] = await Promise.all([
        transactionsAPI.getIncomes(),
        transactionsAPI.getExpenses(),
      ]);
      setIncomes(expRes ? incRes.data : []);
      setExpenses(expRes ? expRes.data : []);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (activeTab === 'income') {
        const payload = {
          incomeSource: formData.incomeSource,
          amount: parseFloat(formData.amount),
          incomeDate: formData.incomeDate,
          description: formData.description,
          category: formData.category,
        };
        editingItem
          ? await transactionsAPI.updateIncome(editingItem.incomeId, payload)
          : await transactionsAPI.addIncome(payload);
      } else {
        const payload = {
          expenseName: formData.expenseName,
          amount: parseFloat(formData.amount),
          expenseDate: formData.expenseDate,
          description: formData.description,
          category: formData.category,
        };
        editingItem
          ? await transactionsAPI.updateExpense(editingItem.expenseId, payload)
          : await transactionsAPI.addExpense(payload);
      }
      setSuccess(editingItem ? 'Transaction updated successfully!' : 'Transaction added successfully!');
      setShowModal(false);
      setEditingItem(null);
      resetForm();
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save transaction');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'income') {
      setFormData({
        incomeSource: item.incomeSource,
        amount: item.amount,
        incomeDate: item.incomeDate.split('T')[0],
        description: item.description || '',
        category: item.category,
      });
    } else {
      setFormData({
        expenseName: item.expenseName,
        amount: item.amount,
        expenseDate: item.expenseDate.split('T')[0],
        description: item.description || '',
        category: item.category,
      });
    }
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      type === 'income'
        ? await transactionsAPI.deleteIncome(id)
        : await transactionsAPI.deleteExpense(id);
      setSuccess('Transaction deleted successfully!');
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete transaction');
    }
  };

  const resetForm = () => {
    setFormData({ incomeSource: '', expenseName: '', amount: '', incomeDate: '', expenseDate: '', description: '', category: '' });
  };

  const openModal = () => { resetForm(); setEditingItem(null); setShowModal(true); };

  /* Derived */
  const rows       = activeTab === 'income' ? incomes : expenses;
  const categories = activeTab === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="dash-root" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  /* ─────────────────────────────────────
     RENDER
     ───────────────────────────────────── */
  return (
    <div className="dash-root">

      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Transactions</h1>
          <p className="dash-header__sub">Manage your income and expenses</p>
        </div>
        <div className="dash-header__actions">
          <button className="clay-btn clay-btn--primary" onClick={openModal}>
            <AddIcon /> Add {activeTab === 'income' ? 'Income' : 'Expense'}
          </button>
        </div>
      </div>

      {/* Banners */}
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

      {/* ── Tabs ── */}
      <div className="txn-tabs">
        <button
          className={`txn-tab ${activeTab === 'income' ? 'txn-tab--active' : ''}`}
          onClick={() => setActiveTab('income')}
        >
          <ArrowUpwardIcon /> Income <span className="txn-tab__count">{incomes.length}</span>
        </button>
        <button
          className={`txn-tab ${activeTab === 'expense' ? 'txn-tab--active' : ''}`}
          onClick={() => setActiveTab('expense')}
        >
          <ArrowDownwardIcon /> Expenses <span className="txn-tab__count">{expenses.length}</span>
        </button>
      </div>

      {/* ── Table ── */}
      <div className="dash-glass-card dash-glass-card--static">
        <div className="dash-card-title">
          {activeTab === 'income' ? <WalletIcon /> : <ReceiptLongIcon />}
          {activeTab === 'income' ? 'Income Records' : 'Expense Records'}
        </div>

        <div className="txn-table-wrap">
          <table className="txn-table">
            <thead>
              <tr>
                <th>{activeTab === 'income' ? 'Source' : 'Name'}</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => {
                const id   = activeTab === 'income' ? item.incomeId  : item.expenseId;
                const name = activeTab === 'income' ? item.incomeSource : item.expenseName;
                const date = activeTab === 'income' ? item.incomeDate   : item.expenseDate;
                return (
                  <tr key={id}>
                    <td>{name}</td>
                    <td className={activeTab === 'income' ? 'txn-table__amount--income' : 'txn-table__amount--expense'}>
                      ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="txn-table__date">{new Date(date).toLocaleDateString()}</td>
                    <td className="txn-table__category">{item.category}</td>
                    <td>
                      <button className="txn-action txn-action--edit" onClick={() => handleEdit(item)}>
                        <EditIcon />
                      </button>
                      <button className="txn-action txn-action--delete" onClick={() => handleDelete(id, activeTab)}>
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {rows.length === 0 && (
            <p className="dash-empty-state">No {activeTab === 'income' ? 'income' : 'expense'} records found</p>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="dash-modal-overlay">
          <div className="dash-modal dash-modal--wide">

            {/* Modal header */}
            <div className="dash-modal__header">
              <div className="dash-modal__icon dash-modal__icon--violet">
                {editingItem ? <EditIcon /> : <AddIcon />}
              </div>
              <h3 className="dash-modal__title">
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'income' ? 'Income' : 'Expense'}
              </h3>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="dash-field">
                <label className="dash-label">{activeTab === 'income' ? 'Income Source' : 'Expense Name'}</label>
                <input
                  type="text"
                  name={activeTab === 'income' ? 'incomeSource' : 'expenseName'}
                  required
                  className="dash-input"
                  value={activeTab === 'income' ? formData.incomeSource : formData.expenseName}
                  onChange={handleChange}
                />
              </div>

              <div className="dash-field">
                <label className="dash-label">Amount (₹)</label>
                <input type="number" name="amount" required min="0" step="0.01" className="dash-input" value={formData.amount} onChange={handleChange} />
              </div>

              <div className="dash-field">
                <label className="dash-label">Date</label>
                <input
                  type="date"
                  name={activeTab === 'income' ? 'incomeDate' : 'expenseDate'}
                  required
                  className="dash-input"
                  value={activeTab === 'income' ? formData.incomeDate : formData.expenseDate}
                  onChange={handleChange}
                />
              </div>

              <div className="dash-field">
                <label className="dash-label">Category</label>
                <select name="category" required className="dash-input" value={formData.category} onChange={handleChange}>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="dash-field">
                <label className="dash-label">Description (Optional)</label>
                <textarea name="description" className="dash-input dash-input--textarea" rows="3" value={formData.description} onChange={handleChange} />
              </div>

              {/* Actions */}
              <div className="dash-modal__form-actions">
                <button type="submit" className="clay-btn clay-btn--primary">
                  {editingItem ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  className="clay-btn clay-btn--ghost"
                  onClick={() => { setShowModal(false); setEditingItem(null); resetForm(); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;




// import { useState, useEffect } from 'react';
// import { transactionsAPI } from '../services/api';
// import LoadingSpinner from '../components/LoadingSpinner';
// import ErrorMessage from '../components/ErrorMessage';
// import SuccessMessage from '../components/SuccessMessage';
// import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

// const Transactions = () => {
//   const [activeTab, setActiveTab] = useState('income');
//   const [incomes, setIncomes] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [formData, setFormData] = useState({
//     incomeSource: '',
//     expenseName: '',
//     amount: '',
//     incomeDate: '',
//     expenseDate: '',
//     description: '',
//     category: '',
//   });

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   const fetchTransactions = async () => {
//     try {
//       const [incomeRes, expenseRes] = await Promise.all([
//         transactionsAPI.getIncomes(),
//         transactionsAPI.getExpenses(),
//       ]);
//       setIncomes(incomeRes.data);
//       setExpenses(expenseRes.data);
//     } catch (err) {
//       setError('Failed to load transactions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     try {
//       if (activeTab === 'income') {
//         if (editingItem) {
//           await transactionsAPI.updateIncome(editingItem.incomeId, {
//             incomeSource: formData.incomeSource,
//             amount: parseFloat(formData.amount),
//             incomeDate: formData.incomeDate,
//             description: formData.description,
//             category: formData.category,
//           });
//         } else {
//           await transactionsAPI.addIncome({
//             incomeSource: formData.incomeSource,
//             amount: parseFloat(formData.amount),
//             incomeDate: formData.incomeDate,
//             description: formData.description,
//             category: formData.category,
//           });
//         }
//       } else {
//         if (editingItem) {
//           await transactionsAPI.updateExpense(editingItem.expenseId, {
//             expenseName: formData.expenseName,
//             amount: parseFloat(formData.amount),
//             expenseDate: formData.expenseDate,
//             description: formData.description,
//             category: formData.category,
//           });
//         } else {
//           await transactionsAPI.addExpense({
//             expenseName: formData.expenseName,
//             amount: parseFloat(formData.amount),
//             expenseDate: formData.expenseDate,
//             description: formData.description,
//             category: formData.category,
//           });
//         }
//       }
//       setSuccess(editingItem ? 'Transaction updated successfully!' : 'Transaction added successfully!');
//       setShowModal(false);
//       setEditingItem(null);
//       resetForm();
//       fetchTransactions();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to save transaction');
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingItem(item);
//     if (activeTab === 'income') {
//       setFormData({
//         incomeSource: item.incomeSource,
//         amount: item.amount,
//         incomeDate: item.incomeDate.split('T')[0],
//         description: item.description || '',
//         category: item.category,
//       });
//     } else {
//       setFormData({
//         expenseName: item.expenseName,
//         amount: item.amount,
//         expenseDate: item.expenseDate.split('T')[0],
//         description: item.description || '',
//         category: item.category,
//       });
//     }
//     setShowModal(true);
//   };

//   const handleDelete = async (id, type) => {
//     if (!window.confirm('Are you sure you want to delete this transaction?')) return;

//     try {
//       if (type === 'income') {
//         await transactionsAPI.deleteIncome(id);
//       } else {
//         await transactionsAPI.deleteExpense(id);
//       }
//       setSuccess('Transaction deleted successfully!');
//       fetchTransactions();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to delete transaction');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       incomeSource: '',
//       expenseName: '',
//       amount: '',
//       incomeDate: '',
//       expenseDate: '',
//       description: '',
//       category: '',
//     });
//   };

//   const openModal = () => {
//     resetForm();
//     setEditingItem(null);
//     setShowModal(true);
//   };

//   const incomeCategories = ['Salary', 'Business', 'Investment', 'Other'];
//   const expenseCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Healthcare', 'Other'];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="page-title">Income & Expense Manager</h1>
//         <button onClick={openModal} className="btn-primary flex items-center">
//           <Plus className="mr-2 h-4 w-4" />
//           Add {activeTab === 'income' ? 'Income' : 'Expense'}
//         </button>
//       </div>

//       <ErrorMessage message={error} onClose={() => setError('')} />
//       <SuccessMessage message={success} onClose={() => setSuccess('')} />

//       {/* Tabs */}
//       <div className="border-b border-gray-200">
//         <nav className="-mb-px flex space-x-8">
//           <button
//             onClick={() => setActiveTab('income')}
//             className={`py-4 px-1 border-b-2 font-medium text-sm ${
//               activeTab === 'income'
//                 ? 'border-primary-500 text-primary-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             <ArrowUp className="inline h-4 w-4 mr-2" />
//             Income ({incomes.length})
//           </button>
//           <button
//             onClick={() => setActiveTab('expense')}
//             className={`py-4 px-1 border-b-2 font-medium text-sm ${
//               activeTab === 'expense'
//                 ? 'border-primary-500 text-primary-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             <ArrowDown className="inline h-4 w-4 mr-2" />
//             Expenses ({expenses.length})
//           </button>
//         </nav>
//       </div>

//       {/* Transactions List */}
//       <div className="card">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   {activeTab === 'income' ? 'Source' : 'Name'}
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {(activeTab === 'income' ? incomes : expenses).map((item) => (
//                 <tr key={activeTab === 'income' ? item.incomeId : item.expenseId}>
//                   <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
//                     {activeTab === 'income' ? item.incomeSource : item.expenseName}
//                   </td>
//                   <td className={`px-4 py-3 whitespace-nowrap text-sm font-bold ${
//                     activeTab === 'income' ? 'text-success-600' : 'text-danger-600'
//                   }`}>
//                     ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                   </td>
//                   <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(activeTab === 'income' ? item.incomeDate : item.expenseDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
//                   <td className="px-4 py-3 whitespace-nowrap text-sm">
//                     <button
//                       onClick={() => handleEdit(item)}
//                       className="text-primary-600 hover:text-primary-800 mr-3"
//                     >
//                       <Edit className="inline h-4 w-4" />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(
//                         activeTab === 'income' ? item.incomeId : item.expenseId,
//                         activeTab
//                       )}
//                       className="text-danger-600 hover:text-danger-800"
//                     >
//                       <Trash2 className="inline h-4 w-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {(activeTab === 'income' ? incomes : expenses).length === 0 && (
//             <p className="text-center text-gray-500 py-8">No {activeTab === 'income' ? 'income' : 'expense'} records found</p>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <h2 className="text-xl font-bold mb-4">
//               {editingItem ? 'Edit' : 'Add'} {activeTab === 'income' ? 'Income' : 'Expense'}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   {activeTab === 'income' ? 'Income Source' : 'Expense Name'}
//                 </label>
//                 <input
//                   type="text"
//                   name={activeTab === 'income' ? 'incomeSource' : 'expenseName'}
//                   required
//                   className="input-field"
//                   value={activeTab === 'income' ? formData.incomeSource : formData.expenseName}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
//                 <input
//                   type="number"
//                   name="amount"
//                   required
//                   min="0"
//                   step="0.01"
//                   className="input-field"
//                   value={formData.amount}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                 <input
//                   type="date"
//                   name={activeTab === 'income' ? 'incomeDate' : 'expenseDate'}
//                   required
//                   className="input-field"
//                   value={activeTab === 'income' ? formData.incomeDate : formData.expenseDate}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="category"
//                   required
//                   className="input-field"
//                   value={formData.category}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select category</option>
//                   {(activeTab === 'income' ? incomeCategories : expenseCategories).map((cat) => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
//                 <textarea
//                   name="description"
//                   className="input-field"
//                   rows="3"
//                   value={formData.description}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="flex space-x-3">
//                 <button type="submit" className="flex-1 btn-primary">
//                   {editingItem ? 'Update' : 'Add'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowModal(false);
//                     setEditingItem(null);
//                     resetForm();
//                   }}
//                   className="flex-1 btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Transactions;




