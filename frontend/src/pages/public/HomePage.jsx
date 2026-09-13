import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import ProductCard from '../../components/products/ProductCard';
import Loading from '../../components/common/Loading';
import { FiSearch, FiArrowRight, FiTruck, FiShield, FiAward, FiUsers } from 'react-icons/fi';
import { GiWheat, GiFarmer, GiPlantSeed, GiFruitTree } from 'react-icons/gi';
import { FaLeaf, FaAppleAlt, FaCarrot } from 'react-icons/fa';

const categoryIcons = {
  'Vegetables': '🥦', 'Fruits': '🍎', 'Grains': '🌾', 'Pulses': '🫘',
  'Spices': '🌶️', 'Seeds': '🌱', 'Organic Products': '🍃', 'Dairy Products': '🥛', 'Other': '📦',
};

const stats = [
  { icon: '👨‍🌾', value: '2,500+', label: 'Registered Farmers' },
  { icon: '🛒', value: '15,000+', label: 'Happy Buyers' },
  { icon: '🌿', value: '50,000+', label: 'Products Listed' },
  { icon: '📦', value: '1,20,000+', label: 'Orders Fulfilled' },
];

const howItWorks = [
  { step: '01', icon: '📝', title: 'Register & Verify', desc: 'Create your account as a farmer or buyer in just 2 minutes.' },
  { step: '02', icon: '🛒', title: 'Browse & Select', desc: 'Explore thousands of fresh agricultural products from verified farmers.' },
  { step: '03', icon: '💳', title: 'Order & Pay', desc: 'Place your order securely. Cash on delivery or online payment.' },
  { step: '04', icon: '🚚', title: 'Receive & Review', desc: 'Get your fresh produce delivered and share your experience.' },
];

const testimonials = [
  { name: 'Ramesh Kumar', role: 'Farmer, Punjab', text: 'AgriMarket transformed my business. I now sell directly to buyers without middlemen and earn 40% more.', avatar: '👨‍🌾' },
  { name: 'Priya Sharma', role: 'Buyer, Delhi', text: 'I get the freshest vegetables at farm prices. The quality is amazing and delivery is always on time!', avatar: '👩' },
  { name: 'Suresh Patel', role: 'Farmer, Gujarat', text: 'Managing my products and orders has never been easier. The dashboard is excellent!', avatar: '🧑‍🌾' },
];

const HomePage = () => {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          API.get('/categories?active=true'),
          API.get('/products?limit=8&sortBy=createdAt&sortOrder=desc'),
        ]);
        setCategories(catRes.data.categories || []);
        setFeaturedProducts(prodRes.data.products || []);
      } catch (err) {
        console.error('Failed to fetch home data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/marketplace?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7" style={{ animation: 'fadeInUp 0.6s ease' }}>
              <div className="d-inline-flex align-items-center gap-2 mb-3" style={{
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                borderRadius: '50px', padding: '6px 16px', border: '1px solid rgba(255,255,255,0.25)',
              }}>
                <GiPlantSeed style={{ color: '#86efac' }} />
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: 500 }}>
                  India's #1 Agricultural Marketplace
                </span>
              </div>

              <h1 className="hero-title">
                Fresh From Farm<br />
                <span style={{ color: '#86efac' }}>Directly to You</span>
              </h1>
              <p className="hero-subtitle">
                Connect with thousands of verified farmers across India. Buy fresh, organic, and quality 
                agricultural products at fair prices — supporting Indian agriculture.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="d-flex gap-2 mb-4" style={{ maxWidth: 520 }}>
                <div style={{
                  flex: 1, background: 'white', borderRadius: '12px', padding: '4px 4px 4px 16px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                }}>
                  <FiSearch style={{ color: 'var(--gray-400)', fontSize: '1.1rem', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search for vegetables, fruits, grains..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', color: 'var(--dark)', background: 'transparent' }}
                  />
                  <button type="submit" className="btn-primary-custom" style={{ borderRadius: '10px', padding: '10px 20px' }}>
                    Search
                  </button>
                </div>
              </form>

              <div className="d-flex flex-wrap gap-2">
                {['Tomatoes 🍅', 'Mangoes 🥭', 'Wheat 🌾', 'Spinach 🥬', 'Onions 🧅'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => navigate(`/marketplace?search=${tag.split(' ')[0]}`)}
                    style={{
                      background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '50px', padding: '4px 14px', fontSize: '0.8rem', cursor: 'pointer',
                      transition: 'all 0.2s', backdropFilter: 'blur(10px)',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-flex justify-content-end">
              <div style={{
                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)',
                borderRadius: '24px', padding: '32px', border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.2)', maxWidth: 360, width: '100%',
              }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👨‍🌾</div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 700 }}>Ramesh Kumar</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Verified Farmer • Punjab</div>
                  </div>
                </div>
                {[
                  { emoji: '🍅', name: 'Fresh Tomatoes', price: '₹40/kg', qty: '500 kg available' },
                  { emoji: '🥦', name: 'Organic Spinach', price: '₹30/kg', qty: '300 kg available' },
                  { emoji: '🧅', name: 'Fresh Onions', price: '₹25/kg', qty: '800 kg available' },
                ].map(({ emoji, name, price, qty }) => (
                  <div key={name} className="d-flex align-items-center justify-content-between mb-3 p-2 rounded-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
                      <div>
                        <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>{name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>{qty}</div>
                      </div>
                    </div>
                    <span style={{ color: '#86efac', fontWeight: 700, fontSize: '0.9rem' }}>{price}</span>
                  </div>
                ))}
                <Link to="/marketplace" className="btn-primary-custom w-100 justify-content-center" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', marginTop: 8 }}>
                  View All Products <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section style={{ background: 'var(--primary)', padding: '40px 0' }}>
        <div className="container">
          <div className="row g-3">
            {stats.map(({ icon, value, label }) => (
              <div key={label} className="col-6 col-lg-3 text-center">
                <div style={{ fontSize: '2rem', marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{value}</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section style={{ padding: '72px 0', background: 'white' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Browse by Category</div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>
          <div className="row g-3">
            {categories.map(cat => (
              <div key={cat._id} className="col-6 col-md-4 col-lg-3">
                <Link
                  to={`/marketplace?category=${cat._id}`}
                  className="d-flex flex-column align-items-center justify-content-center p-4 rounded-4 text-decoration-none"
                  style={{
                    background: 'var(--gray-50)', border: '1.5px solid var(--gray-200)',
                    transition: 'all 0.25s', minHeight: 120,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-50)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.borderColor = 'var(--gray-200)'; }}
                >
                  <span style={{ fontSize: '2.5rem', marginBottom: 8 }}>{categoryIcons[cat.name] || '📦'}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)', textAlign: 'center' }}>{cat.name}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section style={{ padding: '72px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-5">
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Fresh Picks</div>
              <h2 className="section-title mb-0">Featured Products</h2>
            </div>
            <Link to="/marketplace" className="btn-outline-custom">View All <FiArrowRight /></Link>
          </div>

          {loading ? (
            <Loading />
          ) : featuredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">🌱</span>
              <h4>No products yet</h4>
              <p>Products will appear here once farmers list them.</p>
            </div>
          ) : (
            <div className="row g-4">
              {featuredProducts.map(product => (
                <div key={product._id} className="col-sm-6 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ padding: '72px 0', background: 'white' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Simple Process</div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in 4 easy steps</p>
          </div>
          <div className="row g-4">
            {howItWorks.map(({ step, icon, title, desc }) => (
              <div key={step} className="col-md-6 col-lg-3">
                <div className="text-center p-4">
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'var(--primary-50)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px',
                    border: '2px solid var(--primary-100)',
                  }}>{icon}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, marginBottom: 4 }}>Step {step}</div>
                  <h5 style={{ fontWeight: 700, marginBottom: 8 }}>{title}</h5>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS SECTION ===== */}
      <section style={{ padding: '72px 0', background: 'linear-gradient(135deg, #0f3d1f 0%, #1a6b35 100%)' }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <div style={{ color: '#86efac', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Why Choose Us</div>
              <h2 style={{ color: 'white', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>Benefits for Farmers & Buyers</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                We're eliminating middlemen and creating direct connections between farmers and consumers, 
                ensuring fair prices for all.
              </p>
              <Link to="/register" className="btn-primary-custom mt-4" style={{ background: 'white', color: 'var(--primary)' }}>
                Join AgriMarket <FiArrowRight />
              </Link>
            </div>
            <div className="col-lg-7">
              <div className="row g-3">
                {[
                  { icon: '💰', title: 'Higher Income', desc: 'Farmers earn 30-40% more by selling directly without middlemen.' },
                  { icon: '🌿', title: 'Fresh Produce', desc: 'Buyers get fresher produce at lower prices, directly from farms.' },
                  { icon: '📊', title: 'Market Prices', desc: 'Real-time market price data helps farmers make informed decisions.' },
                  { icon: '🔒', title: 'Secure Platform', desc: 'Verified farmers, secure payments, and buyer protection.' },
                  { icon: '📱', title: 'Easy to Use', desc: 'Simple dashboard for both farmers and buyers on any device.' },
                  { icon: '🚚', title: 'Reliable Delivery', desc: 'Track your orders in real-time from farm to doorstep.' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="col-md-6">
                    <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 'var(--radius)', padding: '20px', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <span style={{ fontSize: '1.5rem', marginBottom: 8, display: 'block' }}>{icon}</span>
                      <h6 style={{ color: 'white', fontWeight: 700, marginBottom: 4 }}>{title}</h6>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={{ padding: '72px 0', background: 'white' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Reviews</div>
            <h2 className="section-title">What Our Community Says</h2>
          </div>
          <div className="row g-4">
            {testimonials.map(({ name, role, text, avatar }) => (
              <div key={name} className="col-md-4">
                <div className="p-4 rounded-4 h-100" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
                  <div className="d-flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => <span key={i} style={{ color: 'var(--warning)', fontSize: '0.9rem' }}>★</span>)}
                  </div>
                  <p style={{ color: 'var(--dark-700)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: 20 }}>"{text}"</p>
                  <div className="d-flex align-items-center gap-3">
                    <span style={{ fontSize: '2rem' }}>{avatar}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>{role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section style={{ padding: '72px 0', background: 'var(--primary-50)', borderTop: '1px solid var(--primary-100)' }}>
        <div className="container text-center">
          <h2 className="section-title">Ready to Join AgriMarket?</h2>
          <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Whether you're a farmer wanting to sell your produce or a buyer looking for fresh products — we're here for you.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/register?role=farmer" className="btn-primary-custom" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              🌾 Register as Farmer
            </Link>
            <Link to="/marketplace" className="btn-outline-custom" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              🛒 Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
