import { useState, useEffect } from 'react';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiSearch, FiUserCheck, FiUserX, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100, ...(roleFilter !== 'all' && { role: roleFilter }), ...(search && { search }) });
      const { data } = await API.get(`/users?${params}`);
      setUsers(data.users || []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [roleFilter, search]);

  const handleToggleStatus = async (user) => {
    try {
      await API.put(`/users/${user._id}/status`, { isActive: !user.isActive });
      toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch { toast.error('Action failed'); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>User Management</h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.875rem' }}>{users.length} registered users</p>
        </div>
        <div className="d-flex gap-2">
          {['all', 'farmer', 'buyer', 'admin'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} style={{
              padding: '6px 14px', borderRadius: '50px', border: '1.5px solid var(--gray-200)',
              background: roleFilter === r ? '#7c3aed' : 'white', color: roleFilter === r ? 'white' : 'var(--gray-600)',
              cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize',
            }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="search-bar mb-4" style={{ maxWidth: 400 }}>
        <FiSearch style={{ color: 'var(--gray-400)' }} />
        <input type="text" placeholder="Search users by name, email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        {loading ? <Loading /> : users.length === 0 ? (
          <div className="empty-state"><h4>No users found</h4></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: u.role === 'admin' ? '#7c3aed' : u.role === 'farmer' ? 'var(--primary)' : 'var(--secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                          {u.name?.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{u.name}</div>
                          {u.farmName && <div style={{ fontSize: '0.72rem', color: 'var(--primary)' }}>🌾 {u.farmName}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '50px', textTransform: 'capitalize', background: u.role === 'admin' ? '#f5f3ff' : u.role === 'farmer' ? 'var(--primary-100)' : '#fff7ed', color: u.role === 'admin' ? '#7c3aed' : u.role === 'farmer' ? 'var(--primary-dark)' : 'var(--secondary)' }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status badge-${u.isActive ? 'active' : 'cancelled'}`}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button onClick={() => handleToggleStatus(u)} style={{ background: u.isActive ? '#fff7ed' : 'var(--primary-50)', border: 'none', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, color: u.isActive ? 'var(--secondary)' : 'var(--primary)' }}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        {u.role !== 'admin' && (
                          <button onClick={() => handleDeleteUser(u._id)} style={{ background: '#fef2f2', border: 'none', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
                            <FiTrash2 size={13} />
                          </button>
                        )}
                      </div>
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

export default AdminUsers;
