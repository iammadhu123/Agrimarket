import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=100&q=60';

const FarmerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10, ...(statusFilter !== 'all' && { status: statusFilter }) });
      const { data } = await API.get(`/products/my-products?${params}`);
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
    setDeleteId(null);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const statusBadge = (status) => {
    const map = { active: 'active', out_of_stock: 'cancelled', inactive: 'pending' };
    return <span className={`badge-status badge-${map[status] || 'pending'}`}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>My Products</h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.875rem' }}>{total} products listed</p>
        </div>
        <Link to="/farmer/products/add" className="btn-primary-custom"><FiPlus /> Add New Product</Link>
      </div>

      {/* Filters */}
      <div className="d-flex gap-3 mb-4 flex-wrap">
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <FiSearch style={{ color: 'var(--gray-400)' }} />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="form-control-custom" style={{ width: 'auto' }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        {loading ? <Loading /> : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon"><FiPackage /></span>
            <h4>No products found</h4>
            <p>Start listing your agricultural products</p>
            <Link to="/farmer/products/add" className="btn-primary-custom mt-3"><FiPlus /> Add First Product</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Ratings</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={p.images?.[0]?.url || PLACEHOLDER}
                          alt={p.name}
                          style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          onError={e => { e.target.src = PLACEHOLDER; }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{p.name}</div>
                          {p.isOrganic && <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>🌿 Organic</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>{p.category?.name || '–'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{p.price}/{p.unit}</td>
                    <td style={{ fontSize: '0.875rem' }}>
                      <span style={{ color: p.quantity === 0 ? 'var(--danger)' : p.quantity < 20 ? 'var(--warning)' : 'var(--dark)' }}>
                        {p.quantity} {p.unit}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>⭐ {p.ratings?.toFixed(1)} ({p.numReviews})</td>
                    <td>{statusBadge(p.status)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/farmer/products/edit/${p._id}`} style={{
                          width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--primary-50)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                          textDecoration: 'none', border: '1px solid var(--primary-100)',
                        }}>
                          <FiEdit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(p._id)} style={{
                          width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: '#fef2f2',
                          border: '1px solid #fecaca', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)',
                        }}>
                          <FiTrash2 size={14} />
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

      {/* Pagination */}
      {total > 10 && (
        <div className="pagination-custom">
          {[...Array(Math.ceil(total / 10))].map((_, i) => (
            <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerProducts;
