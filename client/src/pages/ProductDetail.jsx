import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SizeSelector from '../components/SizeSelector';
import ProductCard from '../components/ProductCard';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import {
  getProductBySlugAPI,
  getRelatedProductsAPI,
  addReviewAPI,
} from '../services/productService';
import { toggleWishlistAPI } from '../services/authService';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('desc'); // 'desc' | 'reviews'
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await getProductBySlugAPI(slug);
        setProduct(data.data);
        setSize(null);

        const rel = await getRelatedProductsAPI(data.data._id);
        setRelated(rel.data.data);
      } catch {
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, navigate]);

  const handleAddToCart = () => {
    if (!size) return toast.error('Vui lòng chọn size!');
    addItem({ ...product, selectedSize: size }, qty);
    toast.success(`Đã thêm vào giỏ hàng!`);
  };

  const handleWishlist = async () => {
    if (!user) return navigate('/auth');
    try {
      await toggleWishlistAPI(product._id);
      toast.success('Đã cập nhật danh sách yêu thích!');
    } catch {
      toast.error('Có lỗi xảy ra!');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/auth');
    if (!review.comment.trim())
      return toast.error('Vui lòng nhập nội dung đánh giá!');
    setSubmitting(true);
    try {
      await addReviewAPI(product._id, review);
      toast.success('Đánh giá đã được gửi!');
      setReview({ rating: 5, comment: '' });
      const { data } = await getProductBySlugAPI(slug);
      setProduct(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className='max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12'>
        <div className='bg-zinc-100 rounded-2xl aspect-square animate-pulse' />
        <div className='space-y-4'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='bg-zinc-100 rounded h-8 animate-pulse' />
          ))}
        </div>
      </div>
    );

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div className='bg-white'>
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* ── Images ─────────────────────────────────────── */}
          <div>
            <div className='rounded-2xl overflow-hidden bg-zinc-100 aspect-square mb-4'>
              <img
                src={product.images[imgIdx]}
                alt={product.name}
                className='w-full h-full object-cover'
              />
            </div>
            {product.images.length > 1 && (
              <div className='flex gap-3'>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                      imgIdx === i ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt=''
                      className='w-full h-full object-cover'
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ───────────────────────────────────────── */}
          <div>
            {/* Badges */}
            <div className='flex gap-2 mb-3'>
              <span className='text-xs font-bold bg-black text-white px-3 py-1 rounded-full'>
                {product.tier}
              </span>
              <span className='text-xs font-bold bg-zinc-200 text-black px-3 py-1 rounded-full'>
                {product.surfaceType}
              </span>
              <span className='text-xs font-bold bg-zinc-200 text-black px-3 py-1 rounded-full'>
                {product.category}
              </span>
            </div>

            <h1 className='text-2xl md:text-3xl font-black text-gray-900 mb-2'>
              {product.name}
            </h1>

            {/* Rating */}
            <div className='flex items-center gap-2 mb-4'>
              <div className='flex'>
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-yellow-400' : 'text-zinc-200'}`}
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                ))}
              </div>
              <span className='text-sm text-zinc-400'>
                {product.rating} ({product.numReviews} đánh giá)
              </span>
            </div>

            {/* Price */}
            <div className='flex items-center gap-3 mb-6'>
              <span className='text-3xl font-black'>
                {product.price.toLocaleString('vi-VN')}đ
              </span>
              {product.originalPrice && (
                <>
                  <span className='text-lg text-zinc-400 line-through'>
                    {product.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                  <span className='bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Size */}
            <div className='mb-6'>
              <SizeSelector
                sizes={product.sizes}
                selected={size}
                onChange={setSize}
              />
            </div>

            {/* Qty */}
            <div className='flex items-center gap-4 mb-6'>
              <span className='text-sm font-bold'>Số lượng:</span>
              <div className='flex items-center border border-zinc-300 rounded-full overflow-hidden'>
                <button
                  onClick={() => setQty((q) => Math.max(q - 1, 1))}
                  className='w-9 h-9 flex items-center justify-center text-lg hover:bg-zinc-100 transition'
                >
                  −
                </button>
                <span className='w-10 text-center text-sm font-bold'>
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className='w-9 h-9 flex items-center justify-center text-lg hover:bg-zinc-100 transition'
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-3 mb-6'>
              <button
                onClick={handleAddToCart}
                disabled={product.totalStock === 0}
                className='flex-1 bg-black text-white font-black py-4 rounded-full text-sm uppercase tracking-widest hover:bg-zinc-800 transition disabled:opacity-40 disabled:cursor-not-allowed'
              >
                {product.totalStock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
              </button>
              <button
                onClick={handleWishlist}
                className='w-14 h-14 rounded-full border-2 border-zinc-300 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
                </svg>
              </button>
            </div>

            {/* Shipping info */}
            <div className='bg-zinc-50 rounded-xl p-4 space-y-2 text-sm text-zinc-600'>
              <p>🚚 Miễn phí vận chuyển cho đơn từ 1.500.000đ</p>
              <p>↩️ Đổi trả trong 30 ngày</p>
              <p>✅ Hàng chính hãng 100%</p>
            </div>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────── */}
        <div className='mt-16 border-b border-zinc-200'>
          <div className='flex gap-8'>
            {[
              { key: 'desc', label: 'Mô tả' },
              { key: 'reviews', label: `Đánh giá (${product.numReviews})` },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`pb-3 text-sm font-bold uppercase tracking-wide border-b-2 transition ${
                  tab === t.key
                    ? 'border-black text-black'
                    : 'border-transparent text-zinc-400 hover:text-black'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        {tab === 'desc' && (
          <div className='py-8 max-w-2xl'>
            <p className='text-zinc-600 leading-relaxed'>
              {product.description}
            </p>
            <div className='mt-6 grid grid-cols-2 gap-4'>
              {[
                { label: 'Phân khúc', value: product.tier },
                { label: 'Loại sân', value: product.surfaceType },
                { label: 'Dòng giày', value: product.category },
                { label: 'Màu sắc', value: product.color || '—' },
              ].map((r) => (
                <div key={r.label} className='bg-zinc-50 rounded-xl p-4'>
                  <p className='text-xs text-zinc-400 uppercase tracking-wide mb-1'>
                    {r.label}
                  </p>
                  <p className='font-bold text-sm'>{r.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {tab === 'reviews' && (
          <div className='py-8 max-w-2xl space-y-6'>
            {/* Write review */}
            {user ? (
              <form
                onSubmit={handleReview}
                className='bg-zinc-50 rounded-2xl p-6 space-y-4'
              >
                <h4 className='font-black text-sm uppercase tracking-wide'>
                  Viết đánh giá
                </h4>
                <div className='flex gap-2'>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type='button'
                      onClick={() => setReview((r) => ({ ...r, rating: s }))}
                    >
                      <svg
                        className={`w-6 h-6 ${s <= review.rating ? 'text-yellow-400' : 'text-zinc-300'}`}
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  placeholder='Nhận xét của bạn...'
                  value={review.comment}
                  onChange={(e) =>
                    setReview((r) => ({ ...r, comment: e.target.value }))
                  }
                  className='w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-black resize-none'
                />
                <button
                  type='submit'
                  disabled={submitting}
                  className='bg-black text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-zinc-800 transition disabled:opacity-50'
                >
                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </form>
            ) : (
              <div className='bg-zinc-50 rounded-2xl p-6 text-center'>
                <p className='text-zinc-500 text-sm mb-3'>
                  Đăng nhập để viết đánh giá
                </p>
                <button
                  onClick={() => navigate('/auth')}
                  className='bg-black text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-zinc-800 transition'
                >
                  Đăng nhập
                </button>
              </div>
            )}

            {/* Review list */}
            {product.reviews.length === 0 ? (
              <p className='text-zinc-400 text-sm text-center py-8'>
                Chưa có đánh giá nào.
              </p>
            ) : (
              product.reviews.map((r) => (
                <div key={r._id} className='border-b border-zinc-100 pb-4'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold'>
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className='text-sm font-bold'>{r.name}</p>
                      <div className='flex'>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg
                            key={s}
                            className={`w-3 h-3 ${s <= r.rating ? 'text-yellow-400' : 'text-zinc-200'}`}
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className='ml-auto text-xs text-zinc-400'>
                      {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className='text-sm text-zinc-600 ml-11'>{r.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Related ───────────────────────────────────────── */}
        {related.length > 0 && (
          <div className='mt-16'>
            <h3 className='text-2xl font-black uppercase tracking-wide mb-6'>
              Sản phẩm liên quan
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
