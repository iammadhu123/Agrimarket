import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', role: 'buyer', farmName: '', farmLocation: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return;
    const result = await register(form);
    if (result.success) {
      const routes = { farmer: '/farmer/dashboard', buyer: '/buyer/dashboard' };
      navigate(routes[result.role] || '/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 mb-3" style={{ textDecoration: 'none' }}>
            <GiWheat style={{ fontSize: '1.6rem', color: 'var(--primary)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>AgriMarket</span>
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>Join thousands of farmers and buyers</p>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 32, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-200)' }}>
          {/* Role Toggle */}
          <div className="d-flex gap-2 mb-4" style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius)', padding: 4 }}>
            {[
              { value: 'buyer', label: '🛒 I\'m a Buyer', desc: 'Browse & buy products' },
              { value: 'farmer', label: '🌾 I\'m a Farmer', desc: 'Sell my products' },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm({ ...form, role: value })}
                style={{
                  flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
                  background: form.role === value ? 'white' : 'transparent',
                  color: form.role === value ? 'var(--primary)' : 'var(--gray-600)',
                  boxShadow: form.role === value ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label-custom">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input
                    type="text"
                    className="form-control-custom"
                    style={{ paddingLeft: 42 }}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-12">
                <label className="form-label-custom">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
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
              <div className="col-md-6">
                <label className="form-label-custom">Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-control-custom"
                    style={{ paddingLeft: 42, paddingRight: 42 }}
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required minLength={6}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label-custom">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <FiPhone style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input
                    type="tel"
                    className="form-control-custom"
                    style={{ paddingLeft: 42 }}
                    placeholder="10-digit number"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              {form.role === 'farmer' && (
                <>
                  <div className="col-12">
                    <label className="form-label-custom">Farm Name</label>
                    <input
                      type="text"
                      className="form-control-custom"
                      placeholder="e.g. Green Valley Farms"
                      value={form.farmName}
                      onChange={e => setForm({ ...form, farmName: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label-custom">Farm Location</label>
                    <input
                      type="text"
                      className="form-control-custom"
                      placeholder="e.g. Pune, Maharashtra"
                      value={form.farmLocation}
                      onChange={e => setForm({ ...form, farmLocation: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary-custom w-100 justify-content-center mt-4"
              style={{ padding: '12px', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : `Create ${form.role === 'farmer' ? 'Farmer' : 'Buyer'} Account`}
            </button>
          </form>

          <p className="text-center mt-3" style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
