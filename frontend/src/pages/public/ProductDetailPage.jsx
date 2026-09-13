import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiStar, FiMapPin, FiPackage, FiShoppingCart, FiHeart, FiArrowLeft, FiUser } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
        setReviews(data.reviews || []);
      } catch {
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login to add to cart'); return; }
    if (user.role !== 'buyer') { toast.error('Only buyers can add to cart'); return; }
    await addToCart(product._id, quantity);
  };

  const handleBuyNow = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    if (user.role !== 'buyer') { toast.error('Only buyers can purchase'); return; }
    const ok = await addToCart(product._id, quantity);
    if (ok) navigate('/buyer/checkout');
  };

  const handleWishlist = async () => {
    if (!user || user.role !== 'buyer') { toast.error('Please login as buyer'); return; }
    try {
      if (isWishlisted) {
        await API.delete(`/wishlist/${product._id}`);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await API.post('/wishlist/add', { productId: product._id });
        setIsWishlisted(true);
        toast.success('Added to wishlist!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return <Loading fullPage />;
  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [{ url: PLACEHOLDER }];
  const isOutOfStock = product.status === 'out_of_stock' || product.quantity === 0;

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '32px 12px' }}>
        {/* Breadcrumb */}
        <div className="d-flex align-items-center gap-2 mb-4">
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-600)', fontSize: '0.875rem' }}>
            <FiArrowLeft /> Back
          </button>
          <span style={{ color: 'var(--gray-400)' }}>/</span>
          <Link to="/marketplace" style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>Marketplace</Link>
          <span style={{ color: 'var(--gray-400)' }}>/</span>
          <span style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>{product.name}</span>
        </div>

        <div className="row g-5">
          {/* Images */}
          <div className="col-lg-5">
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--gray-200)', marginBottom: 12 }}>
              <img
                src={images[activeImg]?.url || PLACEHOLDER}
                alt={product.name}
                style={{ width: '100%', height: 380, objectFit: 'cover' }}
                onError={e => { e.target.src = PLACEHOLDER; }}
              />
            </div>
            {images.length > 1 && (
              <div className="d-flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 72, height: 72, borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                      border: i === activeImg ? '2px solid var(--primary)' : '2px solid var(--gray-200)',
                      padding: 0, cursor: 'pointer',
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = PLACEHOLDER; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="col-lg-7">
            <div className="d-flex gap-2 mb-3 flex-wrap">
              <span style={{ background: 'var(--primary-100)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600 }}>
                {product.category?.name}
              </span>
              {product.isOrganic && <span className="badge-organic"><FaLeaf /> Organic</span>}
              {isOutOfStock && <span style={{ background: '#fef2f2', color: 'var(--danger)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600 }}>Out of Stock</span>}
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 12 }}>{product.name}</h1>

            {/* Rating */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="d-flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={16} fill={i < Math.round(product.ratings) ? 'currentColor' : 'none'} className={i < Math.round(product.ratings) ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                {product.ratings?.toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary-dark)', fontFamily: 'var(--font-display)' }}>₹{product.price}</span>
              <span style={{ fontSize: '0.95rem', color: 'var(--gray-600)', marginLeft: 4 }}>per {product.unit}</span>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: 4 }}>
                Available: <strong>{product.quantity} {product.unit}</strong>
              </div>
            </div>

            <p style={{ color: 'var(--dark-700)', lineHeight: 1.75, marginBottom: 20, fontSize: '0.95rem' }}>
              {product.description}
            </p>

            {/* Details Grid */}
            <div className="row g-3 mb-4">
              {[
                { icon: FiMapPin, label: 'Location', value: product.location },
                { icon: FiPackage, label: 'Unit', value: product.unit },
                { icon: FiUser, label: 'Farmer', value: product.farmer?.name },
                ...(product.harvestDate ? [{ label: '📅 Harvest Date', value: new Date(product.harvestDate).toLocaleDateString('en-IN') }] : []),
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="col-6">
                  <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', padding: '12px', border: '1px solid var(--gray-200)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity & Actions */}
            {!isOutOfStock && user?.role !== 'farmer' && user?.role !== 'admin' && (
              <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 40, height: 44, border: 'none', background: 'var(--gray-50)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }}>-</button>
                  <span style={{ width: 50, textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))} style={{ width: 40, height: 44, border: 'none', background: 'var(--gray-50)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }}>+</button>
                </div>
                <button onClick={handleAddToCart} className="btn-outline-custom" style={{ padding: '12px 24px' }}>
                  <FiShoppingCart /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="btn-primary-custom" style={{ padding: '12px 24px' }}>
                  Buy Now
                </button>
                <button onClick={handleWishlist} style={{
                  width: 44, height: 44, border: '1.5px solid var(--gray-200)', background: isWishlisted ? 'var(--danger)' : 'white',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isWishlisted ? 'white' : 'var(--gray-600)', transition: 'all 0.2s',
                }}>
                  <FiHeart fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>
            )}

            {/* Farmer Info */}
            {product.farmer && (
              <div style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                    {product.farmer.avatar ? <img src={product.farmer.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : product.farmer.name?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{product.farmer.name}</div>
                    {product.farmer.farmName && <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>🌾 {product.farmer.farmName}</div>}
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}><FiMapPin size={12} /> {product.farmer.farmLocation}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', marginTop: 32, overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--gray-100)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Customer Reviews ({reviews.length})</h3>
          </div>
          {reviews.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px' }}>
              <span className="empty-state-icon">⭐</span>
              <h4>No reviews yet</h4>
              <p>Be the first to review this product</p>
            </div>
          ) : (
            <div style={{ padding: '8px 0' }}>
              {reviews.map(r => (
                <div key={r._id} style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-100)' }}>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                      {r.buyer?.name?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.buyer?.name}</div>
                      <div className="d-flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} size={12} fill={i < r.rating ? 'currentColor' : 'none'} className={i < r.rating ? 'star-filled' : 'star-empty'} />
                        ))}
                      </div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                      {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <p style={{ color: 'var(--dark-700)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
