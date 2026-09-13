import { useState, useEffect } from 'react';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100, ...(statusFilter !== 'all' && { status: statusFilter }) });
      const { data } = await API.get(`/orders/admin/all?${params}`);
      setOrders(data.orders || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/orders/admin/${id}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch { toast.error('Failed to update'); }
  };

  const statusBadge = (status) => {
    const map = { pending: 'pending', confirmed: 'confirmed', processing: 'pending', shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled' };
    return <span className={`badge-status badge-${map[status]}`}>{status}</span>;
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>System Orders</h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.875rem' }}>{orders.length} orders across the platform</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '6px 14px', borderRadius: '50px', border: '1.5px solid var(--gray-200)',
              background: statusFilter === s ? '#7c3aed' : 'white', color: statusFilter === s ? 'white' : 'var(--gray-600)',
              cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize',
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        {loading ? <Loading /> : orders.length === 0 ? (
          <div className="empty-state"><h4>No orders found</h4></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead><tr><th>Order ID</th><th>Buyer</th><th>Farmer</th><th>Total</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem' }}>#{o._id.slice(-6).toUpperCase()}</td>
                    <td style={{ fontSize: '0.85rem' }}>{o.buyer?.name}</td>
                    <td style={{ fontSize: '0.85rem' }}>{o.farmer?.name}</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>₹{o.totalAmount}</td>
                    <td style={{ fontSize: '0.8rem' }}>{o.paymentStatus} ({o.paymentMethod})</td>
                    <td>{statusBadge(o.status)}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={e => handleStatusUpdate(o._id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--gray-200)', fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
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

export default AdminOrders;
