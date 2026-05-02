import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import CartButton from './CartButton';
import WishlistButton from './WishlistButton';
import MobileMenu from './MobileMenu';
import CartDrawer from './CartDrawer';

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Listen for global open-cart event
  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  const handleGoHome = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl bg-zinc-900/60 backdrop-blur-xl text-white border border-white/10 z-50 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 ${menuOpen ? 'rounded-[28px]' : 'rounded-full'}`}>
        <div className='px-6 py-2 flex items-center justify-between gap-4 h-16'>
          {/* Logo */}
          <Link to='/' onClick={handleGoHome} className='flex items-center gap-2 shrink-0'>
            <svg className='w-9 h-9 fill-white hover:opacity-80 transition' viewBox='0 0 192.756 192.756' xmlns='http://www.w3.org/2000/svg'>
              <path d='M42.741 71.477c-9.881 11.604-19.355 25.994-19.45 36.75-.037 4.047 1.255 7.58 4.354 10.256 4.46 3.854 9.374 5.213 14.264 5.221 7.146.01 14.242-2.873 19.798-5.096 9.357-3.742 112.79-48.659 112.79-48.659.998-.5.811-1.123-.438-.812-.504.126-112.603 30.505-112.603 30.505a24.771 24.771 0 0 1-6.524.934c-8.615.051-16.281-4.731-16.219-14.808.024-3.943 1.231-8.698 4.028-14.291z' />
            </svg>
            <span className='text-sm font-black tracking-widest uppercase hidden md:block'>
              Nike Football
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className='hidden md:flex items-center gap-6 text-sm font-semibold h-full'>
            <Link to='/' onClick={handleGoHome} className='text-zinc-300 hover:text-white transition duration-300 tracking-wide'>
              Trang chủ
            </Link>

            {/* Shop Dropdown */}
            <div className='relative group h-full flex items-center'>
              <Link to='/shop' className='text-zinc-300 hover:text-white transition duration-300 flex items-center gap-1 tracking-wide'>
                Cửa hàng
                <svg className='w-3 h-3 opacity-50 transition duration-300 group-hover:rotate-180' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/></svg>
              </Link>

              {/* Mega Menu */}
              <div className='absolute top-full left-1/2 -translate-x-1/2 w-[520px] bg-white text-black shadow-2xl rounded-2xl p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-50 border border-zinc-100 mt-1'>
                <div className='grid grid-cols-3 gap-8'>
                  <div>
                    <h4 className='font-black uppercase mb-4 text-xs text-zinc-400 tracking-widest'>Phân Khúc</h4>
                    <ul className='space-y-3 text-sm font-bold'>
                      <li><Link to='/shop?tier=Elite' className='hover:text-blue-600 transition block'>Elite</Link></li>
                      <li><Link to='/shop?tier=Pro' className='hover:text-blue-600 transition block'>Pro</Link></li>
                      <li><Link to='/shop?tier=Academy' className='hover:text-blue-600 transition block'>Academy</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className='font-black uppercase mb-4 text-xs text-zinc-400 tracking-widest'>Loại Sân</h4>
                    <ul className='space-y-3 text-sm font-bold'>
                      <li><Link to='/shop?surfaceType=FG' className='hover:text-blue-600 transition block'>FG (Tự nhiên)</Link></li>
                      <li><Link to='/shop?surfaceType=AG' className='hover:text-blue-600 transition block'>AG (Nhân tạo)</Link></li>
                      <li><Link to='/shop?surfaceType=TF' className='hover:text-blue-600 transition block'>TF (Sân cứng)</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className='font-black uppercase mb-4 text-xs text-zinc-400 tracking-widest'>Dòng Giày</h4>
                    <ul className='space-y-3 text-sm font-bold'>
                      <li><Link to='/shop?category=Mercurial' className='hover:text-blue-600 transition block'>Mercurial</Link></li>
                      <li><Link to='/shop?category=Phantom' className='hover:text-blue-600 transition block'>Phantom</Link></li>
                      <li><Link to='/shop?category=Tiempo' className='hover:text-blue-600 transition block'>Tiempo</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Link to='/about' className='text-zinc-300 hover:text-white transition duration-300 tracking-wide'>
              Về chúng tôi
            </Link>
          </nav>

          {/* Right actions */}
          <div className='flex items-center gap-3'>
            <SearchBar />
            <WishlistButton />
            <CartButton onClick={() => setIsCartOpen(true)} />
            <UserMenu />

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className='md:hidden p-2 hover:bg-zinc-800 rounded-full transition'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                {menuOpen ? <path d='M6 18 18 6M6 6l12 12' /> : <path d='M4 6h16M4 12h16M4 18h16' />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu content */}
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </header>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
