import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    api.get('/orders/my')
      .then((res) => {
        setOrders(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Lỗi khi tải danh sách đơn hàng!');
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className='py-20 text-center min-h-screen'>
        <h2 className='text-2xl font-black mb-4'>Vui lòng đăng nhập</h2>
        <Link to='/auth' className='bg-black text-white px-8 py-3 rounded-full font-bold inline-block'>Đăng nhập ngay</Link>
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto px-4 py-10 min-h-[70vh]'>
      <h1 className='text-3xl font-black uppercase tracking-widest mb-8'>Đơn hàng của tôi</h1>
      {loading ? (
        <div className='animate-pulse space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='bg-zinc-100 h-24 rounded-2xl'></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className='text-center py-20 bg-zinc-50 rounded-3xl'>
          <p className='text-zinc-500 mb-6'>Bạn chưa có đơn hàng nào.</p>
          <Link to='/shop' className='bg-black text-white px-8 py-3 rounded-full font-bold inline-block hover:scale-105 transition-transform'>Mua sắm ngay</Link>
        </div>
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => (
            <div key={order._id} className='bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-black transition-colors'>
              <div>
                <p className='text-xs text-zinc-500 mb-1'>Mã đơn: <span className='font-mono text-black font-bold'>{order._id}</span></p>
                <p className='text-sm font-bold'>{new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN')}</p>
                <div className='flex items-center gap-2 mt-3'>
                  <span className={`px-3 py-1 text-xs font-black uppercase rounded-full tracking-wider ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.orderStatus}
                  </span>
                  <span className='text-xs font-bold text-zinc-500 px-3 py-1 bg-zinc-100 rounded-full'>{order.items.length} sản phẩm</span>
                </div>
              </div>
              <div className='flex flex-col md:items-end w-full md:w-auto gap-3 mt-4 md:mt-0'>
                <p className='text-xl font-black'>{order.totalPrice.toLocaleString('vi-VN')}đ</p>
                <Link to={`/orders/${order._id}`} className='text-sm underline font-bold hover:text-zinc-500 transition-colors'>Xem chi tiết →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
