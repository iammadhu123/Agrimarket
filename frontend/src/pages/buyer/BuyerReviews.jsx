import { useState, useEffect } from 'react';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiStar, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BuyerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/reviews/my-reviews')
      .then(r => setReviews(r.data.reviews || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await API.delete(`/reviews/${id}`);
      setReviews(prev => prev.filter(r => r._id !== id));
      toast.success('Review deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24 }}>My Reviews</h1>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        {loading ? <Loading /> : reviews.length === 0 ? (
          <div className="empty-state"><span className="empty-state-icon">⭐</span><h4>No reviews yet</h4><p>Review products you've purchased</p></div>
        ) : reviews.map(r => (
          <div key={r._id} style={{ padding: '20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', gap: 16 }}>
            <img src={r.product?.images?.[0]?.url || ''} alt="" style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: 'var(--gray-100)', flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{r.product?.name}</div>
              <div className="d-flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={14} fill={i < r.rating ? 'currentColor' : 'none'} className={i < r.rating ? 'star-filled' : 'star-empty'} />
                ))}
                <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginLeft: 4 }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>{r.comment}</p>
            </div>
            <button onClick={() => deleteReview(r._id)} style={{ background: '#fef2f2', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', flexShrink: 0 }}>
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerReviews;
