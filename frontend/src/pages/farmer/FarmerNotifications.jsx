import { useState, useEffect } from 'react';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiBell, FiCheck, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/notifications?limit=50');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id) => {
    await API.put(`/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await API.put('/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast.success('All marked as read');
  };

  const deleteNotification = async (id) => {
    await API.delete(`/notifications/${id}`);
    setNotifications(prev => prev.filter(n => n._id !== id));
  };

  const typeIcon = { order: '📦', product: '🌱', account: '👤', payment: '💳', complaint: '📝', general: '📢' };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>Notifications</h1>
          {unreadCount > 0 && <span style={{ background: 'var(--primary)', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '50px' }}>{unreadCount} unread</span>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-outline-custom" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
            <FiCheck /> Mark All Read
          </button>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        {loading ? <Loading /> : notifications.length === 0 ? (
          <div className="empty-state"><span className="empty-state-icon"><FiBell /></span><h4>No notifications</h4></div>
        ) : notifications.map(n => (
          <div key={n._id} style={{
            padding: '16px 20px', borderBottom: '1px solid var(--gray-100)',
            background: n.isRead ? 'white' : 'var(--primary-50)',
            display: 'flex', alignItems: 'flex-start', gap: 12, transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{typeIcon[n.type] || '📢'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: n.isRead ? 500 : 700, fontSize: '0.9rem', marginBottom: 2 }}>{n.title}</div>
              <div style={{ color: 'var(--gray-600)', fontSize: '0.82rem', lineHeight: 1.5 }}>{n.message}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 4 }}>
                {new Date(n.createdAt).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="d-flex gap-2 flex-shrink-0">
              {!n.isRead && (
                <button onClick={() => markRead(n._id)} style={{ background: 'var(--primary-100)', border: 'none', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <FiCheck size={13} />
                </button>
              )}
              <button onClick={() => deleteNotification(n._id)} style={{ background: '#fef2f2', border: 'none', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
                <FiTrash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
