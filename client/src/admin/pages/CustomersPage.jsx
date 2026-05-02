import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getAdminStatsAPI, getCustomerInsightsAPI } from '../../api/orderApi';
import { updateUserByAdminAPI, deleteUserByAdminAPI } from '../../api/authApi';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';

const avatarColors = ['#111111','#333333','#555555','#777777'];
const getAvatarColor = (name) => avatarColors[name?.charCodeAt(0) % avatarColors.length];

export default function AdminCustomersPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', avatar: '' });

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
    setEditForm({ name: c.name, email: c.email, role: c.role || 'user', avatar: c.avatar || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try { await updateUserByAdminAPI(editModal._id, editForm); toast.success('Cập nhật thành công'); setEditModal(null); fetchCustomers(); }
    catch (err) { toast.error('Thất bại: ' + (err.response?.data?.message || err.message)); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xoá khách hàng này khỏi hệ thống?')) return;
    try { await deleteUserByAdminAPI(id); toast.success('Đã xoá'); fetchCustomers(); }
    catch (err) { toast.error('Thất bại'); }
  };

  return (
    <div className='min-h-screen relative bg-[var(--color-light-gray)] text-[var(--color-text-primary)]'>
      <AdminSidebar stats={stats} />
      <main className='ml-[200px] p-6 lg:p-8 xl:p-10 relative z-10'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-[24px] font-bold tracking-tight'>Quản lý khách hàng</h1>
            <p className='text-[14px] text-[var(--color-text-secondary)] mt-0.5'>Hành vi mua sắm và giá trị vòng đời.</p>
          </div>
          <div className='flex items-center gap-3 px-5 py-3 rounded-[12px] bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)]'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]'>Tổng</span>
            <span className='text-[20px] font-black'>{customers.length}</span>
          </div>
        </div>

        <div className='bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] rounded-[20px] overflow-hidden'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-[var(--color-border-secondary)] bg-[var(--color-snow)]'>
                {['KHÁCH HÀNG','LIÊN HỆ','ĐƠN HÀNG','CHI TIÊU',''].map(h => (
                  <th key={h} className={`px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] ${h === 'CHI TIÊU' ? 'text-right' : h === 'ĐƠN HÀNG' ? 'text-center' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className='py-20 text-center text-[12px] font-bold text-[var(--color-text-secondary)]'>Đang tải...</td></tr>
              ) : customers.map(c => (
                <tr key={c._id} className='border-b border-[var(--color-border-secondary)] hover:bg-[var(--color-hover-gray)] transition-colors'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-4'>
                      <div className='w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-nike-white)] text-[12px] font-bold shrink-0'
                        style={{ background: getAvatarColor(c.name) }}>
                        {c.avatar ? <img src={c.avatar} className='w-full h-full object-cover rounded-full' /> : c.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className='text-[12px] font-bold'>{c.name}</p>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-[4px] mt-1 inline-block ${c.role === 'admin' ? 'bg-[var(--color-nike-black)] text-[var(--color-nike-white)]' : 'bg-[var(--color-light-gray)] text-[var(--color-text-secondary)]'}`}>{c.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-[12px] text-[var(--color-text-secondary)]'>{c.email}</td>
                  <td className='px-6 py-4 text-center text-[14px] font-bold'>{c.orderCount}</td>
                  <td className='px-6 py-4 text-right text-[14px] font-bold tabular-nums'>{c.totalSpent.toLocaleString('vi-VN')}đ</td>
                  <td className='px-6 py-4'>
                    <div className='flex justify-end gap-2'>
                      <button onClick={() => openEdit(c)} className='w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] hover:border-[var(--color-nike-black)] transition-colors'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'/></svg>
                      </button>
                      <button onClick={() => handleDelete(c._id)} className='w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] text-[var(--color-nike-red)] hover:border-[var(--color-nike-red)] transition-colors'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'/></svg>
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
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--color-nike-black)]/40 backdrop-blur-sm'>
          <div className='w-full max-w-md bg-[var(--color-nike-white)] rounded-[20px] p-8 border border-[var(--color-border-secondary)]'>
            <div className='flex items-center justify-between mb-8'>
              <h2 className='text-[20px] font-bold'>Cập nhật khách hàng</h2>
              <button onClick={() => setEditModal(null)} className='w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-light-gray)] hover:bg-[var(--color-hover-gray)] transition-colors cursor-pointer'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12'/></svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className='space-y-5'>
              {[{l:'Họ tên',k:'name',t:'text'},{l:'Email',k:'email',t:'email'}].map(f => (
                <div key={f.k}>
                  <label className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] block mb-2'>{f.l}</label>
                  <input type={f.t} value={editForm[f.k]} onChange={e => setEditForm({...editForm, [f.k]: e.target.value})} required
                    className='w-full text-[14px] px-4 py-3 rounded-[12px] outline-none bg-[var(--color-snow)] border border-[var(--color-border-secondary)] focus:border-[var(--color-nike-black)] focus:ring-1 focus:ring-[var(--color-nike-black)] transition-colors' />
                </div>
              ))}
              <div>
                <label className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] block mb-2'>Quyền</label>
                <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}
                  className='w-full text-[14px] px-4 py-3 rounded-[12px] outline-none appearance-none bg-[var(--color-snow)] border border-[var(--color-border-secondary)] focus:border-[var(--color-nike-black)] transition-colors'>
                  <option value='user'>Khách hàng (User)</option>
                  <option value='admin'>Quản trị viên (Admin)</option>
                </select>
              </div>
              <button type='submit' className='w-full py-4 rounded-[30px] text-[14px] font-bold bg-[var(--color-nike-black)] text-[var(--color-nike-white)] hover:bg-[var(--color-text-secondary)] transition-colors cursor-pointer mt-4'>
                Lưu thay đổi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
