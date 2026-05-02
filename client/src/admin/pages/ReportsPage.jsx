import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getAdminStatsAPI, getDetailedReportsAPI } from '../../api/orderApi';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
    <div className='min-h-screen relative bg-[var(--color-light-gray)] text-[var(--color-text-primary)]'>
      <AdminSidebar stats={stats} />
      <main className='ml-[200px] p-6 lg:p-8 xl:p-10 relative z-10'>
        <div className='mb-6'>
          <h1 className='text-[24px] font-bold tracking-tight'>Báo cáo doanh thu</h1>
          <p className='text-[14px] text-[var(--color-text-secondary)] mt-0.5'>Phân tích hiệu quả kinh doanh và sản phẩm bán chạy.</p>
        </div>

        {loading ? (
          <div className='flex items-center justify-center py-32'>
            <div className='w-8 h-8 border-2 border-[var(--color-nike-black)] border-t-transparent rounded-full animate-spin' />
          </div>
        ) : (
          <div className='space-y-4'>
            {/* Revenue Chart Card */}
            <div className='bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] rounded-[20px] p-6'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2'>DOANH THU 30 NGÀY QUA</p>
                  <p className='text-[36px] font-black tabular-nums'>{stats?.revenue?.month?.toLocaleString('vi-VN')}đ</p>
                </div>
                <span className='text-[10px] font-bold px-3 py-1.5 rounded-[6px] bg-[var(--color-nike-black)] text-[var(--color-nike-white)] tracking-widest uppercase'>THÁNG NÀY</span>
              </div>
              <div className='h-[200px] mt-4'>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reports?.salesByDay || []} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                      {(reports?.salesByDay || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.revenue === maxRev && entry.revenue > 0 ? 'var(--color-nike-black)' : entry.revenue > 0 ? 'var(--color-border-secondary)' : 'var(--color-light-gray)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Row */}
            <div className='grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4'>
              {/* Top Products */}
              <div className='bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] rounded-[20px] p-6'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-6'>SẢN PHẨM BÁN CHẠY</p>
                <div className='space-y-4'>
                  {reports?.topProducts?.map((p, i) => (
                    <div key={i} className='flex items-center gap-4 py-3 border-b border-[var(--color-border-secondary)] last:border-0 last:pb-0'>
                      <div className='w-16 h-16 rounded-[8px] overflow-hidden shrink-0 p-2 flex items-center justify-center bg-[var(--color-light-gray)]'>
                        <img src={p.image} className='w-full h-full object-contain mix-blend-multiply' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-[14px] font-bold truncate'>{p.name}</p>
                        <p className='text-[12px] text-[var(--color-text-secondary)] mt-1'>{p.totalQty} đã bán</p>
                      </div>
                      <p className='text-[14px] font-black tabular-nums'>{p.totalRevenue.toLocaleString('vi-VN')}đ</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Column */}
              <div className='space-y-4'>
                {/* Avg Order Value */}
                <div className='bg-[var(--color-nike-black)] text-[var(--color-nike-white)] rounded-[20px] p-6'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2'>GIÁ TRỊ ĐƠN TRUNG BÌNH</p>
                  <p className='text-[36px] font-black tabular-nums'>{avgOrder.toLocaleString('vi-VN')}đ</p>
                  <p className='text-[12px] mt-2 text-[var(--color-text-secondary)]'>Tối ưu hoá giỏ hàng hiệu quả</p>
                </div>
                {/* Two cards */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] rounded-[20px] p-6'>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2'>ĐƠN HÀNG</p>
                    <p className='text-[28px] font-black tabular-nums'>{stats?.orders?.total}</p>
                  </div>
                  <div className='bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] rounded-[20px] p-6'>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2'>TỔNG KHÁCH</p>
                    <p className='text-[28px] font-black tabular-nums'>{stats?.customers}</p>
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
