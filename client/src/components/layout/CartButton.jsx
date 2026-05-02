import useCartStore from '../../store/useCartStore';
import { motion } from 'framer-motion';

export default function CartButton({ onClick }) {
  const { items } = useCartStore();
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <button onClick={onClick} className='relative p-2 hover:bg-zinc-800 rounded-full transition'>
      <svg className='w-6 h-6' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
        <path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
        <line x1='3' y1='6' x2='21' y2='6' />
        <path d='M16 10a4 4 0 0 1-8 0' />
      </svg>
      {totalQty > 0 && (
        <motion.span
          key={totalQty}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg border-2 border-black'
        >
          {totalQty > 99 ? '99+' : totalQty}
        </motion.span>
      )}
    </button>
  );
}
