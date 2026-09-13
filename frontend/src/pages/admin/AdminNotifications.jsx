import { useState } from 'react';
import API from '../../services/api';
import { FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminNotifications = () => {
  const [form, setForm] = useState({ target: 'all', title: '', message: '', type: 'general' });
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/notifications/broadcast', form);
      toast.success('Broadcast notification sent successfully!');
      setForm({ target: 'all', title: '', message: '', type: 'general' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24 }}>System Broadcast Notifications</h1>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px', maxWidth: 600 }}>
        <h5 style={{ fontWeight: 700, marginBottom: 20 }}>Send System Announcement</h5>
        <form onSubmit={handleSend}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label-custom">Target Audience</label>
              <select className="form-control-custom" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })}>
                <option value="all">All Users (Farmers & Buyers)</option>
                <option value="farmer">Farmers Only</option>
                <option value="buyer">Buyers Only</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label-custom">Title *</label>
              <input type="text" className="form-control-custom" placeholder="Notification Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="col-12">
              <label className="form-label-custom">Message *</label>
              <textarea className="form-control-custom" rows={4} placeholder="Announcement details..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: 'vertical' }} />
            </div>
          </div>
          <button type="submit" className="btn-primary-custom mt-4" disabled={loading}>
            <FiSend /> {loading ? 'Sending...' : 'Send Broadcast'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminNotifications;
