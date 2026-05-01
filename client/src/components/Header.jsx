import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import CartDrawer from './CartDrawer';
import { motion } from 'framer-motion';
import { getProductsAPI } from '../services/productService';

export default function Header() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const searchRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const { items } = useCartStore();
  const { user, logout } = useAuthStore();

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  // Listen for global open-cart event
  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  // Real-time suggestions effect
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        setSuggestLoading(true);
        const { data } = await getProductsAPI({ search: search.trim(), limit: 5 });
        setSuggestions(data?.data || []);
      } catch (err) {
        console.error('Failed to get suggestions:', err);
      } finally {
        setSuggestLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Handle outside click listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Re-open dropdown when query changes
  useEffect(() => {
    if (search.trim()) {
      setShowDropdown(true);
    }
  }, [search]);

  const handleSelectSuggestion = (slug) => {
    navigate(`/product/${slug}`);
    setSearch('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
            {/* Inline Search Input Pill on Navbar */}
            <div ref={searchRef} className='relative shrink-0'>
              <input
                type='text'
                placeholder='Tìm kiếm...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onClick={() => setShowDropdown(true)}
                onKeyDown={handleSearch}
                className='w-28 sm:w-36 md:w-40 focus:w-48 transition-all duration-300 bg-zinc-800/40 hover:bg-zinc-800/70 border border-white/5 hover:border-white/10 text-white placeholder-zinc-500 rounded-full px-4 py-1.5 pl-8 text-xs focus:ring-1 focus:ring-white focus:outline-none focus:bg-zinc-800/80 h-9 shadow-inner select-text'
              />
              <svg
                className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-60 text-zinc-400 pointer-events-none'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <circle cx='11' cy='11' r='8' />
                <path d='m21 21-4.35-4.35' />
              </svg>

              {/* Autocomplete Dropdown directly attached */}
              {showDropdown && search.trim() !== '' && (
                <div className='absolute right-0 top-full mt-2 w-64 md:w-80 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-2 z-[60] animate-scale-up dropdown-scrollbar max-h-80 overflow-y-auto'>
                  {suggestLoading ? (
                    <div className='flex flex-col gap-2 px-1'>
                      <div className='h-12 bg-zinc-800/80 rounded-xl animate-pulse w-full' />
                      <div className='h-12 bg-zinc-800/80 rounded-xl animate-pulse w-full' />
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className='flex flex-col gap-1'>
                      {suggestions.map((p) => (
                        <button
                          key={p._id}
                          onClick={() => handleSelectSuggestion(p.slug)}
                          className='flex items-center gap-3 p-2 hover:bg-zinc-800/80 rounded-xl transition text-left group'
                        >
                          <div className='w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden shrink-0 border border-zinc-700/40 p-1'>
                            <img
                              src={p.images?.[0]}
                              alt={p.name}
                              className='w-full h-full object-contain group-hover:scale-110 transition duration-300'
                            />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h4 className='text-xs font-bold text-white uppercase truncate group-hover:text-blue-400 transition leading-tight'>
                              {p.name}
                            </h4>
                            <p className='text-[10px] text-zinc-400 mt-0.5'>
                              {p.price?.toLocaleString('vi-VN')}đ • {p.category}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className='text-xs text-zinc-400 px-1 italic text-center'>Không tìm thấy sản phẩm nào.</p>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
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

            {/* Cart */}
            <button onClick={() => setIsCartOpen(true)} className='relative p-2 hover:bg-zinc-800 rounded-full transition'>
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

            {/* User Dropdown */}
            {user ? (
              <div className='relative group'>
                <button className='flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-1.5 text-sm hover:bg-zinc-700 transition'>
                  <div className='w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs'>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className='hidden sm:block max-w-[80px] truncate'>{user.name}</span>
                </button>
                <div className='absolute right-0 mt-3 w-56 bg-white text-black rounded-2xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-zinc-100 z-50'>
                  <div className='px-4 py-3 border-b border-zinc-50 bg-zinc-50/50'>
                     <p className='text-[10px] font-black uppercase text-zinc-400 tracking-widest'>Tài khoản của tôi</p>
                     <p className='text-sm font-black truncate'>{user.name}</p>
                  </div>
                  <div className='p-1.5'>
                    {user.role === 'admin' && (
                      <Link to='/admin/dashboard' className='flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition'>
                        <div className='w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center'>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        Quản trị (Dashboard)
                      </Link>
                    )}
                    <Link to='/account' className='flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition'>
                      <div className='w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500'>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                      Hồ sơ cá nhân
                    </Link>
                    <Link to='/orders' className='flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition'>
                      <div className='w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500'>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      </div>
                      Đơn hàng đã mua
                    </Link>
                  </div>
                  <div className='p-1.5 border-t border-zinc-50 bg-zinc-50/30'>
                    <button onClick={handleLogout} className='w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition'>
                      <div className='w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center'>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      </div>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to='/auth' className='bg-white text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-zinc-200 transition'>
                Đăng nhập
              </Link>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className='md:hidden p-2 hover:bg-zinc-800 rounded-full transition'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                {menuOpen ? <path d='M6 18 18 6M6 6l12 12' /> : <path d='M4 6h16M4 12h16M4 18h16' />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu content */}
        {menuOpen && (
          <div className='md:hidden bg-zinc-900/50 backdrop-blur-md px-6 pb-4 flex flex-col gap-3 text-sm font-medium border-t border-white/5 mt-1 pt-3'>
            <Link to='/' onClick={(e) => { setMenuOpen(false); handleGoHome(e); }} className='py-2 border-b border-white/5 text-zinc-300 hover:text-white transition'>
              Trang chủ
            </Link>
            <Link to='/shop' onClick={() => setMenuOpen(false)} className='py-2 border-b border-white/5 text-zinc-300 hover:text-white transition'>
              Cửa hàng
            </Link>
            <Link to='/about' onClick={() => setMenuOpen(false)} className='py-2 text-zinc-300 hover:text-white transition'>
              Về chúng tôi
            </Link>
          </div>
        )}
      </header>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
