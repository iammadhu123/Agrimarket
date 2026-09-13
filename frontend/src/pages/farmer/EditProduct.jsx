import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiArrowLeft, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const UNITS = ['kg', 'gram', 'litre', 'ml', 'piece', 'dozen', 'quintal', 'ton', 'bundle'];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [form, setForm] = useState({
    name: '', category: '', description: '', price: '', quantity: '',
    unit: 'kg', location: '', harvestDate: '', isOrganic: false, status: 'active',
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get(`/products/${id}`),
          API.get('/categories?active=true'),
        ]);
        const p = prodRes.data.product;
        setForm({
          name: p.name, category: p.category?._id || '', description: p.description,
          price: p.price, quantity: p.quantity, unit: p.unit, location: p.location,
          harvestDate: p.harvestDate ? p.harvestDate.split('T')[0] : '',
          isOrganic: p.isOrganic, status: p.status,
        });
        setExistingImages(p.images || []);
        setCategories(catRes.data.categories || []);
      } catch { toast.error('Failed to load product'); navigate('/farmer/products'); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [id]);

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length + newImages.length > 5) { toast.error('Max 5 images'); return; }
    setNewImages(prev => [...prev, ...files]);
    setNewPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeExistingImage = async (imgId) => {
    try {
      await API.delete(`/products/${id}/image/${imgId}`);
      setExistingImages(prev => prev.filter(img => img._id !== imgId));
      toast.success('Image removed');
    } catch { toast.error('Failed to remove image'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      newImages.forEach(img => fd.append('images', img));
      await API.put(`/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product updated successfully!');
      navigate('/farmer/products');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} style={{ background: 'var(--gray-100)', border: 'none', width: 36, height: 36, borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiArrowLeft />
        </button>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-7">
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px', marginBottom: 16 }}>
              <h5 style={{ fontWeight: 700, marginBottom: 20 }}>Product Information</h5>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label-custom">Product Name *</label>
                  <input type="text" className="form-control-custom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Category *</label>
                  <select className="form-control-custom" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Location *</label>
                  <input type="text" className="form-control-custom" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Description *</label>
                  <textarea className="form-control-custom" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px' }}>
              <h5 style={{ fontWeight: 700, marginBottom: 20 }}>Pricing & Inventory</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label-custom">Price (₹)</label>
                  <input type="number" className="form-control-custom" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Quantity</label>
                  <input type="number" className="form-control-custom" min="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Unit</label>
                  <select className="form-control-custom" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Harvest Date</label>
                  <input type="date" className="form-control-custom" value={form.harvestDate} onChange={e => setForm({ ...form, harvestDate: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Status</label>
                  <select className="form-control-custom" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div className="col-12">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isOrganic} onChange={e => setForm({ ...form, isOrganic: e.target.checked })} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
                    <span style={{ fontWeight: 600 }}>🌿 Organic Product</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px' }}>
              <h5 style={{ fontWeight: 700, marginBottom: 16 }}>Product Images</h5>

              {existingImages.length > 0 && (
                <div className="mb-3">
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginBottom: 8 }}>Current Images</p>
                  <div className="row g-2">
                    {existingImages.map((img) => (
                      <div key={img._id} className="col-4" style={{ position: 'relative' }}>
                        <img src={img.url} alt="" style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8, border: '2px solid var(--gray-200)' }} />
                        <button type="button" onClick={() => removeExistingImage(img._id)} style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, borderRadius: '50%', background: 'var(--danger)', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiX size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--gray-200)', borderRadius: 'var(--radius)', padding: '24px', cursor: 'pointer', background: 'var(--gray-50)' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-600)' }}>+ Add more images</span>
                <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleNewImages} />
              </label>

              {newPreviews.length > 0 && (
                <div className="row g-2 mt-2">
                  {newPreviews.map((src, i) => (
                    <div key={i} className="col-4">
                      <img src={src} alt="" style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8, border: '2px solid var(--primary-100)' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex gap-3 mt-4">
          <button type="submit" className="btn-primary-custom" style={{ padding: '12px 32px' }} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
          <button type="button" className="btn-outline-custom" style={{ padding: '12px 24px' }} onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
