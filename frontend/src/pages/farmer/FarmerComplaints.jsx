import { useState, useEffect } from 'react';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const CATEGORIES = ['product', 'order', 'payment', 'account', 'other'];

const ComplaintsPage = ({ role = 'farmer' }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', description: '', category: 'other', priority: 'medium' });

  useEffect(() => {
    API.get('/complaints/my-complaints')
      .then(r => setComplaints(r.data.complaints || []))
      .catch(() => toast.error('Failed to load complaints'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/complaints', form);
      setComplaints(prev => [data.complaint, ...prev]);
      toast.success('Complaint submitted!');
      setShowForm(false);
      setForm({ subject: '', description: '', category: 'other', priority: 'medium' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit'); }
  };

  const statusBadge = (status) => {
    const map = { open: 'pending', in_progress: 'confirmed', resolved: 'delivered', closed: 'cancelled' };
    return <span className={`badge-status badge-${map[status] || 'pending'}`}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>My Complaints</h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.875rem' }}>Raise and track your support requests</p>
        </div>
        <button className="btn-primary-custom" onClick={() => setShowForm(true)}><FiPlus /> New Complaint</button>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        {loading ? <Loading /> : complaints.length === 0 ? (
          <div className="empty-state"><span className="empty-state-icon">📝</span><h4>No complaints</h4><p>Your complaints will appear here</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead><tr><th>Subject</th><th>Category</th><th>Priority</th><th>Status</th><th>Admin Note</th><th>Date</th></tr></thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.subject}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 2 }}>{c.description.slice(0, 60)}...</div>
                    </td>
                    <td style={{ textTransform: 'capitalize', fontSize: '0.875rem' }}>{c.category}</td>
                    <td>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: c.priority === 'urgent' ? 'var(--danger)' : c.priority === 'high' ? 'var(--secondary)' : 'var(--gray-600)', textTransform: 'capitalize' }}>
                        {c.priority}
                      </span>
                    </td>
                    <td>{statusBadge(c.status)}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{c.adminNote || '—'}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={() => setShowForm(false)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', borderRadius: 'var(--radius-xl)', padding: '32px', zIndex: 1001, width: '90%', maxWidth: 500 }}>
            <h5 style={{ fontWeight: 800, marginBottom: 24 }}>Submit a Complaint</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label-custom">Subject *</label>
                  <input type="text" className="form-control-custom" placeholder="Brief summary of your issue" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Category</label>
                  <select className="form-control-custom" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Priority</label>
                  <select className="form-control-custom" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Description *</label>
                  <textarea className="form-control-custom" rows={4} placeholder="Describe your issue in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ resize: 'vertical' }} />
                </div>
              </div>
              <div className="d-flex gap-3 mt-4">
                <button type="submit" className="btn-primary-custom flex-fill justify-content-center">Submit Complaint</button>
                <button type="button" className="btn-outline-custom" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ComplaintsPage;
