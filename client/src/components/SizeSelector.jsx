export default function SizeSelector({ sizes = [], selected, onChange }) {
  return (
    <div>
      <div className='flex items-center justify-between mb-3'>
        <span className='text-sm font-bold text-gray-900 uppercase tracking-wide'>
          Chọn size (EU)
        </span>
        {selected && (
          <span className='text-sm text-zinc-500'>
            Đã chọn: <strong className='text-black'>EU {selected}</strong>
          </span>
        )}
      </div>

      <div className='grid grid-cols-5 sm:grid-cols-6 gap-2'>
        {sizes.map(({ size, stock }) => {
          const isSelected = selected === size;
          const isOutOfStock = stock === 0;

          return (
            <button
              key={size}
              onClick={() => !isOutOfStock && onChange(size)}
              disabled={isOutOfStock}
              title={
                isOutOfStock ? 'Hết hàng' : `Size ${size} — còn ${stock} đôi`
              }
              className={`
                relative aspect-square rounded-xl border-2 text-sm font-bold
                flex items-center justify-center transition-all duration-200
                ${
                  isSelected
                    ? 'border-black bg-black text-white shadow-lg scale-105'
                    : isOutOfStock
                      ? 'border-zinc-200 bg-zinc-50 text-zinc-300 cursor-not-allowed line-through'
                      : 'border-zinc-300 bg-white text-gray-800 hover:border-black hover:shadow-md cursor-pointer'
                }
              `}
            >
              {size}
              {isOutOfStock && (
                <span className='absolute inset-0 flex items-center justify-center'>
                  <span className='block w-full h-px bg-zinc-300 rotate-45 absolute' />
                </span>
              )}
              {!isOutOfStock && stock <= 2 && !isSelected && (
                <span className='absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full' />
              )}
            </button>
          );
        })}
      </div>

      <div className='flex items-center gap-4 mt-3 text-xs text-zinc-400'>
        <span className='flex items-center gap-1'>
          <span className='w-3 h-3 border-2 border-zinc-300 rounded inline-block' />{' '}
          Hết hàng
        </span>
        <span className='flex items-center gap-1'>
          <span className='w-1.5 h-1.5 bg-red-500 rounded-full inline-block' />{' '}
          Sắp hết (≤ 2 đôi)
        </span>
      </div>
    </div>
  );
}
