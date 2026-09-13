import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiArrowRight, FiSearch } from 'react-icons/fi';

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: 50, ...(statusFilter !== 'all' && { status: statusFilter }) });
        const { data } = await API.get(`/orders/my-orders?${params}`);
        setOrders(data.orders || []);
      } catch { }
      finally { setLoading(false); }
    };
    fetch();
  }, [statusFilter]);

  const statusBadge = (status) => {
    const map = { pending: 'pending', confirmed: 'confirmed', processing: 'pending', shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled' };
    return <span className={`badge-status badge-${map[status]}`}>{status}</span>;
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 20 }}>My Orders</h1>

      <div className="d-flex gap-2 mb-4 flex-wrap">
        {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{
              padding: '6px 14px', borderRadius: '50px', border: '1.5px solid var(--gray-200)',
              background: statusFilter === s ? 'var(--primary)' : 'white',
              color: statusFilter === s ? 'white' : 'var(--gray-600)',
              cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.2s',
            }}
          >
            {s === 'all' ? 'All Orders' : s}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        {loading ? <Loading /> : orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📦</span>
            <h4>No orders found</h4>
            <Link to="/marketplace" className="btn-primary-custom mt-2">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead><tr><th>Order ID</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.82rem' }}>#{o._id.slice(-6).toUpperCase()}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        {o.items?.slice(0, 2).map(i => i.name).join(', ')}
                        {o.items?.length > 2 && ` +${o.items.length - 2} more`}
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>₹{o.totalAmount}</td>
                    <td style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: o.paymentStatus === 'paid' ? 'var(--primary)' : 'var(--warning)', fontWeight: 600 }}>
                        {o.paymentStatus} ({o.paymentMethod})
                      </span>
                    </td>
                    <td>{statusBadge(o.status)}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <Link to={`/buyer/orders/${o._id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--primary-50)', color: 'var(--primary)', textDecoration: 'none', border: '1px solid var(--primary-100)' }}>
                        <FiArrowRight size={14} />
                      </Link>
                    </td>
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

export default BuyerOrders;
