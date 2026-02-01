
import { useLocation, useNavigate } from "react-router-dom";

const OnboardingSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // If user opens directly, block page
  if (!state) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-xl">
        ❌ No onboarding data found — Please complete onboarding first.
      </div>
    );
  }

  const {
    remainingIncome,
    investmentSuggestion,
    stockSuggestions
  } = state; 

  return (
    <div className="max-w-5xl mx-auto mt-16 p-8 bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        🎉 Onboarding Completed — Your Financial Summary
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            Remaining Income
          </h2>
          <p className="text-3xl font-bold text-blue-900">
            ₹{remainingIncome.toLocaleString()}
          </p>
        </div>

        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Recommended SIP
          </h2>
          <p className="text-3xl font-bold text-green-900">
            ₹{investmentSuggestion.suggestedSIP.toLocaleString()}
          </p>
        </div>

        <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">
            Recommended Lumpsum
          </h2>
          <p className="text-3xl font-bold text-yellow-900">
            ₹{(investmentSuggestion.suggestedLumpsum || 0).toLocaleString()}
          </p>
        </div>

        <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">
            Profile Type
          </h2>
          <p className="text-2xl font-bold text-purple-900">
            {investmentSuggestion.profile}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        📈 Suggested Stocks (Based on Your SIP)
      </h2>

      {stockSuggestions?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stockSuggestions.map((stock, idx) => (
            <div key={idx} className="p-5 bg-white border shadow rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800">{stock.symbol}</h3>
              <p className="mt-2 text-lg text-gray-600">
                Price: ₹{stock.price}
              </p>
              <p className="mt-1 text-green-700 font-semibold">
                ✔️ Affordable for your SIP budget
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No stocks available under your budget.</p>
      )}

      <div className="mt-10 flex justify-end">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700"
        >
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
};

export default OnboardingSummary;
