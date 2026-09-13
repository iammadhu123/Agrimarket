import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../../services/api';
import ProductCard from '../../components/products/ProductCard';
import Loading from '../../components/common/Loading';
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

const UNITS = ['kg', 'gram', 'litre', 'piece', 'dozen', 'quintal', 'ton', 'bundle', 'ml'];
const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'ratings_desc', label: 'Best Rated' },
];

const MarketplacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    location: '',
    isOrganic: '',
    sort: 'createdAt_desc',
    page: 1,
  });

  useEffect(() => {
    API.get('/categories?active=true').then(r => setCategories(r.data.categories || []));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [sortBy, sortOrder] = filters.sort.split('_');
      const params = new URLSearchParams({
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.location && { location: filters.location }),
        ...(filters.isOrganic && { isOrganic: filters.isOrganic }),
        sortBy, sortOrder,
        page: filters.page,
        limit: 12,
      });
      const { data } = await API.get(`/products?${params}`);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', location: '', isOrganic: '', sort: 'createdAt_desc', page: 1 });
  };

  const FilterPanel = () => (
    <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700 }}>Filters</span>
        <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Reset All</button>
      </div>

      {/* Category */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--gray-100)' }}>
        <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 10 }}>Category</p>
        <button
          onClick={() => setFilters(f => ({ ...f, category: '', page: 1 }))}
          className="category-pill mb-2"
          style={{ background: !filters.category ? 'var(--primary)' : 'white', color: !filters.category ? 'white' : 'var(--dark-700)', border: !filters.category ? 'none' : '1.5px solid var(--gray-200)', marginRight: 6 }}
        >All</button>
        {categories.map(c => (
          <button
            key={c._id}
            onClick={() => setFilters(f => ({ ...f, category: c._id, page: 1 }))}
            className="category-pill mb-2"
            style={{ marginRight: 6, background: filters.category === c._id ? 'var(--primary)' : 'white', color: filters.category === c._id ? 'white' : 'var(--dark-700)', border: filters.category === c._id ? 'none' : '1.5px solid var(--gray-200)' }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Price Range */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--gray-100)' }}>
        <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 10 }}>Price Range (₹)</p>
        <div className="d-flex gap-2">
          <input type="number" className="form-control-custom" placeholder="Min" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value, page: 1 }))} />
          <input type="number" className="form-control-custom" placeholder="Max" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value, page: 1 }))} />
        </div>
      </div>

      {/* Location */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--gray-100)' }}>
        <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 10 }}>Location</p>
        <input type="text" className="form-control-custom" placeholder="e.g. Punjab, Maharashtra" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value, page: 1 }))} />
      </div>

      {/* Organic */}
      <div style={{ padding: '16px' }}>
        <button
          onClick={() => setFilters(f => ({ ...f, isOrganic: f.isOrganic === 'true' ? '' : 'true', page: 1 }))}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
            cursor: 'pointer', color: filters.isOrganic === 'true' ? 'var(--primary)' : 'var(--dark)',
            fontWeight: 600, fontSize: '0.9rem',
          }}
        >
          <FaLeaf color={filters.isOrganic === 'true' ? 'var(--primary)' : 'var(--gray-400)'} />
          Organic Products Only
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f3d1f 0%, #1a6b35 100%)', padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2.25rem)', marginBottom: 8 }}>
            Agricultural Marketplace
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>
            {total} fresh products from verified farmers
          </p>
          {/* Search */}
          <form onSubmit={handleSearch} style={{ maxWidth: 580 }}>
            <div style={{ display: 'flex', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
                <FiSearch style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search products, farmers, locations..."
                  value={filters.search}
                  onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', padding: '14px 0', background: 'transparent' }}
                />
                {filters.search && (
                  <button type="button" onClick={() => setFilters(f => ({ ...f, search: '', page: 1 }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                    <FiX />
                  </button>
                )}
              </div>
              <button type="submit" className="btn-primary-custom" style={{ borderRadius: '0 12px 12px 0', padding: '14px 24px' }}>Search</button>
            </div>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 12px' }}>
        <div className="row g-4">
          {/* Desktop Filters */}
          <div className="col-lg-3 d-none d-lg-block">
            <FilterPanel />
          </div>

          {/* Products Grid */}
          <div className="col-lg-9">
            {/* Sort + Filter bar */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <div>
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  Showing <strong>{products.length}</strong> of <strong>{total}</strong> products
                </span>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <button
                  className="d-lg-none btn-outline-custom"
                  style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                  onClick={() => setShowFilters(true)}
                >
                  <FiFilter /> Filters
                </button>
                <select
                  value={filters.sort}
                  onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 1 }))}
                  className="form-control-custom"
                  style={{ width: 'auto', fontSize: '0.85rem' }}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">🌱</span>
                <h4>No products found</h4>
                <p>Try adjusting your search or filters</p>
                <button onClick={resetFilters} className="btn-primary-custom mt-3">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {products.map(p => (
                    <div key={p._id} className="col-sm-6 col-xl-4">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="pagination-custom mt-5">
                    <button className="page-btn" onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} disabled={filters.page === 1}>
                      <FiChevronLeft />
                    </button>
                    {[...Array(pages)].map((_, i) => (
                      <button
                        key={i}
                        className={`page-btn ${filters.page === i + 1 ? 'active' : ''}`}
                        onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button className="page-btn" onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} disabled={filters.page === pages}>
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={() => setShowFilters(false)} />
          <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 300, background: 'white', zIndex: 1001, overflowY: 'auto', padding: 20 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ margin: 0, fontWeight: 700 }}>Filters</h5>
              <button onClick={() => setShowFilters(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>
            <FilterPanel />
            <button className="btn-primary-custom w-100 justify-content-center mt-4" onClick={() => setShowFilters(false)}>
              Apply Filters ({total} results)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MarketplacePage;
