import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { createOrderAPI } from '../services/orderService';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { value: 'cod', label: '💵 Thanh toán khi nhận hàng (COD)' },
  { value: 'bank_transfer', label: '🏦 Chuyển khoản ngân hàng' },
  { value: 'vnpay', label: '💳 Thanh toán VNPay' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, totalPrice } = useCartStore();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    street: '',
    ward: '',
    district: '',
    city: '',
    note: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const total = totalPrice();
  const shippingFee = total >= 1_500_000 ? 0 : 30_000;
  const grandTotal = total + shippingFee;

  if (!user) {
    navigate('/auth');
    return null;
  }
  if (items.length === 0) {
    navigate('/shop');
    return null;
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const required = [
      'fullName',
      'phone',
      'email',
      'street',
      'ward',
      'district',
      'city',
    ];
    const errs = {};
    required.forEach((k) => {
      if (!form[k].trim()) errs[k] = 'Không được để trống';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        product: i._id,
        size: i.selectedSize,
        quantity: i.quantity,
      }));
      const { data } = await createOrderAPI({
        items: orderItems,
        shippingInfo: { ...form },
        paymentMethod,
        note: form.note,
      });
      clearCart();
      toast.success('Đặt hàng thành công! 🎉');
      navigate(`/orders/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đặt hàng thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-3 text-sm outline-none transition ${
      errors[field] ? 'border-red-400' : 'border-zinc-300 focus:border-black'
    }`;

  return (
    <div className='min-h-screen bg-zinc-50'>
      <div className='max-w-6xl mx-auto px-4 py-10'>
        <h1 className='text-2xl font-black uppercase tracking-widest mb-8'>
          Thanh toán
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* ── Form ──────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className='lg:col-span-2 space-y-6'>
            {/* Thông tin giao hàng */}
            <div className='bg-white rounded-2xl p-6 shadow-sm'>
              <h2 className='font-black text-sm uppercase tracking-wide mb-5'>
                Thông tin giao hàng
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {[
                  { name: 'fullName', label: 'Họ và tên', span: 2 },
                  { name: 'phone', label: 'Số điện thoại' },
                  { name: 'email', label: 'Email', type: 'email' },
                  { name: 'street', label: 'Địa chỉ', span: 2 },
                  { name: 'ward', label: 'Phường/Xã' },
                  { name: 'district', label: 'Quận/Huyện' },
                  { name: 'city', label: 'Tỉnh/Thành phố', span: 2 },
                ].map((f) => (
                  <div
                    key={f.name}
                    className={f.span === 2 ? 'sm:col-span-2' : ''}
                  >
                    <label className='text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1.5 block'>
                      {f.label}
                    </label>
                    <input
                      name={f.name}
                      type={f.type || 'text'}
                      value={form[f.name]}
                      onChange={handleChange}
                      className={inputClass(f.name)}
                    />
                    {errors[f.name] && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors[f.name]}
                      </p>
                    )}
                  </div>
                ))}
                <div className='sm:col-span-2'>
                  <label className='text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1.5 block'>
                    Ghi chú
                  </label>
                  <textarea
                    name='note'
                    rows={2}
                    value={form.note}
                    onChange={handleChange}
                    placeholder='Ghi chú thêm cho đơn hàng...'
                    className='w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-black resize-none'
                  />
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className='bg-white rounded-2xl p-6 shadow-sm'>
              <h2 className='font-black text-sm uppercase tracking-wide mb-5'>
                Phương thức thanh toán
              </h2>
              <div className='space-y-3'>
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.value}
                    className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition ${
                      paymentMethod === m.value
                        ? 'border-black bg-zinc-50'
                        : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <input
                      type='radio'
                      name='payment'
                      value={m.value}
                      checked={paymentMethod === m.value}
                      onChange={() => setPaymentMethod(m.value)}
                      className='accent-black'
                    />
                    <span className='text-sm font-medium'>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-black text-white font-black py-4 rounded-full text-sm uppercase tracking-widest hover:bg-zinc-800 transition disabled:opacity-50'
            >
              {loading
                ? 'Đang xử lý...'
                : `Đặt hàng — ${grandTotal.toLocaleString('vi-VN')}đ`}
            </button>
          </form>

          {/* ── Order Summary ──────────────────────────────── */}
          <div className='space-y-4'>
            <div className='bg-white rounded-2xl p-6 shadow-sm sticky top-24'>
              <h2 className='font-black text-sm uppercase tracking-wide mb-5'>
                Đơn hàng ({items.length} sản phẩm)
              </h2>

              <div className='space-y-3 max-h-72 overflow-y-auto mb-4'>
                {items.map((item, i) => (
                  <div key={i} className='flex gap-3'>
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className='w-16 h-16 object-cover rounded-xl bg-zinc-100 shrink-0'
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='text-xs font-bold line-clamp-2'>
                        {item.name}
                      </p>
                      <p className='text-xs text-zinc-400 mt-0.5'>
                        Size EU {item.selectedSize} · SL: {item.quantity}
                      </p>
                      <p className='text-xs font-black mt-1'>
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='border-t border-zinc-100 pt-4 space-y-2 text-sm'>
                <div className='flex justify-between text-zinc-500'>
                  <span>Tạm tính</span>
                  <span>{total.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className='flex justify-between text-zinc-500'>
                  <span>Vận chuyển</span>
                  <span
                    className={
                      shippingFee === 0 ? 'text-green-600 font-bold' : ''
                    }
                  >
                    {shippingFee === 0
                      ? 'Miễn phí'
                      : `${shippingFee.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                <div className='flex justify-between font-black text-base border-t border-zinc-100 pt-2 mt-2'>
                  <span>Tổng cộng</span>
                  <span>{grandTotal.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
