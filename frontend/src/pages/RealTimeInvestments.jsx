import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { investmentAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Material UI Icons
import SearchIcon           from '@mui/icons-material/Search';
import FilterListIcon       from '@mui/icons-material/FilterList';
import TrendingUpIcon       from '@mui/icons-material/TrendingUp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
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
                    <CurrencyRupeeIcon style={{ color: 'rgba(200,210,230,0.55)' }} />
                    <span className="rt-card__detail-label">Min Investment</span>
                    <span className="rt-card__detail-value">₹{inv.minInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {inv.maxInvestment && (
                  <div className="rt-card__detail-row">
                    <CurrencyRupeeIcon style={{ color: 'rgba(200,210,230,0.55)' }} />
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

