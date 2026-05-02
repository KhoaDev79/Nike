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
    category,
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
      Elite: 'text-yellow-600 border-yellow-600',
      Pro: 'text-blue-600 border-blue-600',
      Academy: 'text-zinc-600 border-zinc-600',
    }[tier] || 'text-zinc-600 border-zinc-600';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const defaultSize = sizes.find((s) => s.stock > 0)?.size;
    if (!defaultSize) return;
    addItem({ ...product, selectedSize: defaultSize }, 1);
  };

  return (
    <Link
      to={`/product/${slug || _id}`}
      className='group flex flex-col h-full'
    >
      {/* Image Container */}
      <div className='relative overflow-hidden bg-[#F5F5F5] aspect-square mb-4 transition-all duration-500'>
        <img
          src={images?.[0] || 'https://via.placeholder.com/400x400?text=Nike'}
          alt={name}
          className='w-full h-full object-cover mix-blend-darken transition-transform duration-700 ease-out group-hover:scale-105'
        />

        {/* Badges */}
        <div className='absolute top-4 left-4 flex flex-col items-start gap-2'>
          {discount > 0 && (
            <span className='bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm'>
              -{discount}%
            </span>
          )}
          {tags.includes('new') && (
            <span className='bg-black text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm'>
              Mới
            </span>
          )}
          {tags.includes('limited') && (
            <span className='bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm'>
              Giới hạn
            </span>
          )}
        </div>

        {/* Out of stock */}
        {totalStock === 0 && (
          <div className='absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center'>
            <span className='bg-black text-white px-6 py-2 font-medium text-sm uppercase shadow-xl'>
              Hết hàng
            </span>
          </div>
        )}

        {/* Quick add */}
        {totalStock > 0 && (
          <button
            onClick={handleQuickAdd}
            className='absolute bottom-4 right-4 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow hover:bg-black hover:text-white hover:scale-110'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          </button>
        )}
      </div>

      {/* Info */}
      <div className='flex flex-col flex-1 px-1'>
        <h3 className='text-[15px] md:text-base font-medium text-[#111111] mb-0.5 leading-tight line-clamp-1'>
          {name}
        </h3>
        <p className='text-[15px] md:text-base text-[#707072] mb-3 leading-tight'>
          {category || 'Giày bóng đá'} {tier} • Sân {surfaceType}
        </p>

        {/* Price */}
        <div className='mt-auto flex items-center gap-3'>
          <span className='text-[15px] md:text-base font-medium text-[#111111]'>
            {price.toLocaleString('vi-VN')}₫
          </span>
          {originalPrice && (
            <span className='text-[15px] md:text-base text-[#707072] line-through'>
              {originalPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
