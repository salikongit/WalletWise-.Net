import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { investmentAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Material UI Icons
import SearchIcon           from '@mui/icons-material/Search';
import FilterListIcon       from '@mui/icons-material/FilterList';
import TrendingUpIcon       from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon      from '@mui/icons-material/AttachMoney';
import CurrencyBitcoinIcon  from '@mui/icons-material/CurrencyBitcoin';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';

const INVESTMENT_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: '1', label: 'SIP' },
  { value: '2', label: 'Lumpsum' },
  { value: '3', label: 'Equity (Stocks)' },
  { value: '4', label: 'FD' },
];

const RealTimeInvestments = () => {
  const [investments,  setInvestments]  = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => { fetchInvestments(); }, [selectedType]);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const response = await investmentAPI.getRealTimeData(
        selectedType ? Number(selectedType) : null,
        searchTerm || null
      );
      setInvestments(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch investment data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInvestments();
  };

  /* ─────────────────────────────────────
     RENDER
     ───────────────────────────────────── */
  return (
    <div className="dash-root">

      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-header__title">Real-Time Investments</h1>
          <p className="dash-header__sub">Explore current market opportunities</p>
        </div>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="dash-glass-card dash-glass-card--static" style={{ marginBottom: 24 }}>
        <form onSubmit={handleSearch} className="rt-search-bar">

          {/* Search input */}
          <div className="rt-search-bar__input-wrap">
            <SearchIcon style={{ width: 18, height: 18 }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search investments by name or symbol…"
              className="rt-search-bar__input"
            />
          </div>

          {/* Filter select */}
          <div className="rt-search-bar__filter-wrap">
            <FilterListIcon style={{ width: 16, height: 16 }} />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rt-search-bar__filter"
            >
              {INVESTMENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Search button */}
          <button type="submit" className="clay-btn clay-btn--primary">
            <SearchIcon /> Search
          </button>
        </form>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <LoadingSpinner size="lg" />
        </div>

      ) : investments.length > 0 ? (
        <div className="rt-cards-grid">
          {investments.map((inv, index) => (
            <div key={index} className="dash-glass-card rt-card">

              {/* Name + Price */}
              <div className="rt-card__header">
                <div>
                  <div className="rt-card__name">{inv.name}</div>
                  {inv.symbol && <div className="rt-card__symbol">{inv.symbol}</div>}
                </div>
                {inv.price && (
                  <div className="rt-card__price">
                    ₹{inv.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                )}
              </div>

              {/* Description */}
              {inv.description && <div className="rt-card__desc">{inv.description}</div>}

              {/* Detail rows */}
              <div className="rt-card__details">
                {inv.category && (
                  <div className="rt-card__detail-row">
                    <CurrencyBitcoinIcon style={{ color: 'rgba(200,210,230,0.55)' }} />
                    <span className="rt-card__detail-label">Category</span>
                    <span className="rt-card__detail-value">{inv.category}</span>
                  </div>
                )}
                {inv.expectedReturn && (
                  <div className="rt-card__detail-row">
                    <TrendingUpIcon style={{ color: '#00d4aa' }} />
                    <span className="rt-card__detail-label">Expected Return</span>
                    <span className="rt-card__detail-value rt-card__detail-value--success">{inv.expectedReturn}%</span>
                  </div>
                )}
                {inv.minInvestment && (
                  <div className="rt-card__detail-row">
                    <AttachMoneyIcon style={{ color: 'rgba(200,210,230,0.55)' }} />
                    <span className="rt-card__detail-label">Min Investment</span>
                    <span className="rt-card__detail-value">₹{inv.minInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {inv.maxInvestment && (
                  <div className="rt-card__detail-row">
                    <AttachMoneyIcon style={{ color: 'rgba(200,210,230,0.55)' }} />
                    <span className="rt-card__detail-label">Max Investment</span>
                    <span className="rt-card__detail-value">₹{inv.maxInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      ) : (
        /* ── Empty State ── */
        <div className="dash-glass-card dash-glass-card--static rt-empty">
          <div className="rt-empty__icon">
            <SentimentNeutralIcon />
          </div>
          <div className="rt-empty__title">No investment options found</div>
          <div className="rt-empty__sub">Try adjusting your search or filter criteria</div>
        </div>
      )}
    </div>
  );
};

export default RealTimeInvestments;



// import { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { Search, TrendingUp, DollarSign, Filter } from 'lucide-react';
// import { investmentAPI } from '../services/api';
// import LoadingSpinner from '../components/LoadingSpinner';

// const INVESTMENT_TYPE_OPTIONS = [
//   { value: '', label: 'All Types' },
//   { value: '1', label: 'SIP' },
//   { value: '2', label: 'Lumpsum' },
//   { value: '3', label: 'Equity (Stocks)' },
//   { value: '4', label: 'FD' }
// ];

// const RealTimeInvestments = () => {
//   const [investments, setInvestments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedType, setSelectedType] = useState('');

//   useEffect(() => {
//     fetchInvestments();
//   }, [selectedType]);

//     const fetchInvestments = async () => {
//       setLoading(true);
//       try {
//         const response = await investmentAPI.getRealTimeData(
//           selectedType ? Number(selectedType) : null,
//           searchTerm || null
//         );
//         setInvestments(response.data || []);
//       } catch (error) {
//         toast.error('Failed to fetch investment data');
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };  

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchInvestments();
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Real-Time Investment Data</h1>
//           <p className="text-gray-600 mt-1">Explore current market opportunities</p>
//         </div>
//       </div>

//       {/* Search and Filter */}
//       <div className="bg-white p-4 rounded-lg shadow">
//         <form onSubmit={handleSearch} className="flex gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search investments by name or symbol..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             />
//           </div>
//           <div className="relative">
//             <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <select
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value)}
//               className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             >
//               {INVESTMENT_TYPE_OPTIONS.map(option => (
//                 <option key={option.value} value={option.value}>{option.label}</option>
//               ))}
//             </select>
//           </div>
//           <button
//             type="submit"
//             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//           >
//             Search
//           </button>
//         </form>
//       </div>

//       {/* Investments Grid */}
//       {loading ? (
//         <div className="flex justify-center py-12">
//           <LoadingSpinner size="lg" />
//         </div>
//       ) : investments.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {investments.map((investment, index) => (
//             <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900">{investment.name}</h3>
//                   <p className="text-sm text-gray-500 mt-1">{investment.symbol}</p>
//                 </div>
//                 {investment.price && (
//                   <div className="text-right">
//                     <p className="text-2xl font-bold text-indigo-600">
//                       ₹{investment.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {investment.description && (
//                 <p className="text-sm text-gray-600 mb-4">{investment.description}</p>
//               )}

//               <div className="space-y-2">
//                 {investment.category && (
//                   <div className="flex items-center text-sm">
//                     <span className="text-gray-600 w-24">Category:</span>
//                     <span className="font-semibold">{investment.category}</span>
//                   </div>
//                 )}
//                 {investment.expectedReturn && (
//                   <div className="flex items-center text-sm">
//                     <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
//                     <span className="text-gray-600 w-24">Expected Return:</span>
//                     <span className="font-semibold text-green-600">{investment.expectedReturn}%</span>
//                   </div>
//                 )}
//                 {investment.minInvestment && (
//                   <div className="flex items-center text-sm">
//                     <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
//                     <span className="text-gray-600 w-24">Min Investment:</span>
//                     <span className="font-semibold">₹{investment.minInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                   </div>
//                 )}
//                 {investment.maxInvestment && (
//                   <div className="flex items-center text-sm">
//                     <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
//                     <span className="text-gray-600 w-24">Max Investment:</span>
//                     <span className="font-semibold">₹{investment.maxInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow p-12 text-center">
//           <p className="text-gray-600 text-lg">No investment options found</p>
//           <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RealTimeInvestments;


