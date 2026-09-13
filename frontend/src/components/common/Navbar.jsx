import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut,
  FiSettings, FiPackage, FiHome, FiShoppingBag, FiBell
} from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return null;
    const links = { farmer: '/farmer/dashboard', buyer: '/buyer/dashboard', admin: '/admin/dashboard' };
    return links[user.role];
  };

  return (
    <nav className="navbar-custom" style={{ boxShadow: '0 1px 0 #e2e8f0' }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          {/* Brand */}
          <Link to="/" className="navbar-brand-custom" style={{ textDecoration: 'none' }}>
            <GiWheat style={{ fontSize: '1.6rem' }} />
            <span>AgriMarket</span>
          </Link>

          {/* Desktop Nav */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `fw-500 text-decoration-none px-3 py-2 rounded-3 ${isActive ? 'text-success bg-success-subtle' : 'text-secondary'}`
              }
              style={{ fontSize: '0.9rem', fontWeight: 500 }}
            >
              Home
            </NavLink>
            <NavLink
              to="/marketplace"
              className={({ isActive }) =>
                `fw-500 text-decoration-none px-3 py-2 rounded-3 ${isActive ? 'text-success bg-success-subtle' : 'text-secondary'}`
              }
              style={{ fontSize: '0.9rem', fontWeight: 500 }}
            >
              Marketplace
            </NavLink>
            <NavLink
              to="/market-prices"
              className={({ isActive }) =>
                `fw-500 text-decoration-none px-3 py-2 rounded-3 ${isActive ? 'text-success bg-success-subtle' : 'text-secondary'}`
              }
              style={{ fontSize: '0.9rem', fontWeight: 500 }}
            >
              Market Prices
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `fw-500 text-decoration-none px-3 py-2 rounded-3 ${isActive ? 'text-success bg-success-subtle' : 'text-secondary'}`
              }
              style={{ fontSize: '0.9rem', fontWeight: 500 }}
            >
              About
            </NavLink>
          </div>

          {/* Right Actions */}
          <div className="d-flex align-items-center gap-2">
            {user?.role === 'buyer' && (
              <Link
                to="/buyer/cart"
                className="position-relative"
                style={{ textDecoration: 'none', color: 'var(--dark-700)', padding: '8px' }}
              >
                <FiShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span
                    className="position-absolute"
                    style={{
                      top: '2px', right: '2px', background: 'var(--primary)',
                      color: 'white', borderRadius: '50%', width: '18px', height: '18px',
                      fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="position-relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="d-flex align-items-center gap-2"
                  style={{
                    background: 'var(--gray-100)', border: 'none', borderRadius: '50px',
                    padding: '6px 14px 6px 6px', cursor: 'pointer', transition: 'var(--transition)',
                  }}
                >
                  <div
                    style={{
                      width: 30, height: 30, borderRadius: '50%', background: 'var(--primary)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                    }}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark)' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="position-fixed inset-0"
                      style={{ zIndex: 999 }}
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div
                      className="position-absolute end-0"
                      style={{
                        top: '100%', marginTop: '8px', background: 'white', borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.12)', border: '1px solid var(--gray-200)',
                        minWidth: '200px', zIndex: 1000, overflow: 'hidden',
                      }}
                    >
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-100)' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', textTransform: 'capitalize' }}>{user.role}</div>
                      </div>
                      {getDashboardLink() && (
                        <Link
                          to={getDashboardLink()}
                          className="d-flex align-items-center gap-2"
                          style={{ padding: '10px 16px', color: 'var(--dark)', textDecoration: 'none', fontSize: '0.875rem' }}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FiHome size={15} /> Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="d-flex align-items-center gap-2 w-100"
                        style={{
                          padding: '10px 16px', color: 'var(--danger)', background: 'none',
                          border: 'none', cursor: 'pointer', fontSize: '0.875rem',
                        }}
                      >
                        <FiLogOut size={15} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="d-none d-lg-flex gap-2">
                <Link to="/login" className="btn-outline-custom py-2 px-4" style={{ fontSize: '0.875rem' }}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary-custom py-2 px-4" style={{ fontSize: '0.875rem' }}>
                  Register
                </Link>
              </div>
            )}

            <button
              className="d-lg-none"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="d-lg-none" style={{ padding: '16px 0', borderTop: '1px solid var(--gray-100)', marginTop: '12px' }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/marketplace', label: 'Marketplace' },
              { to: '/market-prices', label: 'Market Prices' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `d-block px-3 py-2 rounded-3 mb-1 text-decoration-none fw-500 ${isActive ? 'text-success bg-success-subtle' : 'text-secondary'}`
                }
                style={{ fontSize: '0.9rem' }}
              >
                {label}
              </NavLink>
            ))}
            {!user && (
              <div className="d-flex gap-2 mt-3">
                <Link to="/login" className="btn-outline-custom flex-fill justify-content-center" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary-custom flex-fill justify-content-center" onClick={() => setMobileOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
