import { useState, useEffect } from 'react';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminReports = () => {
  const [sales, setSales] = useState(null);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/reports/sales'),
      API.get('/reports/users'),
    ])
      .then(([salesRes, usersRes]) => {
        setSales(salesRes.data);
        setUsers(usersRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const salesData = sales?.monthlySales?.map(m => ({
    month: `${m._id.month}/${m._id.year}`,
    revenue: m.revenue,
    orders: m.count,
  })) || [];

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24 }}>System Reports & Analytics</h1>

      <div className="row g-3 mb-5">
        <div className="col-md-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon green"><FiDollarSign size={24} /></div>
            <div>
              <div className="stat-value">₹{(sales?.totalRevenue || 0).toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon orange"><FiShoppingBag size={24} /></div>
            <div>
              <div className="stat-value">{sales?.totalOrders || 0}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-icon blue"><FiUsers size={24} /></div>
            <div>
              <div className="stat-value">{users?.farmers + users?.buyers}</div>
              <div className="stat-label">Total Platform Users</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-12">
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '24px' }}>
            <h5 style={{ fontWeight: 700, marginBottom: 20 }}>Monthly Revenue Trend (₹)</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={v => [`₹${v}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
