import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getAdminStatsAPI, getDetailedReportsAPI } from '../../api/orderApi';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';

const glass = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 };
const muted = 'rgba(255,255,255,0.35)';

export default function AdminReportsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

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
        setStats(sR.data.data);
        setReports({ ...rR.data.data, salesByDay: filled });
      } catch { toast.error('Không thể tải báo cáo'); }
      finally { setLoading(false); }
    })();
  }, [user, navigate]);

  const maxRev = reports?.salesByDay?.reduce((m, d) => Math.max(m, d.revenue), 0) || 1;
  const avgOrder = stats?.orders?.total > 0 ? Math.round(stats.revenue.year / stats.orders.total) : 0;

  return (
    <div className='min-h-screen relative overflow-hidden' style={{ background: '#080b14', fontFamily: "'Inter',system-ui" }}>
      <div className='fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none' style={{ background: 'rgba(124,58,237,0.12)', filter: 'blur(80px)' }} />
      <div className='fixed bottom-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full pointer-events-none' style={{ background: 'rgba(13,148,136,0.1)', filter: 'blur(80px)' }} />
      <AdminSidebar stats={stats} />
      <main className='ml-[200px] p-6 lg:p-8 xl:p-10 relative z-10'>
        <div className='mb-6'>
          <h1 className='text-[18px] font-bold text-white' style={{ letterSpacing: '-0.03em' }}>Báo cáo doanh thu</h1>
          <p className='text-[12px] mt-0.5' style={{ color: muted }}>Phân tích hiệu quả kinh doanh và sản phẩm bán chạy.</p>
        </div>

        {loading ? (
          <div className='flex items-center justify-center py-32'>
            <div className='w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin' />
          </div>
        ) : (
          <div className='space-y-4'>
            {/* Revenue Chart Card */}
            <div style={{ ...glass, padding: 20 }}>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <p className='text-[10px] font-semibold uppercase tracking-[0.1em] mb-1' style={{ color: muted }}>DOANH THU 30 NGÀY QUA</p>
                  <p className='text-[32px] font-extrabold text-white' style={{ letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>{stats?.revenue?.month?.toLocaleString('vi-VN')}đ</p>
                </div>
                <span className='text-[10px] font-semibold px-3 py-1.5 rounded-full' style={{ background: '#111', color: '#fff' }}>THÁNG NÀY</span>
              </div>
              <div className='h-[200px] flex items-end gap-[2px] mt-4'>
                {reports?.salesByDay?.map((d, i) => {
                  const h = Math.max((d.revenue / maxRev) * 100, 4);
                  const isMax = d.revenue === maxRev && d.revenue > 0;
                  return (
                    <div key={i} className='flex-1 h-full flex flex-col justify-end group relative'>
                      <div className='w-full rounded-t-sm transition-all duration-200 cursor-pointer' style={{ height: `${h}%`, background: isMax ? 'linear-gradient(to top, #a78bfa, #2dd4bf)' : d.revenue > 0 ? 'rgba(167,139,250,0.25)' : 'rgba(167,139,250,0.06)' }}>
                        <div className='absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none' style={{ background: 'rgba(0,0,0,0.8)' }}>{d.revenue.toLocaleString('vi-VN')}đ</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Row */}
            <div className='grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4'>
              {/* Top Products */}
              <div style={{ ...glass, padding: 20 }}>
                <p className='text-[10px] font-semibold uppercase tracking-[0.1em] mb-4' style={{ color: muted }}>SẢN PHẨM BÁN CHẠY</p>
                <div className='space-y-1'>
                  {reports?.topProducts?.map((p, i) => (
                    <div key={i} className='flex items-center gap-4 py-3' style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className='w-12 h-12 rounded-lg overflow-hidden shrink-0 p-1 flex items-center justify-center' style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <img src={p.image} className='w-full h-full object-contain' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-[12px] font-medium text-white truncate'>{p.name}</p>
                        <p className='text-[10px]' style={{ color: muted }}>{p.totalQty} đã bán</p>
                      </div>
                      <p className='text-[12px] font-bold text-white' style={{ fontVariantNumeric: 'tabular-nums' }}>{p.totalRevenue.toLocaleString('vi-VN')}đ</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Column */}
              <div className='space-y-4'>
                {/* Avg Order Value */}
                <div className='relative overflow-hidden' style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.4), rgba(13,148,136,0.25))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 14, padding: 20 }}>
                  <p className='text-[10px] font-semibold uppercase tracking-[0.1em] mb-1' style={{ color: 'rgba(255,255,255,0.4)' }}>GIÁ TRỊ ĐƠN TRUNG BÌNH</p>
                  <p className='text-[32px] font-extrabold text-white' style={{ letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>{avgOrder.toLocaleString('vi-VN')}đ</p>
                  <p className='text-[10px] mt-1' style={{ color: 'rgba(255,255,255,0.35)' }}>Tối ưu hoá giỏ hàng hiệu quả</p>
                </div>
                {/* Two cards */}
                <div className='grid grid-cols-2 gap-4'>
                  <div style={{ ...glass, padding: 16 }}>
                    <p className='text-[10px] font-semibold uppercase tracking-[0.1em] mb-1' style={{ color: muted }}>ĐƠN HÀNG</p>
                    <p className='text-[28px] font-extrabold text-white' style={{ fontVariantNumeric: 'tabular-nums' }}>{stats?.orders?.total}</p>
                  </div>
                  <div style={{ ...glass, padding: 16 }}>
                    <p className='text-[10px] font-semibold uppercase tracking-[0.1em] mb-1' style={{ color: muted }}>TỔNG KHÁCH</p>
                    <p className='text-[28px] font-extrabold text-white' style={{ fontVariantNumeric: 'tabular-nums' }}>{stats?.customers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
