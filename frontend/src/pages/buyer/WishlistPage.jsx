import { useState, useEffect } from 'react';
import API from '../../services/api';
import ProductCard from '../../components/products/ProductCard';
import Loading from '../../components/common/Loading';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/wishlist');
      setProducts(data.wishlist?.products || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleWishlistToggle = async (productId, isWishlisted) => {
    try {
      if (isWishlisted) {
        await API.delete(`/wishlist/${productId}`);
        setProducts(prev => prev.filter(p => p._id !== productId));
        toast.success('Removed from wishlist');
      }
    } catch { toast.error('Action failed'); }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24 }}>My Wishlist ({products.length} items)</h1>

      {loading ? <Loading /> : products.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '60px 20px', textAlign: 'center', border: '1px solid var(--gray-200)' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: 16 }}>❤️</span>
          <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Your wishlist is empty</h4>
          <p style={{ color: 'var(--gray-600)', marginBottom: 24 }}>Save products you love to buy later</p>
          <Link to="/marketplace" className="btn-primary-custom" style={{ padding: '12px 28px' }}>Browse Marketplace</Link>
        </div>
      ) : (
        <div className="row g-4">
          {products.map(p => (
            <div key={p._id} className="col-sm-6 col-lg-4">
              <ProductCard product={p} isWishlisted onWishlistToggle={handleWishlistToggle} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
