import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import CartDrawer from './CartDrawer';

export default function Header() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { items } = useCartStore();
  const { user, logout } = useAuthStore();

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className='bg-black text-white sticky top-0 z-50 shadow-lg'>
      {/* Top bar */}
      <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2 shrink-0'>
          <svg className='w-10 h-10 fill-white' viewBox='0 0 24 24'>
            <path d='M3 10.5L18.5 4l-5 10.5H6L3 10.5z' />
          </svg>
          <span className='text-xl font-black tracking-widest uppercase hidden sm:block'>
            Nike Football
          </span>
        </Link>

        {/* Search */}
        <div className='flex-1 max-w-md relative'>
          <input
            type='text'
            placeholder='Tìm kiếm giày...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className='w-full bg-zinc-800 text-white placeholder-zinc-400 rounded-full px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-white transition'
          />
          <svg
            className='absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <circle cx='11' cy='11' r='8' />
            <path d='m21 21-4.35-4.35' />
          </svg>
        </div>

        {/* Nav desktop */}
        <nav className='hidden md:flex items-center gap-6 text-sm font-medium'>
          <Link to='/' className='hover:text-zinc-300 transition'>
            Trang chủ
          </Link>
          <Link to='/shop' className='hover:text-zinc-300 transition'>
            Cửa hàng
          </Link>
          <Link to='/about' className='hover:text-zinc-300 transition'>
            Về chúng tôi
          </Link>
        </nav>

        {/* Right actions */}
        <div className='flex items-center gap-3'>
          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className='relative p-2 hover:bg-zinc-800 rounded-full transition'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
              <line x1='3' y1='6' x2='21' y2='6' />
              <path d='M16 10a4 4 0 0 1-8 0' />
            </svg>
            {totalQty > 0 && (
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold'>
                {totalQty > 99 ? '99+' : totalQty}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className='relative group'>
              <button className='flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-1.5 text-sm hover:bg-zinc-700 transition'>
                <div className='w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs'>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className='hidden sm:block max-w-[80px] truncate'>
                  {user.name}
                </span>
              </button>
              {/* Dropdown */}
              <div className='absolute right-0 mt-2 w-44 bg-white text-black rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200'>
                <Link
                  to='/profile'
                  className='block px-4 py-3 text-sm hover:bg-zinc-100'
                >
                  Tài khoản
                </Link>
                <Link
                  to='/orders'
                  className='block px-4 py-3 text-sm hover:bg-zinc-100'
                >
                  Đơn hàng
                </Link>
                <hr />
                <button
                  onClick={handleLogout}
                  className='w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-zinc-100'
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link
              to='/auth'
              className='bg-white text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-zinc-200 transition'
            >
              Đăng nhập
            </Link>
          )}

          {/* Hamburger mobile */}
          <button
            className='md:hidden p-2 hover:bg-zinc-800 rounded-full transition'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              {menuOpen ? (
                <path d='M6 18 18 6M6 6l12 12' />
              ) : (
                <path d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className='md:hidden bg-zinc-900 px-4 pb-4 flex flex-col gap-3 text-sm font-medium'>
          <Link
            to='/'
            onClick={() => setMenuOpen(false)}
            className='py-2 border-b border-zinc-700'
          >
            Trang chủ
          </Link>
          <Link
            to='/shop'
            onClick={() => setMenuOpen(false)}
            className='py-2 border-b border-zinc-700'
          >
            Cửa hàng
          </Link>
          <Link to='/about' onClick={() => setMenuOpen(false)} className='py-2'>
            Về chúng tôi
          </Link>
        </div>
      )}

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
