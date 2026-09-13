import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { FiUser, FiSave, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const FarmerProfile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '', farmName: user?.farmName || '', farmLocation: user?.farmLocation || '', farmSize: user?.farmSize || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatar(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append('avatar', avatar);
      const { data } = await API.put('/users/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
    finally { setLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    try {
      await API.put('/auth/update-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24 }}>My Profile</h1>

      <div className="row g-4">
        <div className="col-lg-8">
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px', marginBottom: 20 }}>
            <h5 style={{ fontWeight: 700, marginBottom: 24 }}>Personal Information</h5>
            <form onSubmit={handleSave}>
              <div className="row g-3">
                {[
                  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
                  { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '10-digit number' },
                  { label: 'Farm Name', key: 'farmName', type: 'text', placeholder: 'Your farm name' },
                  { label: 'Farm Location', key: 'farmLocation', type: 'text', placeholder: 'e.g. Pune, Maharashtra' },
                  { label: 'Farm Size', key: 'farmSize', type: 'text', placeholder: 'e.g. 5 acres' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key} className="col-md-6">
                    <label className="form-label-custom">{label}</label>
                    <input type={type} className="form-control-custom" placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
                <div className="col-12">
                  <label className="form-label-custom">Bio</label>
                  <textarea className="form-control-custom" rows={3} placeholder="Tell buyers about your farm..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} style={{ resize: 'vertical' }} />
                </div>
              </div>
              <button type="submit" className="btn-primary-custom mt-4" disabled={loading}><FiSave /> {loading ? 'Saving...' : 'Save Changes'}</button>
            </form>
          </div>

          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px' }}>
            <h5 style={{ fontWeight: 700, marginBottom: 24 }}><FiLock /> Change Password</h5>
            <form onSubmit={handleChangePassword}>
              <div className="row g-3">
                {[
                  { label: 'Current Password', key: 'currentPassword' },
                  { label: 'New Password', key: 'newPassword' },
                  { label: 'Confirm New Password', key: 'confirm' },
                ].map(({ label, key }) => (
                  <div key={key} className="col-12">
                    <label className="form-label-custom">{label}</label>
                    <input type="password" className="form-control-custom" value={pwForm[key]} onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })} required minLength={6} />
                  </div>
                ))}
              </div>
              <button type="submit" className="btn-outline-custom mt-4">Change Password</button>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px', textAlign: 'center' }}>
            <label style={{ cursor: 'pointer', display: 'block' }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700, margin: '0 auto 12px', overflow: 'hidden' }}>
                {preview ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.charAt(0)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Click to change photo</div>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </label>
            <h5 style={{ fontWeight: 800, marginTop: 12 }}>{user?.name}</h5>
            <p style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600 }}>🌾 Farmer</p>
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

export default FarmerProfile;
