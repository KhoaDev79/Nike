import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderByIdAPI } from '../services/orderService';

const STATUS_MAP = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Đã huỷ', color: 'bg-red-100 text-red-700' },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getOrderByIdAPI(id);
        setOrder(data.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading)
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin' />
      </div>
    );

  if (!order)
    return (
      <div className='text-center py-20'>
        <p className='text-zinc-400'>Không tìm thấy đơn hàng.</p>
        <Link to='/shop' className='text-black font-bold underline mt-4 block'>
          Về cửa hàng
        </Link>
      </div>
    );

  const st = STATUS_MAP[order.orderStatus];

  return (
    <div className='min-h-screen bg-zinc-50'>
      <div className='max-w-3xl mx-auto px-4 py-10'>
        {/* Success banner */}
        <div className='bg-green-50 border border-green-200 rounded-2xl p-6 text-center mb-8'>
          <span className='text-4xl block mb-2'>🎉</span>
          <h1 className='text-xl font-black text-green-800 mb-1'>
            Đặt hàng thành công!
          </h1>
          <p className='text-green-600 text-sm'>
            Mã đơn hàng: <strong className='font-mono'>{order._id}</strong>
          </p>
        </div>

        {/* Status */}
        <div className='bg-white rounded-2xl p-6 shadow-sm mb-4'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='font-black text-sm uppercase tracking-wide'>
              Trạng thái đơn hàng
            </h2>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${st.color}`}
            >
              {st.label}
            </span>
          </div>
          <p className='text-xs text-zinc-400'>
            Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>

        {/* Items */}
        <div className='bg-white rounded-2xl p-6 shadow-sm mb-4'>
          <h2 className='font-black text-sm uppercase tracking-wide mb-4'>
            Sản phẩm
          </h2>
          <div className='space-y-3'>
            {order.items.map((item, i) => (
              <div key={i} className='flex gap-3 items-center'>
                <img
                  src={item.image}
                  alt={item.name}
                  className='w-14 h-14 object-cover rounded-xl bg-zinc-100 shrink-0'
                />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-bold line-clamp-1'>{item.name}</p>
                  <p className='text-xs text-zinc-400'>
                    Size EU {item.size} · SL: {item.quantity}
                  </p>
                </div>
                <p className='text-sm font-black shrink-0'>
                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className='bg-white rounded-2xl p-6 shadow-sm mb-6'>
          <h2 className='font-black text-sm uppercase tracking-wide mb-4'>
            Tổng kết
          </h2>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between text-zinc-500'>
              <span>Tạm tính</span>
              <span>{order.itemsPrice.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className='flex justify-between text-zinc-500'>
              <span>Vận chuyển</span>
              <span>
                {order.shippingPrice === 0
                  ? 'Miễn phí'
                  : `${order.shippingPrice.toLocaleString('vi-VN')}đ`}
              </span>
            </div>
            <div className='flex justify-between font-black text-base border-t pt-2 mt-2'>
              <span>Tổng cộng</span>
              <span>{order.totalPrice.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </div>

        <div className='flex gap-3'>
          <Link
            to='/shop'
            className='flex-1 bg-black text-white font-black py-3 rounded-full text-sm text-center hover:bg-zinc-800 transition'
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            to='/orders'
            className='flex-1 border-2 border-black font-black py-3 rounded-full text-sm text-center hover:bg-black hover:text-white transition'
          >
            Đơn hàng của tôi
          </Link>
        </div>
      </div>
    </div>
  );
}
