import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getAdminStatsAPI, getDetailedReportsAPI } from '../../api/orderApi';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const statusColors = {
  pending: { label: 'Chờ xác nhận', bg: 'bg-[var(--color-warning-yellow)]', text: 'text-[var(--color-nike-black)]', border: 'border-[var(--color-nike-black)]' },
  confirmed: { label: 'Đã xác nhận', bg: 'bg-[var(--color-light-gray)]', text: 'text-[var(--color-nike-black)]', border: 'border-[var(--color-border-secondary)]' },
  shipping: { label: 'Đang giao', bg: 'bg-[var(--color-link-blue)]', text: 'text-[var(--color-nike-white)]', border: 'border-transparent' },
  delivered: { label: 'Đã giao', bg: 'bg-[var(--color-success-green)]', text: 'text-[var(--color-nike-white)]', border: 'border-transparent' },
  cancelled: { label: 'Đã hủy', bg: 'bg-[var(--color-nike-red)]', text: 'text-[var(--color-nike-white)]', border: 'border-transparent' },
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--color-nike-black)] text-[var(--color-nike-white)] text-[12px] font-bold px-3 py-2 rounded-[6px] shadow-lg">
        {payload[0].value.toLocaleString('vi-VN')}đ
      </div>
    );
  }
  return null;
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
    <div className='min-h-screen flex items-center justify-center bg-[var(--color-light-gray)]'>
      <div className='w-8 h-8 border-2 border-[var(--color-nike-black)] border-t-transparent rounded-full animate-spin' />
    </div>
  );

  const maxRev = Math.max(...stats.chartData.map(d => d.revenue), 1);
  const todayOrders = stats.chartData[stats.chartData.length - 1]?.count || 0;
  const todayRevenue = stats.chartData[stats.chartData.length - 1]?.revenue || 0;

  const kpis = [
    { label: 'DOANH THU', value: stats.revenue.month.toLocaleString('vi-VN') + 'đ' },
    { label: 'CHỜ XỬ LÝ', value: stats.orders.pending },
    { label: 'HOÀN TẤT', value: stats.orders.delivered },
    { label: 'KHÁCH HÀNG', value: stats.customers },
  ];

  return (
    <div className='min-h-screen relative bg-[var(--color-light-gray)] text-[var(--color-text-primary)]'>
      <AdminSidebar stats={stats} />

      <main className='ml-[200px] p-6 lg:p-8 xl:p-10 relative z-10'>
        {/* Topbar */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-[24px] font-bold tracking-tight'>Dashboard</h1>
            <p className='text-[14px] text-[var(--color-text-secondary)] mt-0.5'>{dateStr}</p>
          </div>
        </div>

        {/* Hero Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          {/* Revenue Card */}
          <div className='bg-[var(--color-nike-black)] text-[var(--color-nike-white)] rounded-[20px] p-6 relative overflow-hidden'>
            <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2'>DOANH THU · 30 NGÀY</p>
            <p className='text-[32px] font-black mb-3 tabular-nums'>
              {stats.revenue.month.toLocaleString('vi-VN')}đ
            </p>
            <span className='inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full bg-[var(--color-nike-white)] text-[var(--color-nike-black)]'>
              ↑ Doanh thu tháng này
            </span>
          </div>
          {/* Date & System */}
          <div className='bg-[var(--color-nike-white)] rounded-[20px] p-6 border border-[var(--color-border-secondary)]'>
            <p className='text-[16px] font-bold mb-1'>{dateStr}</p>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-2 h-2 rounded-full bg-[var(--color-success-green)]' />
              <span className='text-[12px] font-medium text-[var(--color-text-secondary)]'>Hệ thống hoạt động ổn định</span>
            </div>
            <div className='flex items-center gap-0 pt-4 border-t border-[var(--color-border-secondary)]'>
              {[
                { l: 'Đơn hôm nay', v: todayOrders },
                { l: 'DT hôm nay', v: (todayRevenue / 1e6).toFixed(1) + 'M' },
                { l: 'Khách hàng', v: stats.customers },
              ].map((s, i) => (
                <div key={i} className={`flex-1 text-center ${i < 2 ? 'border-r border-[var(--color-border-secondary)]' : ''}`}>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-1'>{s.l}</p>
                  <p className='text-[16px] font-black'>{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
          {kpis.map(k => (
            <div key={k.label} className='bg-[var(--color-nike-white)] rounded-[20px] p-5 border border-[var(--color-border-secondary)]'>
              <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2'>{k.label}</p>
              <p className='text-[24px] font-black tabular-nums'>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Content Row */}
        <div className='grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4'>
          {/* Orders Table */}
          <div className='bg-[var(--color-nike-white)] rounded-[20px] p-6 border border-[var(--color-border-secondary)]'>
            <div className='flex items-center justify-between mb-4'>
              <p className='text-[12px] font-bold uppercase tracking-widest'>ĐƠN HÀNG GẦN ĐÂY</p>
              <button onClick={() => navigate('/admin/orders')} className='text-[12px] font-bold underline hover:text-[var(--color-text-secondary)]'>Xem tất cả</button>
            </div>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-[var(--color-border-secondary)]'>
                  {['MÃ ĐƠN','KHÁCH HÀNG','TRẠNG THÁI','GIÁ TRỊ'].map(h => (
                    <th key={h} className={`pb-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] ${h === 'GIÁ TRỊ' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(o => {
                  const st = statusColors[o.status] || statusColors.pending;
                  return (
                    <tr key={o.id} className='cursor-pointer border-b border-[var(--color-border-secondary)] hover:bg-[var(--color-hover-gray)] transition-colors' onClick={() => setSelectedOrder(o)}>
                      <td className='py-3'><span className='text-[12px] font-bold'>#{o.id.slice(-6).toUpperCase()}</span></td>
                      <td className='py-3 text-[12px] text-[var(--color-text-secondary)]'>{o.customer}</td>
                      <td className='py-3'>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${st.bg} ${st.text} ${st.border}`}>{st.label}</span>
                      </td>
                      <td className='py-3 text-right text-[12px] font-bold tabular-nums'>{o.total.toLocaleString('vi-VN')}đ</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Right Column */}
          <div className='space-y-4'>
            {/* Chart */}
            <div className='bg-[var(--color-nike-white)] rounded-[20px] p-6 border border-[var(--color-border-secondary)]'>
              <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-6'>BIỂU ĐỒ DOANH THU · 30 NGÀY</p>
              <div className='h-[140px]'>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis 
                      dataKey="_id" 
                      tickFormatter={(val) => {
                        const dayNum = parseInt(val.split('-')[2]);
                        return dayNum === 1 || dayNum % 5 === 0 ? dayNum : '';
                      }} 
                      tick={{fontSize: 10, fontWeight: 'bold', fill: 'var(--color-text-secondary)'}}
                      axisLine={false} 
                      tickLine={false}
                      dy={10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--color-light-gray)'}} />
                    <Bar dataKey="revenue" radius={[2, 2, 0, 0]}>
                      {stats.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.revenue === maxRev && entry.revenue > 0 ? 'var(--color-nike-black)' : entry.revenue > 0 ? 'var(--color-border-secondary)' : 'var(--color-light-gray)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className='mt-4 pt-4 flex items-center justify-between border-t border-[var(--color-border-secondary)]'>
                <span className='text-[12px] font-bold text-[var(--color-text-secondary)]'>Doanh thu tháng</span>
                <span className='text-[14px] font-black tabular-nums'>{stats.revenue.month.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* CTA */}
            <div className='cursor-pointer group bg-[var(--color-nike-black)] text-[var(--color-nike-white)] rounded-[20px] p-6' onClick={() => navigate('/admin/reports')}>
              <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2'>BÁO CÁO CHI TIẾT</p>
              <p className='text-[16px] font-bold mb-4'>Xem phân tích chuyên sâu về doanh thu</p>
              <span className='text-[12px] font-bold inline-flex items-center gap-1.5 group-hover:underline'>
                Khám phá ngay
                <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3'/></svg>
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {selectedOrder && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--color-nike-black)]/40 backdrop-blur-sm'>
          <div className='w-full max-w-2xl bg-[var(--color-nike-white)] rounded-[20px] overflow-hidden'>
            <div className='px-6 py-4 flex items-center justify-between border-b border-[var(--color-border-secondary)]'>
              <div>
                <h2 className='text-[18px] font-bold'>Đơn hàng <span className='font-mono'>#{selectedOrder.id.slice(-6).toUpperCase()}</span></h2>
                <p className='text-[12px] text-[var(--color-text-secondary)] mt-0.5'>{new Date(selectedOrder.date).toLocaleDateString('vi-VN')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className='w-10 h-10 rounded-full bg-[var(--color-light-gray)] hover:bg-[var(--color-hover-gray)] flex items-center justify-center cursor-pointer transition-colors'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12'/></svg>
              </button>
            </div>
            <div className='p-6 space-y-4 max-h-[60vh] overflow-y-auto'>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className='flex items-center gap-4 py-3 border-b border-[var(--color-border-secondary)]'>
                  <div className='w-16 h-16 bg-[var(--color-light-gray)] shrink-0 p-2 flex items-center justify-center'>
                    <img src={item.image} alt={item.name} className='w-full h-full object-contain mix-blend-multiply' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[14px] font-bold truncate'>{item.name}</p>
                    <p className='text-[12px] text-[var(--color-text-secondary)]'>SL: {item.quantity}</p>
                  </div>
                  <p className='text-[14px] font-bold'>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                </div>
              ))}
              <div className='grid grid-cols-2 gap-4 pt-4'>
                <div className='bg-[var(--color-snow)] p-5 border border-[var(--color-border-secondary)] rounded-[12px]'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2'>Khách hàng</p>
                  <p className='text-[14px] font-bold'>{selectedOrder.shippingInfo?.fullName || selectedOrder.customer}</p>
                  <p className='text-[12px] text-[var(--color-text-secondary)] mt-1'>{selectedOrder.shippingInfo?.phone || 'N/A'}</p>
                  {selectedOrder.shippingInfo && (
                    <p className='text-[12px] text-[var(--color-text-secondary)] mt-2 leading-relaxed'>
                      {selectedOrder.shippingInfo.street}, {selectedOrder.shippingInfo.ward}, {selectedOrder.shippingInfo.district}, {selectedOrder.shippingInfo.city}
                    </p>
                  )}
                </div>
                <div className='bg-[var(--color-snow)] p-5 border border-[var(--color-border-secondary)] rounded-[12px]'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2'>Thanh toán</p>
                  <p className='text-[14px] font-bold'>{selectedOrder.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán Online'}</p>
                </div>
              </div>
            </div>
            <div className='px-6 py-5 bg-[var(--color-snow)] flex items-center justify-between border-t border-[var(--color-border-secondary)]'>
              <p className='text-[12px] font-bold uppercase tracking-widest'>Tổng thanh toán</p>
              <p className='text-[24px] font-black tabular-nums'>{selectedOrder.total.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

