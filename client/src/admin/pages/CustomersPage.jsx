import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getAdminStatsAPI, getCustomerInsightsAPI } from '../../api/orderApi';
import { updateUserByAdminAPI, deleteUserByAdminAPI } from '../../api/authApi';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';

const glass = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 };
const muted = 'rgba(255,255,255,0.35)';
const hint = 'rgba(255,255,255,0.2)';
const secondary = 'rgba(255,255,255,0.65)';

const avatarColors = ['#7c3aed','#0d9488','#ec4899','#f59e0b','#818cf8','#2dd4bf','#f472b6','#a78bfa'];
const getAvatarColor = (name) => avatarColors[name?.charCodeAt(0) % avatarColors.length];

export default function AdminCustomersPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', avatar: '', isActive: true });

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchCustomers(); fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => { try { const { data } = await getAdminStatsAPI(); setStats(data.data); } catch {} };
  const fetchCustomers = async () => {
    try { setLoading(true); const { data } = await getCustomerInsightsAPI(); setCustomers(data.data); }
    catch { toast.error('Không thể tải khách hàng'); }
    finally { setLoading(false); }
  };

  const openEdit = (c) => {
    setEditModal(c);
    setEditForm({ name: c.name, email: c.email, role: c.role || 'user', avatar: c.avatar || '', isActive: c.isActive !== false });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try { await updateUserByAdminAPI(editModal._id, editForm); toast.success('Cập nhật thành công'); setEditModal(null); fetchCustomers(); }
    catch (err) { toast.error('Thất bại: ' + (err.response?.data?.message || err.message)); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xoá khách hàng này?')) return;
    try { await deleteUserByAdminAPI(id); toast.success('Đã xoá'); fetchCustomers(); }
    catch (err) { toast.error('Thất bại'); }
  };

  return (
    <div className='min-h-screen relative overflow-hidden' style={{ background: '#080b14', fontFamily: "'Inter',system-ui" }}>
      <div className='fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none' style={{ background: 'rgba(124,58,237,0.12)', filter: 'blur(80px)' }} />
      <div className='fixed bottom-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full pointer-events-none' style={{ background: 'rgba(13,148,136,0.1)', filter: 'blur(80px)' }} />
      <AdminSidebar stats={stats} />
      <main className='ml-[200px] p-6 lg:p-8 xl:p-10 relative z-10'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-[18px] font-bold text-white' style={{ letterSpacing: '-0.03em' }}>Quản lý khách hàng</h1>
            <p className='text-[12px] mt-0.5' style={{ color: muted }}>Hành vi mua sắm và giá trị vòng đời.</p>
          </div>
          <div className='flex items-center gap-3 px-4 py-2.5 rounded-xl' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className='text-[10px] font-semibold uppercase' style={{ color: muted }}>Tổng</span>
            <span className='text-[18px] font-extrabold text-white'>{customers.length}</span>
          </div>
        </div>

        <div style={{ ...glass, padding: 0, overflow: 'hidden' }}>
          <table className='w-full'>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['KHÁCH HÀNG','LIÊN HỆ','ĐƠN HÀNG','CHI TIÊU','TRẠNG THÁI',''].map(h => (
                  <th key={h} className={`px-4 py-3 text-left text-[9px] font-medium uppercase tracking-[0.08em] ${h === 'CHI TIÊU' ? 'text-right' : h === 'ĐƠN HÀNG' ? 'text-center' : ''}`} style={{ color: hint }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className='py-20 text-center text-[11px]' style={{ color: muted }}>Đang tải...</td></tr>
              ) : customers.map(c => (
                <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0'
                        style={{ background: getAvatarColor(c.name) }}>
                        {c.avatar ? <img src={c.avatar} className='w-full h-full object-cover rounded-lg' /> : c.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className='text-[11px] font-medium text-white'>{c.name}</p>
                        <span className='text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded' style={{ background: c.role === 'admin' ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)', color: c.role === 'admin' ? '#a78bfa' : 'rgba(255,255,255,0.3)' }}>{c.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-3 text-[11px]' style={{ color: secondary }}>{c.email}</td>
                  <td className='px-4 py-3 text-center text-[11px] font-bold text-white'>{c.orderCount}</td>
                  <td className='px-4 py-3 text-right text-[11px] font-bold' style={{ color: '#818cf8', fontVariantNumeric: 'tabular-nums' }}>{c.totalSpent.toLocaleString('vi-VN')}đ</td>
                  <td className='px-4 py-3'>
                    <span className='text-[9px] font-semibold px-2 py-0.5 rounded-full' style={{ background: c.isActive !== false ? 'rgba(13,148,136,0.12)' : 'rgba(239,68,68,0.12)', color: c.isActive !== false ? '#2dd4bf' : '#f87171', border: `1px solid ${c.isActive !== false ? 'rgba(13,148,136,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                      {c.isActive !== false ? 'Hoạt động' : 'Vô hiệu'}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex justify-end gap-1.5'>
                      <button onClick={() => openEdit(c)} className='w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.2)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                        <svg className='w-3.5 h-3.5' fill='none' stroke='rgba(255,255,255,0.4)' strokeWidth='1.5' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'/></svg>
                      </button>
                      <button onClick={() => handleDelete(c._id)} className='w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                        <svg className='w-3.5 h-3.5' fill='none' stroke='rgba(255,255,255,0.4)' strokeWidth='1.5' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {editModal && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4' style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className='w-full max-w-md rounded-2xl p-8' style={{ background: 'rgba(15,20,35,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-[16px] font-bold text-white'>Cập nhật khách hàng</h2>
              <button onClick={() => setEditModal(null)} className='w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer' style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <svg className='w-4 h-4' fill='none' stroke='rgba(255,255,255,0.5)' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12'/></svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className='space-y-4'>
              {[{l:'Họ tên',k:'name',t:'text'},{l:'Email',k:'email',t:'email'}].map(f => (
                <div key={f.k}>
                  <label className='text-[10px] font-semibold uppercase tracking-[0.1em] block mb-1.5' style={{ color: muted }}>{f.l}</label>
                  <input type={f.t} value={editForm[f.k]} onChange={e => setEditForm({...editForm, [f.k]: e.target.value})} required
                    className='w-full text-[12px] text-white px-4 py-3 rounded-lg outline-none' style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
              ))}
              <div>
                <label className='text-[10px] font-semibold uppercase tracking-[0.1em] block mb-1.5' style={{ color: muted }}>Quyền</label>
                <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}
                  className='w-full text-[12px] text-white px-4 py-3 rounded-lg outline-none appearance-none' style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <option value='user'>User</option>
                  <option value='admin'>Admin</option>
                </select>
              </div>
              <div className='flex items-center justify-between p-4 rounded-xl' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p className='text-[11px] font-medium text-white'>Trạng thái</p>
                  <p className='text-[9px]' style={{ color: muted }}>{editForm.isActive ? 'Đang hoạt động' : 'Đã khoá'}</p>
                </div>
                <button type='button' onClick={() => setEditForm({...editForm, isActive: !editForm.isActive})}
                  className='w-11 h-6 rounded-full relative transition-all cursor-pointer' style={{ background: editForm.isActive ? '#0d9488' : 'rgba(255,255,255,0.1)' }}>
                  <div className='w-4 h-4 bg-white rounded-full absolute top-1 transition-all' style={{ left: editForm.isActive ? 24 : 4 }} />
                </button>
              </div>
              <button type='submit' className='w-full py-3 rounded-xl text-[11px] font-semibold text-white cursor-pointer transition-all'
                style={{ background: 'linear-gradient(135deg, #7c3aed, #0d9488)', border: 'none' }}>
                Lưu thay đổi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
