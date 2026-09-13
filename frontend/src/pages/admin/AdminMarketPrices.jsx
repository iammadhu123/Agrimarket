import { useState, useEffect } from 'react';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminMarketPrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ cropName: '', marketName: '', location: '', minPrice: '', maxPrice: '', avgPrice: '', unit: 'quintal', date: new Date().toISOString().split('T')[0] });

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/market-prices?limit=100');
      setPrices(data.prices || []);
    } catch { toast.error('Failed to load prices'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPrices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/market-prices/${editId}`, form);
        toast.success('Market price updated');
      } else {
        await API.post('/market-prices', form);
        toast.success('Market price added');
      }
      setShowModal(false);
      setEditId(null);
      setForm({ cropName: '', marketName: '', location: '', minPrice: '', maxPrice: '', avgPrice: '', unit: 'quintal', date: new Date().toISOString().split('T')[0] });
      fetchPrices();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
  };

  const handleEdit = (p) => {
    setForm({ cropName: p.cropName, marketName: p.marketName, location: p.location, minPrice: p.minPrice, maxPrice: p.maxPrice, avgPrice: p.avgPrice, unit: p.unit, date: p.date?.split('T')[0] });
    setEditId(p._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this price entry?')) return;
    try {
      await API.delete(`/market-prices/${id}`);
      toast.success('Price deleted');
      fetchPrices();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>Mandi Price Management</h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.875rem' }}>Update daily crop market rates</p>
        </div>
        <button className="btn-primary-custom" onClick={() => { setShowModal(true); setEditId(null); setForm({ cropName: '', marketName: '', location: '', minPrice: '', maxPrice: '', avgPrice: '', unit: 'quintal', date: new Date().toISOString().split('T')[0] }); }}>
          <FiPlus /> Add Market Price
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        {loading ? <Loading /> : prices.length === 0 ? (
          <div className="empty-state"><h4>No market prices entered</h4></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead><tr><th>Crop</th><th>Market</th><th>Location</th><th>Min</th><th>Max</th><th>Avg</th><th>Unit</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {prices.map(p => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 700 }}>🌾 {p.cropName}</td>
                    <td style={{ fontSize: '0.85rem' }}>{p.marketName}</td>
                    <td style={{ fontSize: '0.85rem' }}>{p.location}</td>
                    <td style={{ color: 'var(--danger)', fontWeight: 600 }}>₹{p.minPrice}</td>
                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{p.maxPrice}</td>
                    <td style={{ fontWeight: 800 }}>₹{p.avgPrice}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>per {p.unit}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{new Date(p.date).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button onClick={() => handleEdit(p)} style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', width: 30, height: 30, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><FiEdit2 size={13} /></button>
                        <button onClick={() => handleDelete(p._id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', width: 30, height: 30, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><FiTrash2 size={13} /></button>
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
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', borderRadius: 'var(--radius-xl)', padding: '32px', zIndex: 1001, width: '90%', maxWidth: 500 }}>
            <h5 style={{ fontWeight: 800, marginBottom: 20 }}>{editId ? 'Edit Market Price' : 'Add Market Price'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-custom">Crop Name *</label>
                  <input type="text" className="form-control-custom" placeholder="e.g. Wheat" value={form.cropName} onChange={e => setForm({ ...form, cropName: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Market Name *</label>
                  <input type="text" className="form-control-custom" placeholder="e.g. Azadpur Mandi" value={form.marketName} onChange={e => setForm({ ...form, marketName: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Location *</label>
                  <input type="text" className="form-control-custom" placeholder="e.g. Delhi" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Unit *</label>
                  <input type="text" className="form-control-custom" placeholder="quintal / kg" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Min Price *</label>
                  <input type="number" className="form-control-custom" value={form.minPrice} onChange={e => setForm({ ...form, minPrice: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Max Price *</label>
                  <input type="number" className="form-control-custom" value={form.maxPrice} onChange={e => setForm({ ...form, maxPrice: e.target.value })} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Avg Price *</label>
                  <input type="number" className="form-control-custom" value={form.avgPrice} onChange={e => setForm({ ...form, avgPrice: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Date *</label>
                  <input type="date" className="form-control-custom" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
              </div>
              <div className="d-flex gap-3 mt-4">
                <button type="submit" className="btn-primary-custom flex-fill justify-content-center">{editId ? 'Save' : 'Add Price'}</button>
                <button type="button" className="btn-outline-custom" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminMarketPrices;
