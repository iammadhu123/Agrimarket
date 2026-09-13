import { useState, useEffect } from 'react';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100, ...(search && { search }) });
      const { data } = await API.get(`/products/admin/all?${params}`);
      setProducts(data.products || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product from marketplace?')) return;
    try {
      await API.delete(`/products/admin/${id}`);
      toast.success('Product removed');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>Product Moderation</h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.875rem' }}>{products.length} products listed</p>
        </div>
      </div>

      <div className="search-bar mb-4" style={{ maxWidth: 400 }}>
        <FiSearch style={{ color: 'var(--gray-400)' }} />
        <input type="text" placeholder="Search products, farmers..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        {loading ? <Loading /> : products.length === 0 ? (
          <div className="empty-state"><h4>No products found</h4></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead><tr><th>Product</th><th>Farmer</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={p.images?.[0]?.url || ''} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', background: 'var(--gray-100)' }} onError={e => e.target.style.display = 'none'} />
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{p.farmer?.name}</td>
                    <td style={{ fontSize: '0.85rem' }}>{p.category?.name}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{p.price}/{p.unit}</td>
                    <td style={{ fontSize: '0.85rem' }}>{p.quantity} {p.unit}</td>
                    <td>
                      <span className={`badge-status badge-${p.status === 'active' ? 'active' : 'cancelled'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(p._id)} style={{ background: '#fef2f2', border: 'none', width: 30, height: 30, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
                        <FiTrash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
