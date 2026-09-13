import { useState, useEffect } from 'react';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';
import { FiEye } from 'react-icons/fi';

const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50, ...(statusFilter !== 'all' && { status: statusFilter }) });
      const { data } = await API.get(`/orders/farmer-orders?${params}`);
      setOrders(data.orders || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order ${newStatus} successfully`);
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
  };

  const statusBadge = (status) => {
    const map = { pending: 'pending', confirmed: 'confirmed', processing: 'pending', shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled' };
    return <span className={`badge-status badge-${map[status] || 'pending'}`}>{status}</span>;
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>Incoming Orders</h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.875rem' }}>{orders.length} orders</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '6px 14px', borderRadius: '50px', border: '1.5px solid var(--gray-200)',
                background: statusFilter === s ? 'var(--primary)' : 'white',
                color: statusFilter === s ? 'white' : 'var(--gray-600)',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        {loading ? <Loading /> : orders.length === 0 ? (
          <div className="empty-state"><span className="empty-state-icon">📦</span><h4>No orders found</h4></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Buyer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem' }}>#{o._id.slice(-6).toUpperCase()}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{o.buyer?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{o.buyer?.phone}</div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{o.items?.length} item(s)</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{o.totalAmount}</td>
                    <td>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: o.paymentStatus === 'paid' ? 'var(--primary)' : 'var(--warning)' }}>
                        {o.paymentStatus} ({o.paymentMethod?.toUpperCase()})
                      </span>
                    </td>
                    <td>{statusBadge(o.status)}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button onClick={() => setSelectedOrder(o)} style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', width: 32, height: 32, borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                          <FiEye size={14} />
                        </button>
                        {STATUS_TRANSITIONS[o.status]?.map(nextStatus => (
                          <button
                            key={nextStatus}
                            onClick={() => handleStatusUpdate(o._id, nextStatus)}
                            style={{ padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, background: nextStatus === 'cancelled' ? '#fef2f2' : 'var(--primary-100)', color: nextStatus === 'cancelled' ? 'var(--danger)' : 'var(--primary)', textTransform: 'capitalize' }}
                          >
                            {nextStatus}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={() => setSelectedOrder(null)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', borderRadius: 'var(--radius-xl)', padding: '32px', zIndex: 1001, width: '90%', maxWidth: 560, maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: 800, margin: 0 }}>Order #{selectedOrder._id.slice(-6).toUpperCase()}</h5>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'var(--gray-100)', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
            </div>

            <div className="row g-3 mb-4">
              {[
                { label: 'Buyer', value: selectedOrder.buyer?.name },
                { label: 'Phone', value: selectedOrder.buyer?.phone },
                { label: 'Total', value: `₹${selectedOrder.totalAmount}` },
                { label: 'Payment', value: `${selectedOrder.paymentStatus} (${selectedOrder.paymentMethod})` },
              ].map(({ label, value }) => (
                <div key={label} className="col-6">
                  <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 8 }}>Shipping Address</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.6, background: 'var(--gray-50)', borderRadius: 8, padding: '12px' }}>
                {selectedOrder.shippingAddress?.name} • {selectedOrder.shippingAddress?.phone}<br />
                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}<br />
                {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
              </p>
            </div>

            <div className="mt-3">
              <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 8 }}>Items</p>
              {selectedOrder.items?.map((item, i) => (
                <div key={i} className="d-flex align-items-center justify-content-between mb-2 p-2 rounded-3" style={{ background: 'var(--gray-50)' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</span>
                  <span style={{ color: 'var(--gray-600)', fontSize: '0.8rem' }}>{item.quantity} × ₹{item.price} = <strong>₹{item.quantity * item.price}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FarmerOrders;
