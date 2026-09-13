import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiPackage, FiPlusCircle, FiShoppingBag, FiDollarSign,
  FiUser, FiBell, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX
} from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

const navItems = [
  { to: '/farmer/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/farmer/profile', icon: FiUser, label: 'My Profile' },
  { to: '/farmer/products', icon: FiPackage, label: 'My Products' },
  { to: '/farmer/products/add', icon: FiPlusCircle, label: 'Add Product' },
  { to: '/farmer/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/farmer/expenses', icon: FiDollarSign, label: 'Expenses' },
  { to: '/farmer/notifications', icon: FiBell, label: 'Notifications' },
  { to: '/farmer/complaints', icon: FiMessageSquare, label: 'Complaints' },
];

const FarmerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <>
      <div style={{ padding: '0 16px 24px', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <GiWheat style={{ fontSize: '1.3rem', color: 'var(--primary)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
            AgriMarket
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1rem', flexShrink: 0,
          }}>
            {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark)' }}>{user?.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>🌾 Farmer</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 0' }}>
        <div className="sidebar-section-title">Main Menu</div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px 0', borderTop: '1px solid var(--gray-100)' }}>
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="dashboard-layout">
      {/* Mobile sidebar overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar-custom ${sidebarOpen ? 'open' : ''}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile topbar */}
        <div className="d-lg-none d-flex align-items-center justify-content-between px-4 py-3 bg-white" style={{ borderBottom: '1px solid var(--gray-200)' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FiMenu size={24} />
          </button>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)' }}>
            <GiWheat /> AgriMarket
          </span>
          <div style={{ width: 24 }} />
        </div>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FarmerLayout;
