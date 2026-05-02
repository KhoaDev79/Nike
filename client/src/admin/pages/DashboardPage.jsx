import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getAdminStatsAPI, getDetailedReportsAPI } from '../../api/orderApi';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';

const glass = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 };
const glassSm = { ...glass, borderRadius: 12, padding: '14px 16px' };
const muted = 'rgba(255,255,255,0.35)';
const hint = 'rgba(255,255,255,0.2)';
const secondary = 'rgba(255,255,255,0.65)';

const statusColors = {
  pending: { label: 'Chờ xác nhận', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)', color: '#fbbf24' },
  confirmed: { label: 'Đã xác nhận', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.2)', color: '#a78bfa' },
  shipping: { label: 'Đang giao', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.2)', color: '#f472b6' },
  delivered: { label: 'Đã giao', bg: 'rgba(13,148,136,0.12)', border: 'rgba(13,148,136,0.2)', color: '#2dd4bf' },
  cancelled: { label: 'Đã hủy', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.2)', color: '#f87171' },
};

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    (async () => {
      try {
        const [sR, rR] = await Promise.all([getAdminStatsAPI(), getDetailedReportsAPI()]);
        const filled = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
          const d = new Date(now); d.setDate(d.getDate() - i);
          const ds = d.toISOString().split('T')[0];
          filled.push(rR.data.data.salesByDay.find(x => x._id === ds) || { _id: ds, revenue: 0, count: 0 });
        }
        setStats({ ...sR.data.data, chartData: filled });
      } catch { toast.error('Không thể tải dữ liệu'); }
      finally { setLoading(false); }
    })();
  }, [user, navigate]);

  const today = new Date();
  const dayNames = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
  const dateStr = `${dayNames[today.getDay()]}, ${today.toLocaleDateString('vi-VN')}`;

  if (loading || !stats) return (
    <div className='min-h-screen flex items-center justify-center' style={{ background: '#080b14', fontFamily: "'Inter',system-ui" }}>
      <div className='w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin' />
    </div>
  );

  const maxRev = Math.max(...stats.chartData.map(d => d.revenue), 1);
  const todayOrders = stats.chartData[stats.chartData.length - 1]?.count || 0;
  const todayRevenue = stats.chartData[stats.chartData.length - 1]?.revenue || 0;

  const kpis = [
    { label: 'DOANH THU', value: stats.revenue.month.toLocaleString('vi-VN') + 'đ', accent: '#7c3aed' },
    { label: 'CHỜ XỬ LÝ', value: stats.orders.pending, accent: '#f59e0b' },
    { label: 'HOÀN TẤT', value: stats.orders.delivered, accent: '#0d9488' },
    { label: 'KHÁCH HÀNG', value: stats.customers, accent: '#ec4899' },
  ];

  return (
    <div className='min-h-screen relative overflow-hidden' style={{ background: '#080b14', fontFamily: "'Inter',system-ui" }}>
      {/* Orbs */}
      <div className='fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none' style={{ background: 'rgba(124,58,237,0.12)', filter: 'blur(80px)' }} />
      <div className='fixed bottom-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full pointer-events-none' style={{ background: 'rgba(13,148,136,0.1)', filter: 'blur(80px)' }} />
      <div className='fixed top-[40%] left-[50%] w-[300px] h-[300px] rounded-full pointer-events-none' style={{ background: 'rgba(124,58,237,0.06)', filter: 'blur(60px)' }} />

      <AdminSidebar stats={stats} />

      <main className='ml-[200px] p-6 lg:p-8 xl:p-10 relative z-10'>
        {/* Topbar */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-[18px] font-bold text-white' style={{ letterSpacing: '-0.03em' }}>Dashboard</h1>
            <p className='text-[12px] mt-0.5' style={{ color: muted }}>{dateStr}</p>
          </div>
          <button className='w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150' style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <svg className='w-4 h-4' fill='none' stroke='rgba(255,255,255,0.5)' strokeWidth='1.5' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'/></svg>
          </button>
        </div>

        {/* Hero Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          {/* Revenue Card */}
          <div className='relative overflow-hidden' style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.3), rgba(13,148,136,0.15))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 14, padding: 20 }}>
            <div className='absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none' style={{ background: 'rgba(167,139,250,0.15)', filter: 'blur(40px)' }} />
            <p className='text-[10px] font-semibold uppercase tracking-[0.1em] mb-2' style={{ color: muted }}>DOANH THU · 30 NGÀY</p>
            <p className='text-[28px] font-extrabold text-white mb-3' style={{ letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>
              {stats.revenue.month.toLocaleString('vi-VN')}đ
            </p>
            <span className='inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full' style={{ background: 'rgba(13,148,136,0.15)', color: '#2dd4bf', border: '1px solid rgba(13,148,136,0.2)' }}>
              ↑ Doanh thu tháng này
            </span>
          </div>
          {/* Date & System */}
          <div style={{ ...glass, padding: 20 }}>
            <p className='text-[16px] font-bold text-white mb-1'>{dateStr}</p>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-2 h-2 rounded-full bg-[#0d9488]' style={{ boxShadow: '0 0 6px #0d9488' }} />
              <span className='text-[12px] font-medium' style={{ color: '#2dd4bf' }}>Hệ thống hoạt động ổn định</span>
            </div>
            <div className='flex items-center gap-0 pt-3' style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { l: 'Đơn hôm nay', v: todayOrders },
                { l: 'DT hôm nay', v: (todayRevenue / 1e6).toFixed(1) + 'M' },
                { l: 'Khách hàng', v: stats.customers },
              ].map((s, i) => (
                <div key={i} className='flex-1 text-center' style={i < 2 ? { borderRight: '1px solid rgba(255,255,255,0.06)' } : {}}>
                  <p className='text-[9px] uppercase tracking-[0.08em] mb-0.5' style={{ color: muted }}>{s.l}</p>
                  <p className='text-[14px] font-extrabold text-[#a78bfa]'>{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4'>
          {kpis.map(k => (
            <div key={k.label} className='transition-all duration-150 hover:border-white/10' style={glassSm}>
              <div className='flex items-center justify-between mb-2'>
                <p className='text-[10px] font-semibold uppercase tracking-[0.1em]' style={{ color: muted }}>{k.label}</p>
                <div className='w-2 h-2 rounded-full' style={{ background: k.accent }} />
              </div>
              <p className='text-[22px] font-extrabold text-white mb-2' style={{ letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>{k.value}</p>
              <div className='w-full h-[3px] rounded-full overflow-hidden' style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className='h-full rounded-full' style={{ width: '65%', background: `linear-gradient(90deg, ${k.accent}, ${k.accent}88)` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Content Row */}
        <div className='grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4'>
          {/* Orders Table */}
          <div style={{ ...glass, padding: 16 }}>
            <div className='flex items-center justify-between mb-3'>
              <p className='text-[10px] font-semibold uppercase tracking-[0.1em]' style={{ color: muted }}>ĐƠN HÀNG GẦN ĐÂY</p>
              <button onClick={() => navigate('/admin/orders')} className='text-[10px] font-medium cursor-pointer hover:underline' style={{ color: '#a78bfa' }}>Xem tất cả →</button>
            </div>
            <table className='w-full'>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['MÃ ĐƠN','KHÁCH HÀNG','TRẠNG THÁI','GIÁ TRỊ'].map(h => (
                    <th key={h} className={`pb-2 text-left text-[9px] font-medium uppercase tracking-[0.08em] ${h === 'GIÁ TRỊ' ? 'text-right' : ''}`} style={{ color: hint }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(o => {
                  const st = statusColors[o.status] || statusColors.pending;
                  return (
                    <tr key={o.id} className='cursor-pointer transition-colors duration-150' style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} onClick={() => setSelectedOrder(o)}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className='py-2'><span className='text-[11px] font-bold' style={{ color: '#818cf8', fontFamily: "'JetBrains Mono',monospace" }}>#{o.id.slice(-6).toUpperCase()}</span></td>
                      <td className='py-2 text-[11px]' style={{ color: secondary }}>{o.customer}</td>
                      <td className='py-2'>
                        <span className='text-[9px] font-semibold px-2 py-0.5 rounded-full inline-block' style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
                      </td>
                      <td className='py-2 text-right text-[11px] font-bold text-white' style={{ fontVariantNumeric: 'tabular-nums' }}>{o.total.toLocaleString('vi-VN')}đ</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Right Column */}
          <div className='space-y-4'>
            {/* Chart */}
            <div style={{ ...glass, padding: 16 }}>
              <p className='text-[10px] font-semibold uppercase tracking-[0.1em] mb-4' style={{ color: muted }}>BIỂU ĐỒ DOANH THU · 30 NGÀY</p>
              <div className='h-[120px] flex items-end gap-[2px]'>
                {stats.chartData.map((d, i) => {
                  const h = Math.max((d.revenue / maxRev) * 100, 4);
                  const isMax = d.revenue === maxRev && d.revenue > 0;
                  const dayNum = d._id.split('-')[2];
                  return (
                    <div key={i} className='flex-1 h-full flex flex-col justify-end group relative'>
                      <div className='w-full rounded-t-sm transition-all duration-200 cursor-pointer' style={{
                        height: `${h}%`,
                        background: isMax ? 'linear-gradient(to top, #a78bfa, #2dd4bf)' : d.revenue > 0 ? 'rgba(167,139,250,0.25)' : 'rgba(167,139,250,0.06)',
                      }}>
                        <div className='absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none' style={{ background: 'rgba(0,0,0,0.8)' }}>
                          {d.revenue.toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Day labels */}
              <div className='flex gap-[2px] mt-1'>
                {stats.chartData.map((d, i) => {
                  const dayNum = parseInt(d._id.split('-')[2]);
                  const show = dayNum === 1 || dayNum % 5 === 0 || i === stats.chartData.length - 1;
                  return <div key={i} className='flex-1 text-center text-[7px] font-medium' style={{ color: show ? 'rgba(255,255,255,0.25)' : 'transparent' }}>{dayNum}</div>;
                })}
              </div>
              <div className='mt-3 pt-3 flex items-center justify-between' style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className='text-[10px] font-medium' style={{ color: muted }}>Doanh thu tháng</span>
                <span className='text-[12px] font-bold' style={{ color: '#2dd4bf', fontVariantNumeric: 'tabular-nums' }}>{stats.revenue.month.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* CTA */}
            <div className='cursor-pointer group' style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.4), rgba(13,148,136,0.25))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 14, padding: 16 }} onClick={() => navigate('/admin/reports')}>
              <p className='text-[10px] font-semibold uppercase tracking-[0.1em] mb-1' style={{ color: muted }}>BÁO CÁO CHI TIẾT</p>
              <p className='text-[13px] font-bold text-white mb-3'>Xem phân tích chuyên sâu về doanh thu</p>
              <span className='text-[11px] font-medium inline-flex items-center gap-1.5 group-hover:underline' style={{ color: '#a78bfa' }}>
                Khám phá ngay
                <svg className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3'/></svg>
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {selectedOrder && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4' style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className='w-full max-w-2xl rounded-2xl overflow-hidden' style={{ background: 'rgba(15,20,35,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className='px-6 py-4 flex items-center justify-between' style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <h2 className='text-[16px] font-bold text-white'>Đơn hàng <span style={{ color: '#818cf8', fontFamily: "'JetBrains Mono',monospace" }}>#{selectedOrder.id.slice(-6).toUpperCase()}</span></h2>
                <p className='text-[11px] mt-0.5' style={{ color: muted }}>{new Date(selectedOrder.date).toLocaleDateString('vi-VN')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className='w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer' style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <svg className='w-4 h-4' fill='none' stroke='rgba(255,255,255,0.5)' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12'/></svg>
              </button>
            </div>
            <div className='p-6 space-y-4 max-h-[60vh] overflow-y-auto'>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className='flex items-center gap-4 py-2' style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className='w-12 h-12 rounded-lg overflow-hidden shrink-0 p-1 flex items-center justify-center' style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <img src={item.image} alt={item.name} className='w-full h-full object-contain' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[12px] font-medium text-white truncate'>{item.name}</p>
                    <p className='text-[10px]' style={{ color: muted }}>SL: {item.quantity}</p>
                  </div>
                  <p className='text-[12px] font-bold text-white'>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                </div>
              ))}
              <div className='grid grid-cols-2 gap-3 pt-2'>
                <div className='rounded-xl p-4' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className='text-[9px] font-semibold uppercase tracking-[0.1em] mb-2' style={{ color: muted }}>Khách hàng</p>
                  <p className='text-[13px] font-semibold text-white'>{selectedOrder.shippingInfo?.fullName || selectedOrder.customer}</p>
                  <p className='text-[11px] mt-1' style={{ color: secondary }}>{selectedOrder.shippingInfo?.phone || 'N/A'}</p>
                  {selectedOrder.shippingInfo && (
                    <p className='text-[10px] mt-1.5 leading-relaxed' style={{ color: muted }}>
                      {selectedOrder.shippingInfo.street}, {selectedOrder.shippingInfo.ward}, {selectedOrder.shippingInfo.district}, {selectedOrder.shippingInfo.city}
                    </p>
                  )}
                </div>
                <div className='rounded-xl p-4' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className='text-[9px] font-semibold uppercase tracking-[0.1em] mb-2' style={{ color: muted }}>Thanh toán</p>
                  <p className='text-[13px] font-semibold text-white'>{selectedOrder.paymentMethod === 'cod' ? 'COD' : 'Online'}</p>
                </div>
              </div>
            </div>
            <div className='px-6 py-4 flex items-center justify-between' style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.3), rgba(13,148,136,0.15))', borderTop: '1px solid rgba(124,58,237,0.2)' }}>
              <p className='text-[10px] font-semibold uppercase tracking-[0.1em]' style={{ color: 'rgba(255,255,255,0.4)' }}>Tổng thanh toán</p>
              <p className='text-[24px] font-extrabold text-white' style={{ letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>{selectedOrder.total.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
