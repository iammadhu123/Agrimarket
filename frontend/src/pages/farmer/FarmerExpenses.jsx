import { useState, useEffect } from 'react';
import API from '../../services/api';
import Loading from '../../components/common/Loading';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const CATEGORIES = ['seeds', 'fertilizer', 'pesticides', 'labour', 'irrigation', 'equipment', 'transportation', 'other'];
const COLORS = ['#16a34a', '#22c55e', '#f97316', '#0ea5e9', '#7c3aed', '#dc2626', '#ca8a04', '#94a3b8'];

const FarmerExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'seeds', amount: '', date: new Date().toISOString().split('T')[0], description: '' });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/expenses');
      setExpenses(data.expenses || []);
      setCategoryStats(data.categoryStats || []);
      setMonthlyStats(data.monthlyStats || []);
      setTotalExpense(data.totalExpense || 0);
    } catch { toast.error('Failed to load expenses'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/expenses/${editId}`, form);
        toast.success('Expense updated!');
      } else {
        await API.post('/expenses', form);
        toast.success('Expense recorded!');
      }
      setShowForm(false);
      setEditId(null);
      setForm({ title: '', category: 'seeds', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
      fetchExpenses();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const handleEdit = (exp) => {
    setForm({ title: exp.title, category: exp.category, amount: exp.amount, date: exp.date?.split('T')[0], description: exp.description || '' });
    setEditId(exp._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await API.delete(`/expenses/${id}`);
      toast.success('Expense deleted');
      fetchExpenses();
    } catch { toast.error('Failed to delete'); }
  };

  const pieData = categoryStats.map((s, i) => ({ name: s._id, value: s.total, fill: COLORS[i % COLORS.length] }));
  const barData = monthlyStats.map(m => ({
    name: new Date(m._id.year, m._id.month - 1).toLocaleString('default', { month: 'short' }),
    amount: m.total,
  }));

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>Expense Tracker</h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.875rem' }}>Total: <strong style={{ color: 'var(--danger)' }}>₹{totalExpense.toLocaleString()}</strong></p>
        </div>
        <button className="btn-primary-custom" onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', category: 'seeds', amount: '', date: new Date().toISOString().split('T')[0], description: '' }); }}>
          <FiPlus /> Add Expense
        </button>
      </div>

      {/* Charts */}
      {(pieData.length > 0 || barData.length > 0) && (
        <div className="row g-4 mb-4">
          <div className="col-lg-5">
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '20px' }}>
              <h6 style={{ fontWeight: 700, marginBottom: 16 }}>By Category</h6>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={v => [`₹${v}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-lg-7">
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '20px' }}>
              <h6 style={{ fontWeight: 700, marginBottom: 16 }}>Monthly Trend</h6>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={v => [`₹${v}`, 'Expenses']} />
                  <Bar dataKey="amount" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Expense List */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        {loading ? <Loading /> : expenses.length === 0 ? (
          <div className="empty-state"><span className="empty-state-icon">💰</span><h4>No expenses recorded</h4><p>Start tracking your farming expenses</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead><tr><th>Title</th><th>Category</th><th>Amount</th><th>Date</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp._id}>
                    <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{exp.title}</td>
                    <td>
                      <span style={{ background: 'var(--primary-50)', color: 'var(--primary)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, textTransform: 'capitalize' }}>
                        {exp.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--danger)' }}>₹{exp.amount.toLocaleString()}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{new Date(exp.date).toLocaleDateString('en-IN')}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-600)', maxWidth: 200 }}>{exp.description || '–'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button onClick={() => handleEdit(exp)} style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', width: 30, height: 30, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><FiEdit2 size={13} /></button>
                        <button onClick={() => handleDelete(exp._id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', width: 30, height: 30, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><FiTrash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Expense Modal */}
      {showForm && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={() => setShowForm(false)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', borderRadius: 'var(--radius-xl)', padding: '32px', zIndex: 1001, width: '90%', maxWidth: 480 }}>
            <h5 style={{ fontWeight: 800, marginBottom: 24 }}>{editId ? 'Edit Expense' : 'Add Expense'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label-custom">Expense Title *</label>
                  <input type="text" className="form-control-custom" placeholder="e.g. Bought seeds for wheat" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Category *</label>
                  <select className="form-control-custom" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Amount (₹) *</label>
                  <input type="number" className="form-control-custom" placeholder="0" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Date *</label>
                  <input type="date" className="form-control-custom" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Description</label>
                  <textarea className="form-control-custom" rows={3} placeholder="Optional notes..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
                </div>
              </div>
              <div className="d-flex gap-3 mt-4">
                <button type="submit" className="btn-primary-custom flex-fill justify-content-center">{editId ? 'Update' : 'Add Expense'}</button>
                <button type="button" className="btn-outline-custom" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default FarmerExpenses;
