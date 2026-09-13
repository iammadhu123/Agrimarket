import { useState, useEffect } from 'react';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiSearch, FiMapPin, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const MarketPricesPage = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50, ...(search && { search }), ...(location && { location }) });
      const { data } = await API.get(`/market-prices?${params}`);
      setPrices(data.prices || []);
    } catch { setPrices([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPrices(); }, [search, location]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f3d1f 0%, #1a6b35 100%)', padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: 8 }}>📊 Market Prices</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 24 }}>Real-time agricultural commodity prices from mandis across India</p>
          <div className="row g-2" style={{ maxWidth: 600 }}>
            <div className="col-sm-7">
              <div style={{ background: 'white', borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8 }}>
                <FiSearch style={{ color: 'var(--gray-400)' }} />
                <input type="text" placeholder="Search crop or market..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: '0.9rem', background: 'transparent' }} />
              </div>
            </div>
            <div className="col-sm-5">
              <div style={{ background: 'white', borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8 }}>
                <FiMapPin style={{ color: 'var(--gray-400)' }} />
                <input type="text" placeholder="Filter by location..." value={location} onChange={e => setLocation(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: '0.9rem', background: 'transparent' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 12px' }}>
        {loading ? <Loading /> : prices.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📊</span>
            <h4>No market prices found</h4>
            <p>Check back later for updated prices</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="table-custom" style={{ minWidth: 700 }}>
                <thead>
                  <tr>
                    <th>Crop / Product</th>
                    <th>Market</th>
                    <th>Location</th>
                    <th>Min Price</th>
                    <th>Max Price</th>
                    <th>Avg Price</th>
                    <th>Unit</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map(p => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: 700 }}>🌾 {p.cropName}</td>
                      <td style={{ color: 'var(--dark-700)' }}>{p.marketName}</td>
                      <td>
                        <span className="d-flex align-items-center gap-1" style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                          <FiMapPin size={12} /> {p.location}
                        </span>
                      </td>
                      <td style={{ color: 'var(--danger)', fontWeight: 600 }}>₹{p.minPrice}</td>
                      <td style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{p.maxPrice}</td>
                      <td>
                        <span style={{ background: 'var(--primary-100)', color: 'var(--primary-dark)', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.875rem' }}>
                          ₹{p.avgPrice}
                        </span>
                      </td>
                      <td style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>per {p.unit}</td>
                      <td style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>
                        {new Date(p.date).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPricesPage;
