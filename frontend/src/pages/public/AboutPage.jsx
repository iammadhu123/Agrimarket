import { Link } from 'react-router-dom';
import { GiWheat, GiFarmer } from 'react-icons/gi';
import { FiTarget, FiHeart, FiUsers, FiAward } from 'react-icons/fi';

const AboutPage = () => (
  <div>
    {/* Hero */}
    <div style={{ background: 'linear-gradient(135deg, #0f3d1f 0%, #1a6b35 100%)', padding: '80px 0', textAlign: 'center' }}>
      <div className="container">
        <GiWheat style={{ fontSize: '3.5rem', color: '#86efac', marginBottom: 16 }} />
        <h1 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 16 }}>About AgriMarket</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
          We're on a mission to transform Indian agriculture by connecting farmers directly with buyers, 
          eliminating middlemen, and ensuring fair prices for everyone.
        </p>
      </div>
    </div>

    {/* Mission */}
    <section style={{ padding: '72px 0', background: 'white' }}>
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Our Mission</div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', marginBottom: 20 }}>Empowering Indian Agriculture Through Technology</h2>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 16 }}>
              Agriculture is the backbone of India, yet farmers often struggle with unfair pricing, lack of market access, 
              and dependency on middlemen. AgriMarket changes that by creating a transparent, direct-to-consumer platform.
            </p>
            <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>
              Founded with a vision to double farmer incomes, we provide the tools farmers need to sell, manage their 
              business, and connect with buyers across India.
            </p>
          </div>
          <div className="col-lg-6">
            <div className="row g-3">
              {[
                { icon: FiTarget, title: 'Our Vision', desc: 'A digital India where every farmer can access nationwide markets and earn fair prices for their hard work.' },
                { icon: FiHeart, title: 'Our Values', desc: 'Transparency, fairness, and technology in service of the farmers who feed our nation.' },
                { icon: FiUsers, title: 'Our Community', desc: 'Over 2,500 farmers and 15,000 buyers united by the goal of better agriculture.' },
                { icon: FiAward, title: 'Our Promise', desc: 'Zero hidden fees. Direct payments to farmers. Quality guarantee for buyers.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="col-6">
                  <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: '20px', border: '1px solid var(--gray-200)', height: '100%' }}>
                    <Icon size={24} style={{ color: 'var(--primary)', marginBottom: 10 }} />
                    <h6 style={{ fontWeight: 700, marginBottom: 8 }}>{title}</h6>
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Team */}
    <section style={{ padding: '72px 0', background: 'var(--gray-50)' }}>
      <div className="container text-center">
        <h2 className="section-title">Built for Farmers, by People Who Care</h2>
        <p className="section-subtitle">A dedicated team working to transform Indian agriculture</p>
        <div className="row g-4 justify-content-center mt-4">
          {[
            { name: 'Arjun Sharma', role: 'Founder & CEO', emoji: '👨‍💼' },
            { name: 'Priya Nair', role: 'Head of Technology', emoji: '👩‍💻' },
            { name: 'Ravi Kumar', role: 'Farmer Relations', emoji: '👨‍🌾' },
          ].map(({ name, role, emoji }) => (
            <div key={name} className="col-md-4">
              <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>{emoji}</div>
                <h5 style={{ fontWeight: 700, marginBottom: 4 }}>{name}</h5>
                <p style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: '64px 0', background: 'var(--primary)', textAlign: 'center' }}>
      <div className="container">
        <h2 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 16 }}>Join the AgriMarket Revolution</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 32, fontSize: '1rem' }}>Whether you're a farmer or buyer, we have something for you.</p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/register" style={{ background: 'white', color: 'var(--primary)', padding: '12px 28px', borderRadius: 'var(--radius-sm)', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
            Get Started Free
          </Link>
          <Link to="/contact" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '12px 28px', borderRadius: 'var(--radius-sm)', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.3)' }}>
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
