import  { useState, useEffect } from 'react';
import { investmentAPI } from '../services/api';

const InvestmentSelection = () => {
  const [selectionData, setSelectionData] = useState(null);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchInvestmentOptions();
  }, []);

  const fetchInvestmentOptions = async () => {
    try {
      setLoading(true);
      const response = await investmentAPI.getSelectionOptions();
      setSelectionData(response.data);
    } catch (err) {
      setError('Failed to load investment options');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvestmentSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedInvestment || !investmentAmount) {
      setError('Please select an investment type and enter amount');
      return;
    }

    const amount = parseFloat(investmentAmount);
    
    if (amount > selectionData.availableForInvestment) {
      setError(`Investment amount ₹${amount.toLocaleString()} exceeds available amount ₹${selectionData.availableForInvestment.toLocaleString()}`);
      return;
    }

    if (amount < selectedInvestment.minimumAmount) {
      setError(`Minimum investment amount for ${selectedInvestment.name} is ₹${selectedInvestment.minimumAmount.toLocaleString()}`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const investmentData = {
        investmentName: `${selectedInvestment.name} Investment`,
        investmentType: selectedInvestment.type,
        principalAmount: amount,
        expectedReturnRate: getDefaultReturnRate(selectedInvestment.type),
        investmentPeriodYears: 5 // Default 5 years
      };

      await investmentAPI.create(investmentData);
      setSuccess(`Successfully created ${selectedInvestment.name} investment of ₹${amount.toLocaleString()}`);
      
      // Reset form
      setSelectedInvestment(null);
      setInvestmentAmount('');
      
      // Refresh data
      await fetchInvestmentOptions();
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultReturnRate = (type) => {
    switch (type) {
      case 1: return 12; // SIP
      case 2: return 10; // Lumpsum
      case 3: return 15; // Equity
      case 4: return 7;  // FD
      default: return 10;
    }
  };

  if (loading && !selectionData) {
    return <div className="flex justify-center p-8">Loading investment options...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Investment Type</h2>
        <p className="text-gray-600 mb-6">Select where you want to invest your remaining income</p>
        
        {/* Available Amount Display */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-green-800">Available for Investment</h3>
              <p className="text-3xl font-bold text-green-600">₹{selectionData?.availableForInvestment?.toLocaleString() || '0'}</p>
            </div>
            {selectionData?.totalMonthlyEmi > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Monthly EMI Deducted</p>
                <p className="text-lg font-semibold text-red-600">₹{selectionData.totalMonthlyEmi.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Investment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {selectionData?.investmentOptions?.map((option) => (
            <div
              key={option.type}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedInvestment?.type === option.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedInvestment(option)}
            >
              <h3 className="font-semibold text-gray-800">{option.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{option.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Min: ₹{option.minimumAmount.toLocaleString()}</span>
                <span className={`px-2 py-1 rounded ${
                  option.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                  option.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {option.riskLevel} Risk
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Investment Amount Form */}
        {selectedInvestment && (
          <form onSubmit={handleInvestmentSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Amount for {selectedInvestment.name}
              </label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder={`Minimum ₹${selectedInvestment.minimumAmount.toLocaleString()}`}
                min={selectedInvestment.minimumAmount}
                max={selectionData.availableForInvestment}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: ₹{selectionData.availableForInvestment.toLocaleString()}
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Investment...' : 'Create Investment'}
            </button>
          </form>
        )}

        {selectionData?.availableForInvestment <= 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800">
              No funds available for investment after EMI deductions. 
              Consider increasing your income or reducing expenses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentSelection;