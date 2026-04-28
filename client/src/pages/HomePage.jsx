import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getFeaturedProductsAPI } from '../services/productService';

// ── Local assets (đã tải về src/assets) ─────────────────────────
import heroImg  from '../assets/hero_main.jpg';
import catFg    from '../assets/cat_fg.jpg';
import catAg    from '../assets/cat_ag.jpg';
import catTf    from '../assets/cat_tf.jpg';
import ctaBg    from '../assets/cta_bg.jpg';

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getFeaturedProductsAPI()
      .then((res) => {
        // axios: res.data = { success: true, data: [...] }
        const list = res.data?.data;
        setFeatured(Array.isArray(list) ? list : []);
      })
      .catch((err) => console.error('Featured API error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className='relative h-[90vh] min-h-[600px] flex items-center overflow-hidden'
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Overlay – darker on left for text, transparent on right for photo */}
        <div
          className='absolute inset-0'
          style={{
            background:
              'linear-gradient(105deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.50) 55%, rgba(0,0,0,0.10) 100%)',
          }}
        />

        <div className='relative z-10 max-w-7xl mx-auto px-6 w-full'>
          {/* Live badge */}
          <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6'>
            <span className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
            <p className='text-white/90 text-xs font-bold tracking-[0.25em] uppercase'>
              Nike Football 2025
            </p>
          </div>

          <h1 className='text-6xl md:text-8xl font-black text-white leading-none uppercase mb-6 drop-shadow-2xl'>
            Just <br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400'>
              Play.
            </span>
          </h1>

          <p className='text-zinc-200 text-lg max-w-md mb-10 leading-relaxed drop-shadow-md'>
            Trang bị đôi giày tốt nhất để chinh phục mọi sân đấu.
          </p>

          <div className='flex flex-wrap gap-4'>
            <button
              onClick={() => navigate('/shop')}
              className='bg-white text-black font-black px-8 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-zinc-100 hover:scale-105 transition-all duration-200 shadow-xl'
            >
              Mua ngay
            </button>
            <button
              onClick={() => navigate('/shop?featured=true')}
              className='bg-white/10 backdrop-blur-sm border-2 border-white text-white font-black px-8 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-200'
            >
              Xem bộ sưu tập
            </button>
          </div>

          {/* Stats strip */}
          <div className='flex gap-10 mt-14'>
            {[
              { value: '50+', label: 'Mẫu giày' },
              { value: '3',   label: 'Loại sân' },
              { value: '100%', label: 'Chính hãng' },
            ].map((s) => (
              <div key={s.label}>
                <p className='text-white text-2xl font-black'>{s.value}</p>
                <p className='text-zinc-400 text-xs uppercase tracking-wider mt-0.5'>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────── */}
      <section className='py-16 bg-zinc-950'>
        <div className='max-w-7xl mx-auto px-6'>
          <h2 className='text-white text-2xl font-black uppercase tracking-widest text-center mb-10'>
            Chọn theo loại sân
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            {[
              { label: 'Sân cỏ tự nhiên',     code: 'FG', img: catFg },
              { label: 'Sân nhân tạo (AG)',    code: 'AG', img: catAg },
              { label: 'Sân cứng (TF/Futsal)', code: 'TF', img: catTf },
            ].map((cat) => (
              <Link
                key={cat.code}
                to={`/shop?surfaceType=${cat.code}`}
                className='relative rounded-2xl overflow-hidden aspect-video group'
              >
                <img
                  src={cat.img}
                  alt={cat.label}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-black/50' />
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <span className='text-white text-3xl font-black'>{cat.code}</span>
                  <span className='text-zinc-200 text-sm mt-1'>{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ───────────────────────────────────────── */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='flex items-end justify-between mb-10'>
            <h2 className='text-3xl font-black uppercase tracking-wide'>Sản phẩm nổi bật</h2>
            <Link to='/shop' className='text-sm font-bold underline hover:text-zinc-500 transition'>
              Xem tất cả →
            </Link>
          </div>
          {loading ? (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {[...Array(8)].map((_, i) => (
                <div key={i} className='bg-zinc-100 rounded-2xl aspect-square animate-pulse' />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <p className='text-center text-zinc-400 py-12'>
              Chưa có sản phẩm nổi bật. Hãy chạy seed để thêm dữ liệu.
            </p>
          )}
        </div>
      </section>

      {/* ── TIERS ──────────────────────────────────────────── */}
      <section className='py-16 bg-zinc-50'>
        <div className='max-w-7xl mx-auto px-6'>
          <h2 className='text-3xl font-black uppercase tracking-wide text-center mb-10'>Phân khúc</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[
              { tier: 'Elite',   icon: '👑', desc: 'Dành cho cầu thủ chuyên nghiệp.', bg: 'bg-black',     text: 'text-white' },
              { tier: 'Pro',     icon: '⚡', desc: 'Hiệu suất cao, giá trị tốt.',      bg: 'bg-blue-600',  text: 'text-white' },
              { tier: 'Academy', icon: '🎯', desc: 'Lý tưởng cho người mới bắt đầu.', bg: 'bg-zinc-200',  text: 'text-black' },
            ].map((t) => (
              <Link
                key={t.tier}
                to={`/shop?tier=${t.tier}`}
                className={`${t.bg} ${t.text} rounded-2xl p-8 flex flex-col gap-4 hover:scale-105 transition-transform`}
              >
                <span className='text-4xl'>{t.icon}</span>
                <h3 className='text-xl font-black'>{t.tier}</h3>
                <p className='text-sm opacity-80'>{t.desc}</p>
                <span className='text-sm font-bold mt-auto'>Khám phá →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className='relative py-24 bg-black overflow-hidden'>
        <img
          src={ctaBg}
          alt='cta background'
          className='absolute inset-0 w-full h-full object-cover opacity-40'
        />
        <div className='relative z-10 text-center text-white px-6'>
          <h2 className='text-4xl md:text-6xl font-black uppercase mb-4'>Sẵn sàng thi đấu?</h2>
          <p className='text-zinc-400 mb-8 max-w-md mx-auto'>
            Hơn 50 mẫu giày Nike Football đang chờ bạn.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className='bg-white text-black font-black px-10 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-zinc-200 hover:scale-105 transition-all duration-200'
          >
            Khám phá ngay
          </button>
        </div>
      </section>
    </div>
  );
}
