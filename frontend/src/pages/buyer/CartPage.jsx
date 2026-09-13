import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import Loading from '../../components/common/Loading';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=100&q=60';

const CartPage = () => {
  const { cart, cartLoading, updateQuantity, removeFromCart } = useCart();
  const { items, totalPrice } = cart;

  if (cartLoading && items.length === 0) return <Loading />;

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24 }}>Shopping Cart ({items.length} items)</h1>

      {items.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '60px 20px', textAlign: 'center', border: '1px solid var(--gray-200)' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: 16 }}>🛒</span>
          <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Your cart is empty</h4>
          <p style={{ color: 'var(--gray-600)', marginBottom: 24 }}>Browse our marketplace and add fresh products</p>
          <Link to="/marketplace" className="btn-primary-custom" style={{ padding: '12px 28px' }}>
            <FiShoppingBag /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Items */}
          <div className="col-lg-8">
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
              {items.map((item, i) => (
                <div key={item.product._id} style={{ padding: '20px', borderBottom: i < items.length - 1 ? '1px solid var(--gray-100)' : 'none', display: 'flex', gap: 16, alignItems: 'center' }}>
                  <img
                    src={item.product.images?.[0]?.url || PLACEHOLDER}
                    alt={item.product.name}
                    style={{ width: 80, height: 80, borderRadius: 'var(--radius)', objectFit: 'cover', flexShrink: 0 }}
                    onError={e => { e.target.src = PLACEHOLDER; }}
                  />
                  <div style={{ flex: 1 }}>
                    <Link to={`/marketplace/${item.product._id}`} style={{ fontWeight: 700, color: 'var(--dark)', textDecoration: 'none', display: 'block', marginBottom: 4 }}>
                      {item.product.name}
                    </Link>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginBottom: 8 }}>
                      by {item.product.farmer?.name} • {item.product.location}
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--primary-dark)', fontSize: '1.05rem' }}>
                      ₹{item.price}<span style={{ fontSize: '0.8rem', color: 'var(--gray-600)', fontWeight: 500 }}>/{item.product.unit}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--gray-200)', borderRadius: 8, overflow: 'hidden' }}>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} style={{ width: 32, height: 36, border: 'none', background: 'var(--gray-50)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiMinus size={13} />
                      </button>
                      <span style={{ width: 40, textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} style={{ width: 32, height: 36, border: 'none', background: 'var(--gray-50)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiPlus size={13} />
                      </button>
                    </div>
                    <div style={{ fontWeight: 800, minWidth: 70, textAlign: 'right' }}>₹{item.price * item.quantity}</div>
                    <button onClick={() => removeFromCart(item.product._id)} style={{ background: '#fef2f2', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '24px', position: 'sticky', top: 20 }}>
              <h5 style={{ fontWeight: 800, marginBottom: 20 }}>Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>Subtotal ({items.length} items)</span>
                <span style={{ fontWeight: 600 }}>₹{totalPrice}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>Delivery</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Free</span>
              </div>
              <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 16, marginTop: 16 }}>
                <div className="d-flex justify-content-between mb-4">
                  <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary-dark)' }}>₹{totalPrice}</span>
                </div>
                <Link to="/buyer/checkout" className="btn-primary-custom w-100 justify-content-center" style={{ padding: '13px' }}>
                  Proceed to Checkout
                </Link>
                <Link to="/marketplace" className="btn-outline-custom w-100 justify-content-center mt-2" style={{ padding: '11px' }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
