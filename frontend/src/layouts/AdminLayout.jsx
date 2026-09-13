import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiUsers, FiPackage, FiShoppingBag, FiTag,
  FiMessageSquare, FiTrendingUp, FiFileText, FiBell, FiLogOut, FiMenu
} from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

const navItems = [
  { to: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
  { to: '/admin/categories', icon: FiTag, label: 'Categories' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/admin/market-prices', icon: FiTrendingUp, label: 'Market Prices' },
  { to: '/admin/complaints', icon: FiMessageSquare, label: 'Complaints' },
  { to: '/admin/reports', icon: FiFileText, label: 'Reports' },
  { to: '/admin/notifications', icon: FiBell, label: 'Notifications' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div style={{ padding: '0 16px 24px', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <GiWheat style={{ fontSize: '1.3rem', color: 'var(--primary)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>AgriMarket</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0,
          }}>
            A
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark)' }}>{user?.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 600 }}>⚡ Administrator</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px 0', borderTop: '1px solid var(--gray-100)' }}>
        <button onClick={() => { logout(); navigate('/'); }} className="sidebar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <FiLogOut /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar-custom ${sidebarOpen ? 'open' : ''}`}><SidebarContent /></aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="d-lg-none d-flex align-items-center justify-content-between px-4 py-3 bg-white" style={{ borderBottom: '1px solid var(--gray-200)' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiMenu size={24} /></button>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)' }}>Admin Panel</span>
          <div style={{ width: 24 }} />
        </div>
        <main className="dashboard-content"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
