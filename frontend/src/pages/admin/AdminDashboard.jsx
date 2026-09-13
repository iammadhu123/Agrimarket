import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiUsers, FiPackage, FiShoppingBag, FiMessageSquare, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#16a34a', '#f97316', '#7c3aed', '#0ea5e9', '#ef4444'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/reports/dashboard-stats')
      .then(r => setStats(r.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const userDistribution = [
    { name: 'Farmers', value: stats?.farmers || 0, fill: '#16a34a' },
    { name: 'Buyers', value: stats?.buyers || 0, fill: '#f97316' },
  ];

  const orderStats = [
    { name: 'Pending', count: stats?.pendingOrders || 0 },
    { name: 'Delivered', count: stats?.deliveredOrders || 0 },
  ];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Admin Overview ⚡</h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.9rem' }}>System-wide metrics and performance</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-5">
        {[
          { icon: FiUsers, value: stats?.totalUsers || 0, label: 'Total Users', color: '#7c3aed', bg: '#f5f3ff', to: '/admin/users' },
          { icon: FiPackage, value: stats?.totalProducts || 0, label: 'Listed Products', color: 'var(--primary)', bg: 'var(--primary-100)', to: '/admin/products' },
          { icon: FiShoppingBag, value: stats?.totalOrders || 0, label: 'Total Orders', color: 'var(--secondary)', bg: '#fff7ed', to: '/admin/orders' },
          { icon: FiTrendingUp, value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, label: 'Platform Revenue', color: 'var(--info)', bg: '#eff6ff', to: '/admin/reports' },
          { icon: FiMessageSquare, value: stats?.openComplaints || 0, label: 'Open Complaints', color: 'var(--danger)', bg: '#fef2f2', to: '/admin/complaints' },
        ].map(s => (
          <div key={s.label} className="col-6 col-lg-4 col-xl">
            <Link to={s.to} style={{ textDecoration: 'none' }}>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: s.bg, color: s.color }}><s.icon size={22} /></div>
                <div>
                  <div className="stat-value" style={{ fontSize: '1.5rem' }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '24px' }}>
            <h6 style={{ fontWeight: 700, marginBottom: 20 }}>User Breakdown</h6>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={userDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                  {userDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-7">
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '24px' }}>
            <h6 style={{ fontWeight: 700, marginBottom: 20 }}>Order Status Overview</h6>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={orderStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
