import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiHeart, FiShoppingCart, FiStar, FiMapPin } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import API from '../../services/api';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&q=80';

const ProductCard = ({ product, onWishlistToggle, isWishlisted }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }
    if (user.role !== 'buyer') {
      toast.error('Only buyers can add to cart');
      return;
    }
    await addToCart(product._id, 1);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || user.role !== 'buyer') {
      toast.error('Please login as buyer to add to wishlist');
      return;
    }
    if (onWishlistToggle) {
      onWishlistToggle(product._id, isWishlisted);
      return;
    }
    try {
      if (isWishlisted) {
        await API.delete(`/wishlist/${product._id}`);
        toast.success('Removed from wishlist');
      } else {
        await API.post('/wishlist/add', { productId: product._id });
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const imgUrl = product.images?.[0]?.url || PLACEHOLDER;
  const isOutOfStock = product.status === 'out_of_stock' || product.quantity === 0;

  return (
    <div className="product-card">
      <Link to={`/marketplace/${product._id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={imgUrl}
            alt={product.name}
            className="product-card-img"
            onError={e => { e.target.src = PLACEHOLDER; }}
          />
          {/* Badges */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {product.isOrganic && (
              <span className="badge-organic"><FaLeaf /> Organic</span>
            )}
            {isOutOfStock && (
              <span style={{ background: '#fef2f2', color: 'var(--danger)', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>
                Out of Stock
              </span>
            )}
          </div>
          {/* Wishlist btn */}
          <button
            onClick={handleWishlist}
            style={{
              position: 'absolute', top: 10, right: 10,
              width: 32, height: 32, borderRadius: '50%',
              background: isWishlisted ? 'var(--danger)' : 'rgba(255,255,255,0.9)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              color: isWishlisted ? 'white' : 'var(--gray-600)',
            }}
          >
            <FiHeart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="product-card-body">
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              {product.category?.name || 'General'}
            </span>
          </div>
          <h6 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6, color: 'var(--dark)', lineHeight: 1.3 }}>
            {product.name}
          </h6>
          <div className="d-flex align-items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={12}
                fill={i < Math.round(product.ratings) ? 'currentColor' : 'none'}
                className={i < Math.round(product.ratings) ? 'star-filled' : 'star-empty'}
              />
            ))}
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginLeft: 4 }}>
              ({product.numReviews})
            </span>
          </div>
          <div className="d-flex align-items-center gap-1 mb-2">
            <FiMapPin size={12} style={{ color: 'var(--gray-400)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}>{product.location}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
            by <strong style={{ color: 'var(--dark)' }}>{product.farmer?.name}</strong>
          </div>
        </div>
      </Link>

      <div className="product-card-footer d-flex align-items-center justify-content-between">
        <div>
          <div className="price-tag">
            ₹{product.price}
            <span className="unit">/{product.unit}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
            {product.quantity} {product.unit} available
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="btn-primary-custom"
          style={{ padding: '8px 14px', fontSize: '0.82rem', opacity: isOutOfStock ? 0.6 : 1 }}
        >
          <FiShoppingCart size={14} />
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
