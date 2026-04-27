import { Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();

  const {
    _id,
    name,
    slug,
    price,
    originalPrice,
    images,
    tier,
    surfaceType,
    rating,
    numReviews,
    tags = [],
    totalStock,
    sizes = [],
  } = product;

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const tierColor =
    {
      Elite: 'bg-yellow-400 text-black',
      Pro: 'bg-blue-500 text-white',
      Academy: 'bg-zinc-500 text-white',
    }[tier] || 'bg-zinc-500 text-white';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const defaultSize = sizes.find((s) => s.stock > 0)?.size;
    if (!defaultSize) return;
    addItem({ ...product, selectedSize: defaultSize }, 1);
  };

  return (
    <Link
      to={`/product/${slug || _id}`}
      className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col'
    >
      {/* Image */}
      <div className='relative overflow-hidden bg-zinc-100 aspect-square'>
        <img
          src={images?.[0] || 'https://via.placeholder.com/400x400?text=Nike'}
          alt={name}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
        />

        {/* Badges */}
        <div className='absolute top-3 left-3 flex flex-col gap-1.5'>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tierColor}`}
          >
            {tier}
          </span>
          <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-black text-white'>
            {surfaceType}
          </span>
          {tags.includes('new') && (
            <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white'>
              NEW
            </span>
          )}
          {tags.includes('limited') && (
            <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white'>
              LIMITED
            </span>
          )}
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className='absolute top-3 right-3 bg-red-500 text-white text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center'>
            -{discount}%
          </div>
        )}

        {/* Out of stock */}
        {totalStock === 0 && (
          <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
            <span className='text-white font-bold text-sm tracking-widest uppercase'>
              Hết hàng
            </span>
          </div>
        )}

        {/* Quick add */}
        {totalStock > 0 && (
          <button
            onClick={handleQuickAdd}
            className='absolute bottom-0 inset-x-0 bg-black text-white text-sm font-bold py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-zinc-800'
          >
            + Thêm vào giỏ
          </button>
        )}
      </div>

      {/* Info */}
      <div className='p-4 flex flex-col flex-1'>
        <h3 className='text-sm font-bold text-gray-900 line-clamp-2 mb-1'>
          {name}
        </h3>

        {/* Stars */}
        <div className='flex items-center gap-1 mb-2'>
          <div className='flex'>
            {[1, 2, 3, 4, 5].map((s) => (
              <svg
                key={s}
                className={`w-3 h-3 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-zinc-200'}`}
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
            ))}
          </div>
          <span className='text-xs text-zinc-400'>({numReviews})</span>
        </div>

        {/* Price */}
        <div className='mt-auto flex items-center gap-2'>
          <span className='text-base font-black text-black'>
            {price.toLocaleString('vi-VN')}đ
          </span>
          {originalPrice && (
            <span className='text-xs text-zinc-400 line-through'>
              {originalPrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
