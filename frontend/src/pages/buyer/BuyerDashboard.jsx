import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import { FiShoppingBag, FiHeart, FiStar, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const StatCard = ({ icon, value, label, color, bg, to }) => (
  <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg, color }}>{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  </Link>
);

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { cartItemCount } = useCart();
  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [orderRes, wishRes] = await Promise.all([
          API.get('/orders/my-orders?limit=5'),
          API.get('/wishlist'),
        ]);
        setOrders(orderRes.data.orders || []);
        setWishlistCount(wishRes.data.wishlist?.products?.length || 0);
      } catch {}
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const statusBadge = (status) => {
    const map = { pending: 'pending', confirmed: 'confirmed', processing: 'pending', shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled' };
    return <span className={`badge-status badge-${map[status]}`}>{status}</span>;
  };

  const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-4">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Welcome, {user?.name?.split(' ')[0]}! 🛒</h1>
        <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.9rem' }}>Browse fresh products and track your orders</p>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-5">
        {[
          { icon: '📦', value: orders.length, label: 'Total Orders', color: 'var(--primary)', bg: 'var(--primary-100)', to: '/buyer/orders' },
          { icon: '⏳', value: pendingOrders, label: 'Pending Orders', color: 'var(--secondary)', bg: '#fff7ed', to: '/buyer/orders' },
          { icon: '✅', value: completedOrders, label: 'Delivered', color: '#7c3aed', bg: '#f5f3ff', to: '/buyer/orders' },
          { icon: '❤️', value: wishlistCount, label: 'Wishlist Items', color: 'var(--danger)', bg: '#fef2f2', to: '/buyer/wishlist' },
          { icon: '🛒', value: cartItemCount, label: 'Cart Items', color: 'var(--info)', bg: '#eff6ff', to: '/buyer/cart' },
        ].map(s => (
          <div key={s.label} className="col-6 col-lg-4 col-xl">
            <StatCard {...s} />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="row g-3 mb-5">
        {[
          { to: '/marketplace', icon: '🛒', label: 'Browse Marketplace', color: 'var(--primary)', bg: 'var(--primary-50)' },
          { to: '/buyer/cart', icon: '🛍️', label: 'View Cart', color: 'var(--secondary)', bg: '#fff7ed' },
          { to: '/buyer/wishlist', icon: '❤️', label: 'My Wishlist', color: 'var(--danger)', bg: '#fef2f2' },
          { to: '/buyer/orders', icon: '📦', label: 'Track Orders', color: '#7c3aed', bg: '#f5f3ff' },
        ].map(({ to, icon, label, color, bg }) => (
          <div key={to} className="col-6 col-lg-3">
            <Link to={to} style={{ textDecoration: 'none' }}>
              <div style={{ background: bg, border: `1px solid ${color}22`, borderRadius: 'var(--radius-lg)', padding: '20px', textAlign: 'center', transition: 'all 0.25s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>{icon}</span>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color }}>{label}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h5 style={{ margin: 0, fontWeight: 700 }}>Recent Orders</h5>
          <Link to="/buyer/orders" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View All <FiArrowRight size={14} /></Link>
        </div>
        {orders.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px' }}>
            <span className="empty-state-icon">🛒</span>
            <h4>No orders yet</h4>
            <Link to="/marketplace" className="btn-primary-custom mt-2">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead><tr><th>Order ID</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      <Link to={`/buyer/orders/${o._id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                        #{o._id.slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>{o.items?.length} item(s)</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{o.totalAmount}</td>
                    <td>{statusBadge(o.status)}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
