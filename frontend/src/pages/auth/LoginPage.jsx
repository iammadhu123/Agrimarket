import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      const routes = { farmer: '/farmer/dashboard', buyer: '/buyer/dashboard', admin: '/admin/dashboard' };
      navigate(routes[result.role] || '/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--gray-50)' }}>
      {/* Left Decorative Panel */}
      <div
        className="d-none d-lg-flex flex-column justify-content-center align-items-center"
        style={{
          width: '45%', background: 'linear-gradient(135deg, #0f3d1f 0%, #1a6b35 50%, #22c55e 100%)',
          padding: 60, position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <GiWheat style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.9)', marginBottom: 24 }} />
          <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>
            Smart Agriculture<br />Marketplace
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 320 }}>
            Connect with farmers, buy fresh produce directly, and support Indian agriculture.
          </p>
          <div className="d-flex gap-3 mt-4 justify-content-center flex-wrap">
            {['Fresh Produce', 'Direct from Farms', 'Best Prices', 'Secure'].map(tag => (
              <span key={tag} style={{
                background: 'rgba(255,255,255,0.15)', color: 'white', padding: '6px 16px',
                borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600,
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div className="text-center mb-5">
            <Link to="/" className="d-inline-flex align-items-center gap-2 mb-4" style={{ textDecoration: 'none' }}>
              <GiWheat style={{ fontSize: '1.6rem', color: 'var(--primary)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>AgriMarket</span>
            </Link>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>Welcome back</h1>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label-custom">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', fontSize: '1rem' }} />
                <input
                  type="email"
                  className="form-control-custom"
                  style={{ paddingLeft: 42 }}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label-custom">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-control-custom"
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary-custom w-100 justify-content-center"
              style={{ padding: '12px', fontSize: '1rem', marginBottom: 16 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center" style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create one</Link>
            </p>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: 32, padding: 16, background: 'var(--gray-50)', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gray-600)', marginBottom: 8 }}>🔐 Demo Credentials:</p>
            {[
              { label: 'Admin', email: 'admin@agrimarket.com', pass: 'Admin@123' },
              { label: 'Farmer', email: 'ramesh@farmer.com', pass: 'Farmer@123' },
              { label: 'Buyer', email: 'priya@buyer.com', pass: 'Buyer@123' },
            ].map(({ label, email, pass }) => (
              <div key={label} className="d-flex align-items-center justify-content-between mb-1">
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                  <strong>{label}:</strong> {email} / {pass}
                </span>
                <button
                  type="button"
                  onClick={() => setForm({ email, password: pass })}
                  style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
