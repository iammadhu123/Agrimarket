import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { FiUser, FiSave, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BuyerProfile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append('avatar', avatar);
      const { data } = await API.put('/users/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await API.put('/auth/update-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password updated successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24 }}>My Profile</h1>

      <div className="row g-4">
        <div className="col-lg-8">
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px', marginBottom: 20 }}>
            <h5 style={{ fontWeight: 700, marginBottom: 24 }}>Personal Details</h5>
            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-custom">Full Name</label>
                  <input type="text" className="form-control-custom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Phone Number</label>
                  <input type="tel" className="form-control-custom" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit number" />
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Bio / Notes</label>
                  <textarea className="form-control-custom" rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." style={{ resize: 'vertical' }} />
                </div>
              </div>
              <button type="submit" className="btn-primary-custom mt-4" disabled={loading}>
                <FiSave /> {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>

          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px' }}>
            <h5 style={{ fontWeight: 700, marginBottom: 24 }}><FiLock /> Change Password</h5>
            <form onSubmit={handleChangePassword}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label-custom">Current Password</label>
                  <input type="password" className="form-control-custom" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} required minLength={6} />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">New Password</label>
                  <input type="password" className="form-control-custom" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={6} />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Confirm New Password</label>
                  <input type="password" className="form-control-custom" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} required minLength={6} />
                </div>
              </div>
              <button type="submit" className="btn-outline-custom mt-4">Update Password</button>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px', textAlign: 'center' }}>
            <label style={{ cursor: 'pointer', display: 'block' }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700, margin: '0 auto 12px', overflow: 'hidden' }}>
                {preview ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.charAt(0)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Change Photo</div>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </label>
            <h5 style={{ fontWeight: 800, marginTop: 12 }}>{user?.name}</h5>
            <p style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 600 }}>🛒 Verified Buyer</p>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.8rem' }}>{user?.email}</p>
            <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', padding: '12px', marginTop: 12 }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', margin: 0 }}>Member since {new Date(user?.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfile;
