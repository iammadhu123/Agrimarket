import { useState, useEffect } from 'react';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', isActive: true });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/categories/admin/all');
      setCategories(data.categories || []);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/categories/${editId}`, form);
        toast.success('Category updated');
      } else {
        await API.post('/categories', form);
        toast.success('Category created');
      }
      setShowModal(false);
      setEditId(null);
      setForm({ name: '', description: '', isActive: true });
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '', isActive: cat.isActive });
    setEditId(cat._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>Categories Management</h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.875rem' }}>{categories.length} product categories</p>
        </div>
        <button className="btn-primary-custom" onClick={() => { setShowModal(true); setEditId(null); setForm({ name: '', description: '', isActive: true }); }}>
          <FiPlus /> Add Category
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        {loading ? <Loading /> : categories.length === 0 ? (
          <div className="empty-state"><h4>No categories</h4></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead><tr><th>Name</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 700 }}>{c.name}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{c.description || '—'}</td>
                    <td>
                      <span className={`badge-status badge-${c.isActive ? 'active' : 'cancelled'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button onClick={() => handleEdit(c)} style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', width: 30, height: 30, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                          <FiEdit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(c._id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', width: 30, height: 30, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={() => setShowModal(false)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', borderRadius: 'var(--radius-xl)', padding: '32px', zIndex: 1001, width: '90%', maxWidth: 440 }}>
            <h5 style={{ fontWeight: 800, marginBottom: 20 }}>{editId ? 'Edit Category' : 'Add Category'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label-custom">Category Name *</label>
                <input type="text" className="form-control-custom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label-custom">Description</label>
                <textarea className="form-control-custom" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div className="mb-4">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Active</span>
                </label>
              </div>
              <div className="d-flex gap-3">
                <button type="submit" className="btn-primary-custom flex-fill justify-content-center">{editId ? 'Save' : 'Create'}</button>
                <button type="button" className="btn-outline-custom" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCategories;
