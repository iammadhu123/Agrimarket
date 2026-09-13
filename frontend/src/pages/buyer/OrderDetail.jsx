import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiArrowLeft, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ productId: null, rating: 5, comment: '' });
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(r => setOrder(r.data.order))
      .catch(() => toast.error('Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await API.put(`/orders/${id}/cancel`);
      toast.success('Order cancelled');
      setOrder(prev => ({ ...prev, status: 'cancelled' }));
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await API.post('/reviews', { product: reviewForm.productId, rating: reviewForm.rating, comment: reviewForm.comment, order: id });
      toast.success('Review submitted!');
      setShowReviewModal(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review'); }
  };

  if (loading) return <Loading />;
  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/buyer/orders" style={{ background: 'var(--gray-100)', border: 'none', width: 36, height: 36, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'var(--dark)' }}>
          <FiArrowLeft />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Order #{id.slice(-6).toUpperCase()}</h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.8rem' }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        {['pending', 'confirmed'].includes(order.status) && (
          <button onClick={handleCancelOrder} style={{ marginLeft: 'auto', background: 'none', border: '1.5px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', padding: '6px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
            Cancel Order
          </button>
        )}
      </div>

      {/* Status Timeline */}
      {!isCancelled && (
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '24px', marginBottom: 20 }}>
          <h6 style={{ fontWeight: 700, marginBottom: 20 }}>Order Status</h6>
          <div className="order-timeline">
            {STATUS_STEPS.map((step, i) => (
              <>
                <div key={step} className="timeline-step">
                  <div className={`timeline-dot ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <div className="timeline-label" style={{ color: i <= currentStep ? 'var(--primary)' : 'var(--gray-400)', fontWeight: i === currentStep ? 700 : 400 }}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </div>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`timeline-line ${i < currentStep ? 'done' : ''}`} key={`line-${i}`} />
                )}
              </>
            ))}
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-7">
          {/* Order Items */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
              <h6 style={{ margin: 0, fontWeight: 700 }}>Ordered Items</h6>
            </div>
            {order.items?.map(item => (
              <div key={item.product} style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ color: 'var(--gray-600)', fontSize: '0.8rem' }}>Qty: {item.quantity} × ₹{item.price}</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>₹{item.quantity * item.price}</div>
                {order.status === 'delivered' && (
                  <button
                    onClick={() => { setReviewForm({ productId: item.product, rating: 5, comment: '' }); setShowReviewModal(true); }}
                    style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', color: 'var(--primary)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <FiStar size={12} /> Review
                  </button>
                )}
              </div>
            ))}
            <div style={{ padding: '16px 20px', background: 'var(--gray-50)' }}>
              <div className="d-flex justify-content-between">
                <span style={{ fontWeight: 800 }}>Total</span>
                <span style={{ fontWeight: 800, color: 'var(--primary-dark)', fontSize: '1.1rem' }}>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          {/* Shipping Info */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '20px', marginBottom: 16 }}>
            <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Shipping Address</h6>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>
              <strong>{order.shippingAddress?.name}</strong><br />
              {order.shippingAddress?.phone}<br />
              {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
              {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
            </p>
          </div>

          {/* Payment Info */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '20px' }}>
            <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Payment Info</h6>
            <div className="d-flex justify-content-between mb-2">
              <span style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Method</span>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>{order.paymentMethod}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Status</span>
              <span style={{ color: order.paymentStatus === 'paid' ? 'var(--primary)' : 'var(--warning)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'capitalize' }}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={() => setShowReviewModal(false)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', borderRadius: 'var(--radius-xl)', padding: '32px', zIndex: 1001, width: '90%', maxWidth: 440 }}>
            <h5 style={{ fontWeight: 800, marginBottom: 20 }}>Write a Review</h5>
            <form onSubmit={handleReview}>
              <div className="mb-3">
                <label className="form-label-custom">Rating</label>
                <div className="d-flex gap-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button key={r} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: r })}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: r <= reviewForm.rating ? 'var(--warning)' : 'var(--gray-300)', transition: 'all 0.2s' }}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label-custom">Comment *</label>
                <textarea className="form-control-custom" rows={4} value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} required placeholder="Share your experience..." style={{ resize: 'vertical' }} />
              </div>
              <div className="d-flex gap-3">
                <button type="submit" className="btn-primary-custom flex-fill justify-content-center">Submit Review</button>
                <button type="button" className="btn-outline-custom" onClick={() => setShowReviewModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderDetail;
