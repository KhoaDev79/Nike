import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import ProductCard from '../components/ProductCard';
import { getMeAPI } from '../services/authService';

export default function WishlistPage() {
  const { user, toggleWishlist, fetchMe } = useAuthStore();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Background image path (absolute path as required for embedding)
  const heroBg = '/C:/Users/DELL/.gemini/antigravity/brain/c4d0bea5-9922-4b6c-ae73-8c8188aabd32/wishlist_hero_bg_1777480651018.png';

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data } = await getMeAPI();
        setWishlist(data?.data?.wishlist || []);
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      } finally {
        setLoading(false);
      }
    };
    loadWishlist();
  }, [user]);

  if (!user) {
    return (
      <div className='min-h-[80vh] flex flex-col items-center justify-center px-6 bg-zinc-950 text-white'>
        <div className='absolute inset-0 opacity-20 pointer-events-none'>
            <img src={heroBg} alt="" className='w-full h-full object-cover grayscale' />
        </div>
        <div className='relative z-10 flex flex-col items-center text-center'>
            <div className='w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-8 border border-white/20'>
                <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                </svg>
            </div>
            <h1 className='text-4xl font-black mb-4 uppercase tracking-tighter'>Cần đăng nhập</h1>
            <p className='text-zinc-400 mb-10 max-w-sm font-medium leading-relaxed'>
                Hãy đăng nhập để lưu trữ những sản phẩm bạn yêu thích mãi mãi và truy cập chúng từ bất cứ đâu.
            </p>
            <Link
                to='/auth'
                className='bg-white text-black px-12 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]'
            >
                Đăng nhập ngay
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white min-h-screen'>
      {/* Premium Hero Section */}
      <div className='relative h-[45vh] min-h-[400px] flex items-center overflow-hidden bg-black'>
        <img
            src={heroBg}
            alt="Hero Background"
            className='absolute inset-0 w-full h-full object-cover opacity-60 scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent' />

        <div className='max-w-7xl mx-auto px-6 w-full relative z-10'>
          <div className='flex flex-col items-start'>
            <span className='inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6'>
                Collection
            </span>
            <h1 className='text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-6'>
                Your<br/><span className='text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500'>Favorites</span>
            </h1>
            <p className='text-zinc-300 font-medium max-w-md text-lg leading-snug'>
                Nơi lưu giữ niềm đam mê và khát khao chinh phục mọi mặt sân của bạn.
            </p>
          </div>
        </div>

        {/* Floating text decoration */}
        <div className='absolute -bottom-10 -right-10 text-[15rem] font-black text-white/5 pointer-events-none uppercase tracking-tighter'>
            Nike
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-20'>
        {/* Header with count */}
        <div className='flex items-center justify-between mb-16 pb-6 border-b border-zinc-100'>
            <div>
                <h2 className='text-sm font-black uppercase tracking-widest text-zinc-400 mb-1'>Danh mục</h2>
                <p className='text-3xl font-black'>Sản phẩm yêu thích <span className='text-zinc-300 ml-2'>{wishlist.length}</span></p>
            </div>
            <Link to='/shop' className='text-xs font-black uppercase tracking-widest hover:text-blue-600 transition flex items-center gap-2'>
                Tiếp tục mua sắm
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 8l4 4m0 0l-4 4m4-4H3'/></svg>
            </Link>
        </div>

        {loading ? (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='space-y-6'>
                <div className='bg-zinc-100 aspect-square rounded-[2.5rem] animate-pulse shadow-inner' />
                <div className='space-y-2 px-2'>
                    <div className='h-3 bg-zinc-100 rounded w-1/3 animate-pulse' />
                    <div className='h-5 bg-zinc-100 rounded w-full animate-pulse' />
                    <div className='h-4 bg-zinc-100 rounded w-1/2 animate-pulse' />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className='py-32 text-center border-4 border-dashed border-zinc-50 rounded-[4rem] relative overflow-hidden group hover:border-zinc-100 transition-colors'>
            <div className='relative z-10'>
                <div className='w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform'>
                    <svg className='w-8 h-8 text-zinc-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'/></svg>
                </div>
                <p className='text-zinc-400 font-bold text-xl mb-10'>Danh sách hiện đang trống.</p>
                <Link
                    to='/shop'
                    className='inline-block bg-black text-white px-12 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-zinc-800 transition-all hover:-translate-y-1 shadow-2xl'
                >
                    Khám phá ngay
                </Link>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16'>
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Banner */}
      <div className='max-w-7xl mx-auto px-6 pb-20'>
        <div className='bg-zinc-950 rounded-[3rem] p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8'>
            <div className='relative z-10'>
                <h3 className='text-white text-3xl font-black uppercase tracking-tighter mb-2'>Thành viên Nike</h3>
                <p className='text-zinc-400 font-medium'>Đăng ký để nhận thông báo mới nhất về các dòng giày giới hạn.</p>
            </div>
            <button className='relative z-10 bg-white text-black px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all'>
                Tham gia ngay
            </button>
            {/* Background elements */}
            <div className='absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2'></div>
        </div>
      </div>
    </div>
  );
}
