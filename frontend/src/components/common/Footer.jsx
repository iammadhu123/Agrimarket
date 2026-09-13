import { Link } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4 mb-5">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <GiWheat style={{ fontSize: '1.6rem', color: 'var(--primary-light)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>AgriMarket</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
              Connecting farmers directly with buyers for fresh, quality agricultural products. 
              Empowering Indian farmers with technology.
            </p>
            <div className="d-flex gap-3 mt-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.7)', transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-md-4">
            <h5>Quick Links</h5>
            {[
              { to: '/', label: 'Home' },
              { to: '/marketplace', label: 'Marketplace' },
              { to: '/market-prices', label: 'Market Prices' },
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="footer-link">{label}</Link>
            ))}
          </div>

          <div className="col-lg-2 col-md-4">
            <h5>For Farmers</h5>
            {[
              { to: '/register', label: 'Register as Farmer' },
              { to: '/farmer/dashboard', label: 'Farmer Dashboard' },
              { to: '/farmer/products/add', label: 'List Products' },
              { to: '/farmer/orders', label: 'Manage Orders' },
              { to: '/farmer/expenses', label: 'Track Expenses' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="footer-link">{label}</Link>
            ))}
          </div>

          <div className="col-lg-4 col-md-4">
            <h5>Contact Us</h5>
            <div className="d-flex flex-column gap-3">
              {[
                { Icon: FiMapPin, text: '123 Farm Road, New Delhi, India - 110001' },
                { Icon: FiPhone, text: '+91 98765 43210' },
                { Icon: FiMail, text: 'support@agrimarket.in' },
              ].map(({ Icon, text }, i) => (
                <div key={i} className="d-flex align-items-start gap-2">
                  <Icon size={16} style={{ color: 'var(--primary-light)', marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}
          className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2"
        >
          <p style={{ fontSize: '0.8rem', margin: 0 }}>
            © {new Date().getFullYear()} AgriMarket. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8rem', margin: 0 }}>
            Built with ❤️ for Indian Farmers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
