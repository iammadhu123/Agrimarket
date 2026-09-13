import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { FiUpload, FiX, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const UNITS = ['kg', 'gram', 'litre', 'ml', 'piece', 'dozen', 'quintal', 'ton', 'bundle'];

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    name: '', category: '', description: '', price: '', quantity: '',
    unit: 'kg', location: '', harvestDate: '', isOrganic: false, status: 'active',
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    API.get('/categories?active=true').then(r => setCategories(r.data.categories || []));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) { toast.error('Maximum 5 images allowed'); return; }
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (i) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) { toast.error('Please select a category'); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));

      await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product listed successfully!');
      navigate('/farmer/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} style={{ background: 'var(--gray-100)', border: 'none', width: 36, height: 36, borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiArrowLeft />
        </button>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Add New Product</h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.875rem' }}>List a new agricultural product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-lg-7">
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px', marginBottom: 16 }}>
              <h5 style={{ fontWeight: 700, marginBottom: 24 }}>Product Information</h5>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label-custom">Product Name *</label>
                  <input type="text" className="form-control-custom" placeholder="e.g. Fresh Tomatoes" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
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
                  <input type="text" className="form-control-custom" placeholder="e.g. Pune, Maharashtra" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Description *</label>
                  <textarea className="form-control-custom" rows={4} placeholder="Describe your product, quality, farming method..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px' }}>
              <h5 style={{ fontWeight: 700, marginBottom: 24 }}>Pricing & Inventory</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label-custom">Price (₹) *</label>
                  <input type="number" className="form-control-custom" placeholder="0.00" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Quantity *</label>
                  <input type="number" className="form-control-custom" placeholder="0" min="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Unit *</label>
                  <select className="form-control-custom" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Harvest Date</label>
                  <input type="date" className="form-control-custom" value={form.harvestDate} onChange={e => setForm({ ...form, harvestDate: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Availability Status</label>
                  <select className="form-control-custom" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-12">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isOrganic} onChange={e => setForm({ ...form, isOrganic: e.target.checked })} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>🌿 Organic Product</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}>Check if this product is grown organically without pesticides</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="col-lg-5">
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px', position: 'sticky', top: 20 }}>
              <h5 style={{ fontWeight: 700, marginBottom: 20 }}>Product Images</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginBottom: 16 }}>Upload up to 5 high quality images</p>

              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '2px dashed var(--gray-200)', borderRadius: 'var(--radius)', padding: '32px',
                cursor: 'pointer', background: 'var(--gray-50)', transition: 'all 0.2s', marginBottom: 16,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-50)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.background = 'var(--gray-50)'; }}
              >
                <FiUpload size={28} style={{ color: 'var(--primary)', marginBottom: 8 }} />
                <span style={{ fontWeight: 600, color: 'var(--dark)', fontSize: '0.9rem' }}>Click to upload images</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 4 }}>JPG, PNG, WebP — Max 5MB each</span>
                <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              </label>

              {previews.length > 0 && (
                <div className="row g-2">
                  {previews.map((src, i) => (
                    <div key={i} className="col-4" style={{ position: 'relative' }}>
                      <img src={src} alt="" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8, border: '2px solid var(--gray-200)' }} />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        style={{
                          position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%',
                          background: 'var(--danger)', border: 'none', cursor: 'pointer', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem',
                        }}
                      >
                        <FiX size={10} />
                      </button>
                      {i === 0 && (
                        <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'var(--primary)', color: 'white', fontSize: '0.6rem', padding: '1px 6px', borderRadius: '3px', fontWeight: 700 }}>Main</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex gap-3 mt-4">
          <button type="submit" className="btn-primary-custom" style={{ padding: '12px 32px' }} disabled={loading}>
            {loading ? 'Listing Product...' : '✅ List Product'}
          </button>
          <button type="button" className="btn-outline-custom" style={{ padding: '12px 24px' }} onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
