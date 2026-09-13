import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  FiHome, FiShoppingBag, FiShoppingCart, FiHeart,
  FiStar, FiBell, FiUser, FiMessageSquare, FiLogOut, FiMenu
} from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

const navItems = [
  { to: '/buyer/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/marketplace', icon: FiShoppingBag, label: 'Marketplace', external: true },
  { to: '/buyer/cart', icon: FiShoppingCart, label: 'Cart' },
  { to: '/buyer/orders', icon: FiShoppingBag, label: 'My Orders' },
  { to: '/buyer/wishlist', icon: FiHeart, label: 'Wishlist' },
  { to: '/buyer/reviews', icon: FiStar, label: 'My Reviews' },
  { to: '/buyer/notifications', icon: FiBell, label: 'Notifications' },
  { to: '/buyer/profile', icon: FiUser, label: 'Profile' },
  { to: '/buyer/complaints', icon: FiMessageSquare, label: 'Complaints' },
];

const BuyerLayout = () => {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
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
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>AgriMarket</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0,
          }}>
            {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark)' }}>{user?.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--secondary)', fontWeight: 600 }}>🛒 Buyer</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
              <Icon />
              {label}
              {label === 'Cart' && cartItemCount > 0 && (
                <span style={{
                  marginLeft: 'auto', background: 'var(--primary)', color: 'white',
                  borderRadius: '50px', padding: '1px 8px', fontSize: '0.7rem', fontWeight: 700,
                }}>
                  {cartItemCount}
                </span>
              )}
            </div>
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px 0', borderTop: '1px solid var(--gray-100)' }}>
        <button onClick={handleLogout} className="sidebar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <FiLogOut /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar-custom ${sidebarOpen ? 'open' : ''}`}>
        <SidebarContent />
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="d-lg-none d-flex align-items-center justify-content-between px-4 py-3 bg-white" style={{ borderBottom: '1px solid var(--gray-200)' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FiMenu size={24} />
          </button>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)' }}>AgriMarket</span>
          <div style={{ width: 24 }} />
        </div>
        <main className="dashboard-content"><Outlet /></main>
      </div>
    </div>
  );
};

export default BuyerLayout;
