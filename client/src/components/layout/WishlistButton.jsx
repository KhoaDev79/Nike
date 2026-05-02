import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export default function WishlistButton() {
  const { user } = useAuthStore();

  return (
    <Link to='/wishlist' className='relative p-2 hover:bg-zinc-800 rounded-full transition'>
      <svg className='w-6 h-6' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
        <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
      </svg>
      {user?.wishlist?.length > 0 && (
        <span className='absolute -top-1 -right-1 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black border border-black'>
          {user.wishlist.length}
        </span>
      )}
    </Link>
  );
}
