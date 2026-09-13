import { useState, useEffect } from 'react';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [status, setStatus] = useState('in_progress');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/complaints/admin/all');
      setComplaints(data.complaints || []);
    } catch { toast.error('Failed to load complaints'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleResolve = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/complaints/admin/${selected._id}`, { status, adminNote });
      toast.success('Complaint status updated');
      setSelected(null);
      fetchComplaints();
    } catch { toast.error('Failed to update'); }
  };

  const statusBadge = (s) => {
    const map = { open: 'pending', in_progress: 'confirmed', resolved: 'delivered', closed: 'cancelled' };
    return <span className={`badge-status badge-${map[s]}`}>{s.replace('_', ' ')}</span>;
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 20 }}>Support Complaints</h1>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        {loading ? <Loading /> : complaints.length === 0 ? (
          <div className="empty-state"><h4>No complaints found</h4></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead><tr><th>Subject</th><th>User</th><th>Role</th><th>Priority</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{c.subject}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{c.description.slice(0, 50)}...</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{c.user?.name}</td>
                    <td style={{ fontSize: '0.78rem', textTransform: 'capitalize', fontWeight: 600 }}>{c.user?.role}</td>
                    <td><span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize', color: c.priority === 'urgent' ? 'var(--danger)' : 'var(--dark)' }}>{c.priority}</span></td>
                    <td>{statusBadge(c.status)}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button onClick={() => { setSelected(c); setStatus(c.status); setAdminNote(c.adminNote || ''); }} style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', color: 'var(--primary)', borderRadius: 6, padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={() => setSelected(null)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', borderRadius: 'var(--radius-xl)', padding: '32px', zIndex: 1001, width: '90%', maxWidth: 500 }}>
            <h5 style={{ fontWeight: 800, marginBottom: 16 }}>Manage Complaint</h5>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{selected.subject}</p>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: 20, background: 'var(--gray-50)', padding: 12, borderRadius: 8 }}>{selected.description}</p>
            <form onSubmit={handleResolve}>
              <div className="mb-3">
                <label className="form-label-custom">Status</label>
                <select className="form-control-custom" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label-custom">Admin Response / Note</label>
                <textarea className="form-control-custom" rows={3} value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Note for the user..." style={{ resize: 'vertical' }} />
              </div>
              <div className="d-flex gap-3">
                <button type="submit" className="btn-primary-custom flex-fill justify-content-center">Update Complaint</button>
                <button type="button" className="btn-outline-custom" onClick={() => setSelected(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminComplaints;
