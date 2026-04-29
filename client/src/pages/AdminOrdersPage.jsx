import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getAllOrdersAPI, updateOrderStatusAPI, getAdminStatsAPI } from '../services/orderService';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';

const glass = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 };
const muted = 'rgba(255,255,255,0.35)';
const hint = 'rgba(255,255,255,0.2)';
const secondary = 'rgba(255,255,255,0.65)';

const statusColors = {
  pending: { label: 'Chờ xác nhận', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)', color: '#fbbf24', hover: 'rgba(245,158,11,0.15)' },
  confirmed: { label: 'Đã xác nhận', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.2)', color: '#a78bfa', hover: 'rgba(124,58,237,0.15)' },
  shipping: { label: 'Đang giao', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.2)', color: '#f472b6', hover: 'rgba(236,72,153,0.15)' },
  delivered: { label: 'Đã giao', bg: 'rgba(13,148,136,0.12)', border: 'rgba(13,148,136,0.2)', color: '#2dd4bf', hover: 'rgba(13,148,136,0.15)' },
  cancelled: { label: 'Đã hủy', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.2)', color: '#f87171', hover: 'rgba(239,68,68,0.15)' },
};

export default function AdminOrdersPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchOrders(); fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => { try { const { data } = await getAdminStatsAPI(); setStats(data.data); } catch {} };
  const fetchOrders = async () => {
    try { setLoading(true); const { data } = await getAllOrdersAPI(); setOrders(data.data); }
    catch { toast.error('Không thể tải đơn hàng'); }
    finally { setLoading(false); }
  };
  const handleUpdateStatus = async (id, status) => {
    try {
      await updateOrderStatusAPI(id, { orderStatus: status });
      toast.success('Cập nhật thành công');
      fetchOrders();
      if (selectedOrder?._id === id) setSelectedOrder(prev => ({ ...prev, orderStatus: status }));
    } catch { toast.error('Cập nhật thất bại'); }
  };

  const filtered = orders.filter(o => o._id.toLowerCase().includes(filter.toLowerCase()) || o.shippingInfo.fullName.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className='min-h-screen relative overflow-hidden' style={{ background: '#080b14', fontFamily: "'Inter',system-ui" }}>
      <div className='fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none' style={{ background: 'rgba(124,58,237,0.12)', filter: 'blur(80px)' }} />
      <div className='fixed bottom-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full pointer-events-none' style={{ background: 'rgba(13,148,136,0.1)', filter: 'blur(80px)' }} />
      <AdminSidebar stats={stats} />
      <main className='ml-[200px] p-6 lg:p-8 xl:p-10 relative z-10'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-[18px] font-bold text-white' style={{ letterSpacing: '-0.03em' }}>Quản lý đơn hàng</h1>
            <p className='text-[12px] mt-0.5' style={{ color: muted }}>Kiểm soát và xử lý các đơn hàng.</p>
          </div>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <input type='text' placeholder='Tìm mã đơn, tên...' value={filter} onChange={e => setFilter(e.target.value)}
                className='text-[12px] text-white placeholder-white/30 outline-none pl-9 pr-4 py-2.5 rounded-lg w-64'
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
              <svg className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2' fill='none' stroke='rgba(255,255,255,0.3)' strokeWidth='1.5' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/></svg>
            </div>
            <button onClick={fetchOrders} className='w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer' style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <svg className='w-4 h-4' fill='none' stroke='rgba(255,255,255,0.5)' strokeWidth='1.5' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'/></svg>
            </button>
          </div>
        </div>

        <div style={{ ...glass, padding: 0, overflow: 'hidden' }}>
          <table className='w-full'>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['MÃ ĐƠN','KHÁCH HÀNG','NGÀY ĐẶT','TỔNG TIỀN','TRẠNG THÁI',''].map(h => (
                  <th key={h} className={`px-4 py-3 text-left text-[9px] font-medium uppercase tracking-[0.08em] ${h === 'TỔNG TIỀN' ? 'text-right' : ''}`} style={{ color: hint }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className='py-20 text-center text-[11px] font-medium' style={{ color: muted }}>Đang tải...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className='py-20 text-center text-[11px] font-medium' style={{ color: muted }}>Không có đơn hàng</td></tr>
              ) : filtered.map(order => {
                const st = statusColors[order.orderStatus] || statusColors.pending;
                return (
                  <tr key={order._id} className='cursor-pointer transition-colors duration-150' style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => setSelectedOrder(order)}>
                    <td className='px-4 py-3'><span className='text-[11px] font-bold' style={{ color: '#818cf8', fontFamily: "'JetBrains Mono',monospace" }}>#{order._id.slice(-6).toUpperCase()}</span></td>
                    <td className='px-4 py-3'>
                      <p className='text-[11px] font-medium text-white'>{order.shippingInfo.fullName}</p>
                      <p className='text-[9px]' style={{ color: muted }}>{order.shippingInfo.phone}</p>
                    </td>
                    <td className='px-4 py-3 text-[11px]' style={{ color: secondary }}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className='px-4 py-3 text-right text-[11px] font-bold text-white' style={{ fontVariantNumeric: 'tabular-nums' }}>{order.totalPrice.toLocaleString('vi-VN')}đ</td>
                    <td className='px-4 py-3'>
                      <span className='text-[9px] font-semibold px-2 py-0.5 rounded-full' style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
                    </td>
                    <td className='px-4 py-3 text-right'>
                      <div className='w-9 h-9 rounded-lg flex items-center justify-center ml-auto' style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <svg className='w-4 h-4' fill='none' stroke='rgba(255,255,255,0.3)' strokeWidth='1.5' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'/><path strokeLinecap='round' strokeLinejoin='round' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'/></svg>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4' style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className='w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]' style={{ background: 'rgba(15,20,35,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Left: Details */}
            <div className='flex-1 p-6 overflow-y-auto' style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-[16px] font-bold text-white'>Đơn hàng <span style={{ color: '#818cf8', fontFamily: "'JetBrains Mono',monospace" }}>#{selectedOrder._id.slice(-6).toUpperCase()}</span></h2>
                  <p className='text-[11px] mt-0.5' style={{ color: muted }}>{new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <span className='text-[9px] font-semibold px-2 py-0.5 rounded-full' style={{ background: statusColors[selectedOrder.orderStatus]?.bg, color: statusColors[selectedOrder.orderStatus]?.color, border: `1px solid ${statusColors[selectedOrder.orderStatus]?.border}` }}>
                  {statusColors[selectedOrder.orderStatus]?.label}
                </span>
              </div>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className='flex items-center gap-4 py-3' style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className='w-14 h-14 rounded-lg shrink-0 p-1.5 flex items-center justify-center' style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <img src={item.image} alt={item.name} className='w-full h-full object-contain' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[12px] font-medium text-white truncate'>{item.name}</p>
                    <p className='text-[10px]' style={{ color: muted }}>Size: {item.size} · SL: {item.quantity}</p>
                  </div>
                  <p className='text-[12px] font-bold text-white'>{item.price.toLocaleString('vi-VN')}đ</p>
                </div>
              ))}
              <div className='mt-4 p-4 rounded-xl' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className='text-[9px] font-semibold uppercase tracking-[0.1em] mb-2' style={{ color: muted }}>Giao hàng</p>
                <p className='text-[13px] font-semibold text-white'>{selectedOrder.shippingInfo?.fullName}</p>
                <p className='text-[11px] mt-1' style={{ color: secondary }}>{selectedOrder.shippingInfo?.phone}</p>
                <p className='text-[10px] mt-1' style={{ color: muted }}>{selectedOrder.shippingInfo?.street}, {selectedOrder.shippingInfo?.ward}, {selectedOrder.shippingInfo?.district}, {selectedOrder.shippingInfo?.city}</p>
              </div>
              <div className='mt-4 flex items-center justify-between'>
                <span className='text-[10px] font-semibold uppercase' style={{ color: muted }}>Tổng</span>
                <span className='text-[20px] font-extrabold text-white' style={{ fontVariantNumeric: 'tabular-nums' }}>{selectedOrder.totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
            {/* Right: Actions */}
            <div className='w-full md:w-[260px] p-6 flex flex-col'>
              <div className='flex justify-end mb-6'>
                <button onClick={() => setSelectedOrder(null)} className='w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer' style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <svg className='w-4 h-4' fill='none' stroke='rgba(255,255,255,0.5)' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12'/></svg>
                </button>
              </div>
              <p className='text-[10px] font-semibold uppercase tracking-[0.1em] mb-3 text-center' style={{ color: muted }}>CẬP NHẬT TRẠNG THÁI</p>
              <div className='space-y-2 flex-1'>
                {Object.entries(statusColors).map(([key, val]) => (
                  <button key={key} onClick={() => handleUpdateStatus(selectedOrder._id, key)}
                    className='w-full py-3 rounded-lg text-[10px] font-semibold uppercase tracking-[0.08em] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2'
                    style={{
                      background: selectedOrder.orderStatus === key ? val.bg : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedOrder.orderStatus === key ? val.border : 'rgba(255,255,255,0.06)'}`,
                      color: selectedOrder.orderStatus === key ? val.color : 'rgba(255,255,255,0.4)',
                    }}
                    onMouseEnter={e => { if (selectedOrder.orderStatus !== key) { e.currentTarget.style.background = val.hover; e.currentTarget.style.color = val.color; e.currentTarget.style.borderColor = val.border; }}}
                    onMouseLeave={e => { if (selectedOrder.orderStatus !== key) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}}
                  >
                    {val.label}
                    {selectedOrder.orderStatus === key && <div className='w-1.5 h-1.5 rounded-full' style={{ background: val.color }} />}
                  </button>
                ))}
              </div>
              <div className='mt-4 p-4 rounded-xl' style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.3), rgba(13,148,136,0.15))', border: '1px solid rgba(124,58,237,0.2)' }}>
                <p className='text-[9px] font-semibold uppercase tracking-[0.1em]' style={{ color: 'rgba(255,255,255,0.4)' }}>Giao dịch</p>
                <p className='text-[11px] font-bold text-white mt-1'>{selectedOrder.paymentMethod === 'cod' ? 'COD' : 'Online'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
