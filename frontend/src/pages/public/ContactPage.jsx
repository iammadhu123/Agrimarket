import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f3d1f 0%, #1a6b35 100%)', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: 8 }}>Get in Touch</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>We're here to help farmers and buyers succeed</p>
        </div>
      </div>

      <section style={{ padding: '72px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4">
              <h3 style={{ fontWeight: 800, marginBottom: 8 }}>Contact Information</h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: 32 }}>Reach out for support, partnerships, or feedback.</p>
              {[
                { icon: FiMapPin, title: 'Office', lines: ['123 Farm Road', 'New Delhi - 110001, India'] },
                { icon: FiPhone, title: 'Phone', lines: ['+91 98765 43210', 'Mon–Sat, 9am–6pm'] },
                { icon: FiMail, title: 'Email', lines: ['support@agrimarket.in', 'farmers@agrimarket.in'] },
              ].map(({ icon: Icon, title, lines }) => (
                <div key={title} className="d-flex gap-4 mb-4">
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius)', background: 'var(--primary-50)', border: '1px solid var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{title}</div>
                    {lines.map(l => <div key={l} style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>{l}</div>)}
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-8">
              <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '36px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                <h4 style={{ fontWeight: 800, marginBottom: 24 }}>Send us a Message</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label-custom">Your Name</label>
                      <input type="text" className="form-control-custom" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-custom">Email Address</label>
                      <input type="email" className="form-control-custom" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label-custom">Subject</label>
                      <input type="text" className="form-control-custom" placeholder="How can we help?" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label-custom">Message</label>
                      <textarea className="form-control-custom" rows={5} placeholder="Your message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: 'vertical' }} />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary-custom mt-4" style={{ padding: '12px 28px' }} disabled={loading}>
                    <FiSend /> {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
