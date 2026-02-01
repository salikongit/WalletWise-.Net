import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  AttachMoney, 
  CreditCard, 
  ShoppingCart, 
  TrendingUp, 
  Warning, 
  CheckCircle, 
  GetApp,
  AccountBalance,
  ShowChart,
  Assessment,
  LocalAtm
} from '@mui/icons-material';
import { setUser, getUser } from "../utils/auth";
import { onboardingAPI, reportsAPI, investmentAPI } from '../services/api';

console.log("🧪 OnboardingWizard Mounted");
console.log("User:", JSON.parse(localStorage.getItem("user")));

const EXPENSE_CATEGORIES = [
  'Healthcare',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Food',
  'Other'
];

const INVESTMENT_TYPES = [
  { value: 1, label: 'SIP (Systematic Investment Plan)', icon: <ShowChart sx={{ fontSize: 48 }} /> },
  { value: 2, label: 'Lumpsum', icon: <LocalAtm sx={{ fontSize: 48 }} /> },
  { value: 3, label: 'Equity (Stocks)', icon: <Assessment sx={{ fontSize: 48 }} /> },
  { value: 4, label: 'FD (Fixed Deposit)', icon: <AccountBalance sx={{ fontSize: 48 }} /> }
];

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [salary, setSalary] = useState('');
  const [salaryFrequency, setSalaryFrequency] = useState('Monthly');
  const [loans, setLoans] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedInvestmentType, setSelectedInvestmentType] = useState(null);
  const [riskBenefit, setRiskBenefit] = useState(null);
  const [riskAccepted, setRiskAccepted] = useState(false);
  const [investmentOptions, setInvestmentOptions] = useState([]);
  const [remainingIncome, setRemainingIncome] = useState(0);
  
  // Loan Form
  const [loanForm, setLoanForm] = useState({
    loanName: '',
    principalAmount: '',
    interestRate: '',
    tenureMonths: ''
  });
  
  // Expense Form
  const [expenseForm, setExpenseForm] = useState({
    expenseName: '',
    amount: '',
    category: EXPENSE_CATEGORIES[0]
  });

  const calculateEMI = (principal, rate, tenure) => {
    const monthlyRate = (rate / 100) / 12;
    if (monthlyRate === 0) return principal / tenure;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi * 100) / 100;
  };

  const addLoan = () => {
    if (!loanForm.loanName || !loanForm.principalAmount || !loanForm.interestRate || !loanForm.tenureMonths) {
      toast.error('Please fill all loan fields');
      return;
    }
    
    const emi = calculateEMI(
      parseFloat(loanForm.principalAmount),
      parseFloat(loanForm.interestRate),
      parseInt(loanForm.tenureMonths)
    );
    
    const newLoan = {
      loanName: loanForm.loanName,
      principalAmount: parseFloat(loanForm.principalAmount),
      interestRate: parseFloat(loanForm.interestRate),
      tenureMonths: parseInt(loanForm.tenureMonths),
      emiAmount: emi
    };
    
    setLoans([...loans, newLoan]);
    setLoanForm({ loanName: '', principalAmount: '', interestRate: '', tenureMonths: '' });
    toast.success('Loan added successfully');
  };

  const removeLoan = (index) => {
    setLoans(loans.filter((_, i) => i !== index));
    toast.info('Loan removed');
  };

  const addExpense = () => {
    if (!expenseForm.expenseName || !expenseForm.amount) {
      toast.error('Please fill all expense fields');
      return;
    }
    
    const newExpense = {
      expenseName: expenseForm.expenseName,
      amount: parseFloat(expenseForm.amount),
      category: expenseForm.category,
      description: ''
    };
    
    setExpenses([...expenses, newExpense]);
    setExpenseForm({ expenseName: '', amount: '', category: EXPENSE_CATEGORIES[0] });
    toast.success('Expense added successfully');
  };

  const removeExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
    toast.info('Expense removed');
  };

  const calculateRemainingIncome = () => {
    const monthlySalary =
      salaryFrequency === 'Yearly'
        ? parseFloat(salary || 0) / 12
        : parseFloat(salary || 0);

    const totalEMI = loans.reduce(
      (sum, loan) => sum + (loan.emiAmount || 0),
      0
    );

    const totalExpenses = expenses.reduce(
      (sum, exp) => sum + (exp.amount || 0),
      0
    );

    return monthlySalary - totalEMI - totalExpenses;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!salary || parseFloat(salary) <= 0) {
        toast.error('Please enter a valid salary');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const remaining = calculateRemainingIncome();
      if (remaining <= 0) {
        toast.warning(
          'Your expenses and loans exceed your income. Please adjust your inputs.'
        );
        return;
      }
      setRemainingIncome(remaining);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!selectedInvestmentType) {
        toast.error('Please select an investment type');
        return;
      }

      try {
        setLoading(true);
        const response = await investmentAPI.getRiskBenefit(selectedInvestmentType);
        setRiskBenefit(response.data);
        setCurrentStep(5);
      } catch (err) {
        toast.error('Failed to load risk/benefit information');
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 5) {
      if (!riskAccepted) {
        toast.error('You must accept the risks and benefits to proceed');
        return;
      }
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      const monthlySalary =
        salaryFrequency === 'Yearly'
          ? parseFloat(salary) / 12
          : parseFloat(salary);

      const requestData = {
        salary: monthlySalary,
        salaryFrequency,
        loans: loans.map(loan => ({
          loanName: loan.loanName,
          principalAmount: loan.principalAmount,
          interestRate: loan.interestRate,
          tenureMonths: loan.tenureMonths,
        })),
        monthlyExpenses: expenses,
        investmentType: selectedInvestmentType,
        riskAccepted,
      };

      const response = await onboardingAPI.completeOnboarding(requestData);
      console.log("✅ Onboarding response:", response.data);

      setRemainingIncome(response.data.remainingIncome);
      setInvestmentOptions(response.data.investmentOptions ?? []);

      const currentUser = getUser();
      setUser({ ...currentUser, isOnboardingComplete: true });

      setCurrentStep(6);
      toast.success("🎉 Onboarding Completed!");

    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  const handleInvestmentTypeSelect = (type) => {
    setSelectedInvestmentType(type);
  };

  const handleDownloadReport = async () => {
    try {
      const response = await reportsAPI.downloadFinancialReport();
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `WalletWise_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-3">
            <div className="text-center mb-3">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-2 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/50">
                <AttachMoney sx={{ fontSize: 36, color: 'white' }} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                Enter Your Salary
              </h2>
              <p className="text-sm text-gray-600">Let's start by understanding your monthly income</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-3">
              <div className="glass-card p-3 rounded-3xl">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Salary Amount
                </label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-4 py-2.5 text-base bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 shadow-lg"
                  placeholder="Enter your salary"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="glass-card p-3 rounded-3xl">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Frequency
                </label>
                <select
                  value={salaryFrequency}
                  onChange={(e) => setSalaryFrequency(e.target.value)}
                  className="w-full px-4 py-2.5 text-base bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 shadow-lg"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              
              {salary && (
                <div className="clay-card bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-3xl transform hover:scale-105 transition-transform duration-300">
                  <p className="text-sm text-gray-700">
                    Monthly Income: <span className="font-bold text-indigo-600 text-base">₹{(salaryFrequency === 'Yearly' ? parseFloat(salary) / 12 : parseFloat(salary)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <div className="text-center mb-3">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-2 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-2xl shadow-pink-500/50">
                <CreditCard sx={{ fontSize: 36, color: 'white' }} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-1">
                Add Your Loans
              </h2>
              <p className="text-sm text-gray-600">Enter your loan details to calculate EMI (Optional)</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="glass-card p-3 md:p-4 rounded-3xl space-y-2.5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={loanForm.loanName}
                    onChange={(e) => setLoanForm({ ...loanForm, loanName: e.target.value })}
                    placeholder="Loan Name (e.g., Home Loan)"
                    className="px-3 py-2.5 text-sm bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl focus:ring-4 focus:ring-pink-500/30 focus:border-pink-500 transition-all duration-300 shadow-lg"
                  />
                  <input
                    type="number"
                    value={loanForm.principalAmount}
                    onChange={(e) => setLoanForm({ ...loanForm, principalAmount: e.target.value })}
                    placeholder="Principal Amount (₹)"
                    className="px-3 py-2.5 text-sm bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl focus:ring-4 focus:ring-pink-500/30 focus:border-pink-500 transition-all duration-300 shadow-lg"
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    value={loanForm.interestRate}
                    onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })}
                    placeholder="Interest Rate (%)"
                    className="px-3 py-2.5 text-sm bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl focus:ring-4 focus:ring-pink-500/30 focus:border-pink-500 transition-all duration-300 shadow-lg"
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    value={loanForm.tenureMonths}
                    onChange={(e) => setLoanForm({ ...loanForm, tenureMonths: e.target.value })}
                    placeholder="Tenure (Months)"
                    className="px-3 py-2.5 text-sm bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl focus:ring-4 focus:ring-pink-500/30 focus:border-pink-500 transition-all duration-300 shadow-lg"
                    min="1"
                  />
                </div>
                <button
                  onClick={addLoan}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm font-semibold py-2.5 rounded-2xl hover:shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  Add Loan
                </button>
              </div>
              
              {loans.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-base font-bold text-gray-800">Your Loans:</h3>
                  {loans.map((loan, index) => (
                    <div key={index} className="clay-card bg-white p-3 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2.5 hover:shadow-2xl transition-all duration-300">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{loan.loanName}</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          EMI: <span className="font-semibold text-pink-600">₹{loan.emiAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeLoan(index)}
                        className="px-4 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 transform hover:scale-105 transition-all duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="clay-card bg-gradient-to-br from-pink-50 to-rose-50 p-3 rounded-3xl">
                    <p className="text-sm font-bold text-pink-800">
                      Total Monthly EMI: ₹{loans.reduce((sum, loan) => sum + loan.emiAmount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            <div className="text-center mb-3">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-2 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl shadow-green-500/50">
                <ShoppingCart sx={{ fontSize: 36, color: 'white' }} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                Add Monthly Expenses
              </h2>
              <p className="text-sm text-gray-600">Track your regular monthly expenses (Optional)</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="glass-card p-3 md:p-4 rounded-3xl space-y-2.5">
                <input
                  type="text"
                  value={expenseForm.expenseName}
                  onChange={(e) => setExpenseForm({ ...expenseForm, expenseName: e.target.value })}
                  placeholder="Expense Name (e.g., Groceries)"
                  className="w-full px-3 py-2.5 text-sm bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 shadow-lg"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <input
                    type="number"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="Amount (₹)"
                    className="px-3 py-2.5 text-sm bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 shadow-lg"
                    min="0"
                    step="0.01"
                  />
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="px-3 py-2.5 text-sm bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 shadow-lg"
                  >
                    {EXPENSE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={addExpense}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold py-2.5 rounded-2xl hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  Add Expense
                </button>
              </div>
              
              {expenses.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-base font-bold text-gray-800">Your Expenses:</h3>
                  {expenses.map((expense, index) => (
                    <div key={index} className="clay-card bg-white p-3 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2.5 hover:shadow-2xl transition-all duration-300">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{expense.expenseName}</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {expense.category} - <span className="font-semibold text-green-600">₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeExpense(index)}
                        className="px-4 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 transform hover:scale-105 transition-all duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="clay-card bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-3xl">
                    <p className="text-sm font-bold text-green-800">
                      Total Monthly Expenses: ₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="clay-card bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-3xl transform hover:scale-105 transition-transform duration-300">
                <p className="text-sm text-gray-700">
                  Remaining Income: <span className="font-bold text-emerald-700 text-base">
                    ₹{calculateRemainingIncome().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-3">
            <div className="text-center mb-3">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-2 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-2xl shadow-purple-500/50">
                <TrendingUp sx={{ fontSize: 36, color: 'white' }} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                Choose Investment Type
              </h2>
              <p className="text-sm text-gray-600 mb-3">Select where you want to invest your remaining income</p>
              <div className="inline-block clay-card bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-2 rounded-3xl">
                <p className="text-xs font-semibold text-blue-800">
                  Available for Investment: <span className="text-base text-indigo-700">₹{remainingIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </p>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
              {INVESTMENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleInvestmentTypeSelect(type.value)}
                  className={`clay-card p-5 rounded-3xl text-left transition-all duration-300 transform hover:scale-105 ${
                    selectedInvestmentType === type.value
                      ? 'bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-indigo-500 shadow-2xl shadow-indigo-500/50'
                      : 'bg-white/80 backdrop-blur-lg border-2 border-white/50 hover:shadow-2xl'
                  }`}
                >
                  <div className={`mb-2 ${selectedInvestmentType === type.value ? 'text-indigo-600' : 'text-gray-600'}`}>
                    {type.icon}
                  </div>
                  <p className="text-sm font-bold text-gray-800">{type.label}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-3">
            <div className="text-center mb-3">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-2 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/50">
                <Warning sx={{ fontSize: 36, color: 'white' }} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">
                Risks & Benefits
              </h2>
              <p className="text-sm text-gray-600">Please review and accept to proceed</p>
            </div>
            
            {riskBenefit && (
              <div className="max-w-3xl mx-auto space-y-3">
                <div className="clay-card bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-3xl">
                  <p className="text-xs font-semibold text-blue-800">
                    Risk Level: <span className="text-lg font-bold text-indigo-700">{riskBenefit.riskLevel}</span>
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="glass-card bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-3xl">
                    <h3 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle sx={{ fontSize: 20 }} /> Benefits
                    </h3>
                    <ul className="space-y-1.5">
                      {riskBenefit.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-1 h-1 bg-green-600 rounded-full mt-1.5"></span>
                          <span className="text-xs text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="glass-card bg-gradient-to-br from-red-50 to-rose-50 p-3 rounded-3xl">
                    <h3 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
                      <Warning sx={{ fontSize: 20 }} /> Risks
                    </h3>
                    <ul className="space-y-1.5">
                      {riskBenefit.risks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-1 h-1 bg-red-600 rounded-full mt-1.5"></span>
                          <span className="text-xs text-gray-700">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="clay-card bg-white/80 backdrop-blur-lg p-3 rounded-3xl">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      id="riskAccepted"
                      checked={riskAccepted}
                      onChange={(e) => setRiskAccepted(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-indigo-600 border-gray-300 rounded-lg focus:ring-indigo-500 focus:ring-4 cursor-pointer"
                    />
                    <span className="text-xs text-gray-700 leading-relaxed">
                      I understand and accept the risks and benefits associated with this investment type
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-3">
            <div className="text-center mb-3">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-2 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl shadow-green-500/50">
                <CheckCircle sx={{ fontSize: 36, color: 'white' }} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                Investment Suggestions
              </h2>
              <p className="text-sm text-gray-600">Based on your profile, here are our recommendations</p>
            </div>
            
            <div className="max-w-5xl mx-auto space-y-3">
              {investmentOptions.length > 0 ? (
                investmentOptions.map((option, index) => (
                  <div key={index} className="clay-card bg-white/90 backdrop-blur-lg p-4 rounded-3xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-0.5">{option.name}</h3>
                        <p className="text-xs text-gray-600 mb-1">
                          {option.category} {option.riskLevel && `| Risk: ${option.riskLevel}`}
                        </p>
                        {option.description && (
                          <p className="text-xs text-gray-700 leading-relaxed">{option.description}</p>
                        )}
                      </div>

                      {option.currentPrice && (
                        <div className="clay-card bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-2 rounded-2xl min-w-fit">
                          <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-0.5">
                            Current Price
                          </p>
                          <p className="text-lg font-bold text-indigo-700">
                            ₹{option.currentPrice.toLocaleString("en-IN")}
                          </p>
                        </div>
                      )}
                    </div>
    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t-2 border-gray-200">
                      {option.minInvestment && (
                        <div className="glass-card bg-blue-50/50 p-2.5 rounded-2xl">
                          <p className="text-[10px] text-gray-600 mb-0.5">Min Investment</p>
                          <p className="text-sm font-bold text-gray-800">₹{option.minInvestment.toLocaleString('en-IN')}</p>
                        </div>
                      )}

                      {option.maxInvestment && (
                        <div className="glass-card bg-purple-50/50 p-2.5 rounded-2xl">
                          <p className="text-[10px] text-gray-600 mb-0.5">Max Investment</p>
                          <p className="text-sm font-bold text-gray-800">₹{option.maxInvestment.toLocaleString('en-IN')}</p>
                        </div>
                      )}

                      {option.expectedReturn && (
                        <div className="glass-card bg-green-50/50 p-2.5 rounded-2xl">
                          <p className="text-[10px] text-gray-600 mb-0.5">Expected Return</p>
                          <p className="text-sm font-bold text-green-700">{option.expectedReturn}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="clay-card bg-white/80 backdrop-blur-lg p-6 rounded-3xl text-center">
                  <p className="text-sm text-gray-600">No investment options available at the moment.</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-3">
                <button
                  onClick={handleDownloadReport}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  <GetApp sx={{ fontSize: 20 }} />
                  <span>Download Report</span>
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl hover:shadow-2xl hover:shadow-gray-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  <span>Go to Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-3 md:py-4 px-4">
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        }
        
        .clay-card {
          box-shadow: 
            12px 12px 24px rgba(174, 174, 192, 0.4),
            -12px -12px 24px rgba(255, 255, 255, 0.9),
            inset 2px 2px 4px rgba(255, 255, 255, 0.5),
            inset -2px -2px 4px rgba(174, 174, 192, 0.2);
        }
        
        .clay-card:hover {
          box-shadow: 
            16px 16px 32px rgba(174, 174, 192, 0.5),
            -16px -16px 32px rgba(255, 255, 255, 1),
            inset 3px 3px 6px rgba(255, 255, 255, 0.6),
            inset -3px -3px 6px rgba(174, 174, 192, 0.3);
        }
      `}</style>
      
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-4 ">
          
          <div className="flex items-center  justify-between mb-2">
              {[1, 2, 3, 4, 5, 6].map((step, index) => (
                <div key={step} className="flex items-center flex-1 min-w-0">
                  {/* Step Circle */}
                  <div
                    className={`
                      w-9 h-9 md:w-10 md:h-10 rounded-2xl
                      flex items-center justify-center
                      text-sm md:text-base font-bold
                      transition-all duration-300
                      flex-shrink-0
                      ${
                        step <= currentStep
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40'
                          : 'bg-white/70 backdrop-blur text-gray-400 border border-gray-200'
                      }
                    `}
                  >
                    {step}
                  </div>

                  {/* Connector */}
                  {index < 5 && (
                    <div className="flex-1 mx-1 md:mx-2">
                      <div
                        className={`
                          h-1.5 rounded-full transition-all duration-300
                          ${
                            step < currentStep
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                              : 'bg-gray-200'
                          }
                        `}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs md:text-sm text-gray-600 font-medium px-1">
              <span className="text-left w-full">Salary</span>
              <span className="text-left w-full">Loans</span>
              <span className="text-left w-full">Expenses</span>
              <span className="text-left w-full">Investment</span>
              <span className="text-left w-full">Risks</span>
              <span className="text-left w-full">Results</span>
            </div>
          </div>

        {/* Step Content */}
        <div className="glass-card rounded-3xl shadow-2xl p-4 md:p-5">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 text-base font-semibold clay-card bg-white/80 backdrop-blur-lg rounded-2xl text-gray-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
            >
              {loading ? 'Processing...' : currentStep === 5 ? 'Complete' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;