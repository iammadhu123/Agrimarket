import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import { FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp, FiPlus, FiArrowRight } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon: Icon, value, label, color, bg }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: bg, color }}><Icon size={24} /></div>
    <div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState({ totalExpense: 0, monthlyStats: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prodRes, orderRes, expRes] = await Promise.all([
          API.get('/products/my-products?limit=5'),
          API.get('/orders/farmer-orders?limit=5'),
          API.get('/expenses'),
        ]);
        setProducts(prodRes.data.products || []);
        setOrders(orderRes.data.orders || []);
        setExpenses({
          totalExpense: expRes.data.totalExpense || 0,
          monthlyStats: expRes.data.monthlyStats || [],
        });

        // Calculate stats from products and orders
        const allProds = prodRes.data;
        const allOrders = orderRes.data;
        setStats({
          totalProducts: allProds.total || 0,
          activeProducts: prodRes.data.products?.filter(p => p.status === 'active').length || 0,
          totalOrders: allOrders.total || 0,
          pendingOrders: orderRes.data.orders?.filter(o => o.status === 'pending').length || 0,
          completedOrders: orderRes.data.orders?.filter(o => o.status === 'delivered').length || 0,
        });
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <Loading />;

  const monthlyChartData = expenses.monthlyStats.map(m => ({
    name: new Date(m._id.year, m._id.month - 1).toLocaleString('default', { month: 'short' }),
    expense: m.total,
  }));

  const statusBadge = (status) => {
    const map = { pending: 'badge-pending', confirmed: 'badge-confirmed', processing: 'badge-status', shipped: 'badge-shipped', delivered: 'badge-delivered', cancelled: 'badge-cancelled' };
    return <span className={`badge-status ${map[status] || ''}`}>{status}</span>;
  };

  return (
    <div>
      {/* Welcome */}
      <div className="d-flex align-items-center justify-content-between mb-6 flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>
            Good day, {user?.name?.split(' ')[0]}! 🌾
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.9rem' }}>
            {user?.farmName || 'Your Farm'} • {user?.farmLocation || 'Location not set'}
          </p>
        </div>
        <Link to="/farmer/products/add" className="btn-primary-custom">
          <FiPlus /> Add New Product
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-5">
        {[
          { icon: FiPackage, value: stats?.totalProducts || 0, label: 'Total Products', color: 'var(--primary)', bg: 'var(--primary-100)' },
          { icon: FiShoppingBag, value: stats?.totalOrders || 0, label: 'Total Orders', color: 'var(--secondary)', bg: '#fff7ed' },
          { icon: FiTrendingUp, value: stats?.pendingOrders || 0, label: 'Pending Orders', color: 'var(--warning)', bg: '#fefce8' },
          { icon: FiDollarSign, value: `₹${expenses.totalExpense.toLocaleString()}`, label: 'Total Expenses', color: 'var(--danger)', bg: '#fef2f2' },
        ].map(s => (
          <div key={s.label} className="col-sm-6 col-xl-3">
            <StatCard {...s} />
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Orders */}
        <div className="col-lg-7">
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>Recent Orders</h5>
              <Link to="/farmer/orders" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View All <FiArrowRight size={14} /></Link>
            </div>
            {orders.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px' }}>
                <span className="empty-state-icon">📦</span>
                <h4>No orders yet</h4>
                <p>Orders from buyers will appear here</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table-custom">
                  <thead><tr><th>Order ID</th><th>Buyer</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td style={{ fontWeight: 700, fontSize: '0.8rem', fontFamily: 'monospace' }}>#{o._id.slice(-6).toUpperCase()}</td>
                        <td style={{ fontSize: '0.875rem' }}>{o.buyer?.name || 'N/A'}</td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{o.totalAmount}</td>
                        <td>{statusBadge(o.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Expense Chart */}
        <div className="col-lg-5">
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '20px' }}>
            <h5 style={{ fontWeight: 700, marginBottom: 20 }}>Monthly Expenses</h5>
            {monthlyChartData.length === 0 ? (
              <div className="empty-state" style={{ padding: '20px' }}>
                <span className="empty-state-icon">📊</span>
                <h4>No expense data</h4>
                <Link to="/farmer/expenses" className="btn-primary-custom mt-2" style={{ fontSize: '0.875rem' }}>Add Expense</Link>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={v => [`₹${v}`, 'Expense']} />
                  <Bar dataKey="expense" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="col-12">
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>My Products</h5>
              <Link to="/farmer/products" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View All <FiArrowRight size={14} /></Link>
            </div>
            {products.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px' }}>
                <span className="empty-state-icon">🌱</span>
                <h4>No products listed yet</h4>
                <Link to="/farmer/products/add" className="btn-primary-custom mt-2">Add Your First Product</Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table-custom">
                  <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img src={p.images?.[0]?.url || ''} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', background: 'var(--gray-100)' }} onError={e => { e.target.style.display = 'none'; }} />
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{p.category?.name}</td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{p.price}/{p.unit}</td>
                        <td style={{ fontSize: '0.875rem' }}>{p.quantity} {p.unit}</td>
                        <td>
                          <span className={`badge-status badge-${p.status === 'active' ? 'active' : p.status === 'out_of_stock' ? 'cancelled' : 'pending'}`}>
                            {p.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
