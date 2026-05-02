import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getAllOrdersAPI, updateOrderStatusAPI, getAdminStatsAPI } from '../../api/orderApi';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';

const statusColors = {
  pending: { label: 'Chờ xác nhận', bg: 'bg-[var(--color-warning-yellow)]', text: 'text-[var(--color-nike-black)]', border: 'border-[var(--color-nike-black)]', hover: 'hover:bg-[var(--color-warning-yellow)] hover:text-[var(--color-nike-black)] hover:border-[var(--color-nike-black)]' },
  confirmed: { label: 'Đã xác nhận', bg: 'bg-[var(--color-light-gray)]', text: 'text-[var(--color-nike-black)]', border: 'border-[var(--color-border-secondary)]', hover: 'hover:bg-[var(--color-light-gray)] hover:text-[var(--color-nike-black)] hover:border-[var(--color-nike-black)]' },
  shipping: { label: 'Đang giao', bg: 'bg-[var(--color-link-blue)]', text: 'text-[var(--color-nike-white)]', border: 'border-transparent', hover: 'hover:bg-[var(--color-link-blue)] hover:text-[var(--color-nike-white)] hover:border-[var(--color-link-blue)]' },
  delivered: { label: 'Đã giao', bg: 'bg-[var(--color-success-green)]', text: 'text-[var(--color-nike-white)]', border: 'border-transparent', hover: 'hover:bg-[var(--color-success-green)] hover:text-[var(--color-nike-white)] hover:border-[var(--color-success-green)]' },
  cancelled: { label: 'Đã hủy', bg: 'bg-[var(--color-nike-red)]', text: 'text-[var(--color-nike-white)]', border: 'border-transparent', hover: 'hover:bg-[var(--color-nike-red)] hover:text-[var(--color-nike-white)] hover:border-[var(--color-nike-red)]' },
};

export default function AdminOrdersPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Filters
  const [filter, setFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  const filtered = orders.filter(o => {
    const matchText = o._id.toLowerCase().includes(filter.toLowerCase()) || o.shippingInfo?.fullName?.toLowerCase().includes(filter.toLowerCase());
    
    let matchDate = true;
    const orderDate = new Date(o.createdAt).getTime();
    if (startDate) {
      const sDate = new Date(startDate);
      sDate.setHours(0, 0, 0, 0);
      matchDate = matchDate && orderDate >= sDate.getTime();
    }
    if (endDate) {
      const eDate = new Date(endDate);
      eDate.setHours(23, 59, 59, 999);
      matchDate = matchDate && orderDate <= eDate.getTime();
    }
    
    return matchText && matchDate;
  });

  const handleExportCSV = () => {
    const headers = ['Mã Đơn', 'Khách Hàng', 'SĐT', 'Địa Chỉ', 'Ngày Đặt', 'Trạng Thái', 'Tổng Tiền'];
    const rows = filtered.map(o => [
      o._id.slice(-6).toUpperCase(),
      `"${o.shippingInfo?.fullName || ''}"`,
      `"${o.shippingInfo?.phone || ''}"`,
      `"${o.shippingInfo?.street}, ${o.shippingInfo?.ward}, ${o.shippingInfo?.district}, ${o.shippingInfo?.city}"`,
      new Date(o.createdAt).toLocaleDateString('vi-VN'),
      statusColors[o.orderStatus]?.label || 'Khác',
      o.totalPrice
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + headers.join(',') + "\n"
      + rows.map(r => r.join(',')).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DonHang_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Đã xuất file CSV');
  };

  return (
    <div className='min-h-screen relative bg-[var(--color-light-gray)] text-[var(--color-text-primary)]'>
      <AdminSidebar stats={stats} />
      <main className='ml-[200px] p-6 lg:p-8 xl:p-10 relative z-10'>
        <div className='flex flex-col lg:flex-row lg:items-end justify-between mb-6 gap-4'>
          <div>
            <h1 className='text-[24px] font-bold tracking-tight'>Quản lý đơn hàng</h1>
            <p className='text-[14px] text-[var(--color-text-secondary)] mt-0.5'>Kiểm soát và xử lý các đơn hàng.</p>
          </div>
          
          <div className='flex flex-wrap items-center gap-3'>
            {/* Date Filters */}
            <div className='flex items-center gap-2 bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] rounded-[24px] px-4 py-2.5'>
              <input type='date' value={startDate} onChange={e => setStartDate(e.target.value)}
                className='text-[12px] font-bold text-[var(--color-text-secondary)] outline-none bg-transparent cursor-pointer' />
              <span className='text-[12px] text-[var(--color-text-secondary)]'>-</span>
              <input type='date' value={endDate} onChange={e => setEndDate(e.target.value)}
                className='text-[12px] font-bold text-[var(--color-text-secondary)] outline-none bg-transparent cursor-pointer' />
            </div>

            {/* Search */}
            <div className='relative'>
              <input type='text' placeholder='Tìm mã đơn, tên...' value={filter} onChange={e => setFilter(e.target.value)}
                className='text-[14px] bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] outline-none pl-9 pr-4 py-2.5 rounded-[24px] w-64 focus:border-[var(--color-nike-black)] focus:ring-1 focus:ring-[var(--color-nike-black)] transition-colors' />
              <svg className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/></svg>
            </div>

            {/* Actions */}
            <button onClick={handleExportCSV} className='flex items-center gap-2 px-6 py-2.5 rounded-[30px] text-[14px] font-bold bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] hover:border-[var(--color-nike-black)] transition-colors cursor-pointer'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'/></svg>
              Xuất CSV
            </button>
            <button onClick={fetchOrders} className='w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] hover:border-[var(--color-nike-black)] transition-colors cursor-pointer'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'/></svg>
            </button>
          </div>
        </div>

        <div className='bg-[var(--color-nike-white)] rounded-[20px] border border-[var(--color-border-secondary)] overflow-hidden'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-[var(--color-border-secondary)] bg-[var(--color-snow)]'>
                {['MÃ ĐƠN','KHÁCH HÀNG','NGÀY ĐẶT','TỔNG TIỀN','TRẠNG THÁI',''].map(h => (
                  <th key={h} className={`px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] ${h === 'TỔNG TIỀN' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className='py-20 text-center text-[12px] font-bold text-[var(--color-text-secondary)]'>Đang tải...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className='py-20 text-center text-[12px] font-bold text-[var(--color-text-secondary)]'>Không có đơn hàng</td></tr>
              ) : filtered.map(order => {
                const st = statusColors[order.orderStatus] || statusColors.pending;
                return (
                  <tr key={order._id} className='cursor-pointer border-b border-[var(--color-border-secondary)] hover:bg-[var(--color-hover-gray)] transition-colors'
                    onClick={() => setSelectedOrder(order)}>
                    <td className='px-6 py-4'><span className='text-[12px] font-bold'>#{order._id.slice(-6).toUpperCase()}</span></td>
                    <td className='px-6 py-4'>
                      <p className='text-[12px] font-bold'>{order.shippingInfo?.fullName}</p>
                      <p className='text-[10px] text-[var(--color-text-secondary)] mt-0.5'>{order.shippingInfo?.phone}</p>
                    </td>
                    <td className='px-6 py-4 text-[12px] text-[var(--color-text-secondary)]'>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className='px-6 py-4 text-right text-[12px] font-bold tabular-nums'>{order.totalPrice.toLocaleString('vi-VN')}đ</td>
                    <td className='px-6 py-4'>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${st.bg} ${st.text} ${st.border}`}>{st.label}</span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <div className='w-8 h-8 rounded-full flex items-center justify-center ml-auto bg-[var(--color-light-gray)] text-[var(--color-text-primary)]'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7'/></svg>
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
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--color-nike-black)]/40 backdrop-blur-sm'>
          <div className='w-full max-w-4xl bg-[var(--color-nike-white)] rounded-[20px] overflow-hidden flex flex-col md:flex-row max-h-[85vh]'>
            {/* Left: Details */}
            <div className='flex-1 p-6 overflow-y-auto border-b md:border-b-0 md:border-r border-[var(--color-border-secondary)]'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h2 className='text-[18px] font-bold'>Đơn hàng <span className='font-mono'>#{selectedOrder._id.slice(-6).toUpperCase()}</span></h2>
                  <p className='text-[12px] text-[var(--color-text-secondary)] mt-0.5'>{new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                {(() => {
                  const st = statusColors[selectedOrder.orderStatus] || statusColors.pending;
                  return (
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${st.bg} ${st.text} ${st.border}`}>
                      {st.label}
                    </span>
                  );
                })()}
              </div>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className='flex items-center gap-4 py-4 border-b border-[var(--color-border-secondary)]'>
                  <div className='w-16 h-16 bg-[var(--color-light-gray)] rounded-[8px] shrink-0 p-2 flex items-center justify-center'>
                    <img src={item.image} alt={item.name} className='w-full h-full object-contain mix-blend-multiply' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[14px] font-bold truncate'>{item.name}</p>
                    <p className='text-[12px] text-[var(--color-text-secondary)] mt-1'>Size: {item.size} · SL: {item.quantity}</p>
                  </div>
                  <p className='text-[14px] font-bold tabular-nums'>{item.price.toLocaleString('vi-VN')}đ</p>
                </div>
              ))}
              <div className='mt-6 p-5 bg-[var(--color-snow)] border border-[var(--color-border-secondary)] rounded-[12px]'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2'>Giao hàng</p>
                <p className='text-[14px] font-bold'>{selectedOrder.shippingInfo?.fullName}</p>
                <p className='text-[12px] text-[var(--color-text-secondary)] mt-1'>{selectedOrder.shippingInfo?.phone}</p>
                <p className='text-[12px] text-[var(--color-text-secondary)] mt-2 leading-relaxed'>
                  {selectedOrder.shippingInfo?.street}, {selectedOrder.shippingInfo?.ward}, {selectedOrder.shippingInfo?.district}, {selectedOrder.shippingInfo?.city}
                </p>
              </div>
              <div className='mt-6 flex items-center justify-between'>
                <span className='text-[12px] font-bold uppercase tracking-widest'>Tổng</span>
                <span className='text-[24px] font-black tabular-nums'>{selectedOrder.totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
            {/* Right: Actions */}
            <div className='w-full md:w-[280px] bg-[var(--color-snow)] p-6 flex flex-col'>
              <div className='flex justify-end mb-6'>
                <button onClick={() => setSelectedOrder(null)} className='w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-light-gray)] hover:bg-[var(--color-hover-gray)] transition-colors cursor-pointer'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12'/></svg>
                </button>
              </div>
              <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-4'>CẬP NHẬT TRẠNG THÁI</p>
              <div className='space-y-2 flex-1'>
                {Object.entries(statusColors).map(([key, val]) => {
                  const isActive = selectedOrder.orderStatus === key;
                  return (
                    <button key={key} onClick={() => handleUpdateStatus(selectedOrder._id, key)}
                      className={`w-full py-3 px-4 rounded-[12px] text-[10px] font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer flex items-center justify-between border ${
                        isActive 
                          ? `${val.bg} ${val.text} ${val.border}` 
                          : `bg-[var(--color-nike-white)] text-[var(--color-text-secondary)] border-[var(--color-border-secondary)] ${val.hover}`
                      }`}
                    >
                      {val.label}
                      {isActive && <div className='w-2 h-2 rounded-full bg-current' />}
                    </button>
                  );
                })}
              </div>
              <div className='mt-6 p-5 bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] rounded-[12px]'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2'>Giao dịch</p>
                <p className='text-[14px] font-bold'>{selectedOrder.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Thanh toán Online'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
