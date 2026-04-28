export default function AboutPage() {
  const stats = [
    { number: '10+', label: 'Năm kinh nghiệm' },
    { number: '50+', label: 'Mẫu giày chính hãng' },
    { number: '10K+', label: 'Khách hàng tin tưởng' },
    { number: '100%', label: 'Hàng chính hãng' },
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      role: 'Founder & CEO',
      img: 'https://i.pravatar.cc/150?img=11',
    },
    {
      name: 'Trần Thị B',
      role: 'Head of Products',
      img: 'https://i.pravatar.cc/150?img=5',
    },
    {
      name: 'Lê Văn C',
      role: 'Customer Experience',
      img: 'https://i.pravatar.cc/150?img=12',
    },
  ];

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className='relative h-[60vh] bg-black flex items-center overflow-hidden'>
        <img
          src='https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600'
          alt='about hero'
          className='absolute inset-0 w-full h-full object-cover opacity-40'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black to-transparent' />
        <div className='relative z-10 max-w-7xl mx-auto px-6'>
          <p className='text-zinc-400 text-xs font-bold tracking-[0.3em] uppercase mb-3'>
            Về chúng tôi
          </p>
          <h1 className='text-5xl md:text-6xl font-black text-white uppercase leading-none mb-4'>
            Born to <br /> <span className='text-zinc-400'>Play.</span>
          </h1>
          <p className='text-zinc-300 max-w-md text-base leading-relaxed'>
            Chúng tôi mang đến những đôi giày bóng đá Nike chính hãng tốt nhất,
            giúp bạn tự tin chinh phục mọi sân đấu.
          </p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className='bg-black py-12'>
        <div className='max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
          {stats.map((s) => (
            <div key={s.label}>
              <p className='text-4xl font-black text-white mb-1'>{s.number}</p>
              <p className='text-zinc-400 text-sm'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────── */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center'>
          <div>
            <p className='text-xs font-bold tracking-[0.3em] uppercase text-zinc-400 mb-3'>
              Câu chuyện của chúng tôi
            </p>
            <h2 className='text-3xl font-black uppercase tracking-wide mb-6'>
              Đam mê bóng đá,
              <br />
              Tận tâm phục vụ
            </h2>
            <div className='space-y-4 text-zinc-600 text-sm leading-relaxed'>
              <p>
                Nike Football Store được thành lập bởi những người yêu bóng đá
                thực sự. Chúng tôi hiểu rằng một đôi giày tốt không chỉ là trang
                bị — đó là sự khác biệt giữa một pha dứt điểm trúng hay trật.
              </p>
              <p>
                Với hơn 10 năm kinh nghiệm phân phối giày Nike Football chính
                hãng tại Việt Nam, chúng tôi tự hào mang đến đầy đủ các dòng sản
                phẩm từ Elite đến Academy, phù hợp cho mọi cầu thủ ở mọi cấp độ.
              </p>
              <p>
                Từ Phantom đến Mercurial, từ sân cỏ tự nhiên đến nhân tạo —
                chúng tôi có tất cả.
              </p>
            </div>
          </div>
          <div className='relative'>
            <img
              src='https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800'
              alt='story'
              className='rounded-2xl w-full h-80 object-cover'
            />
            <div className='absolute -bottom-6 -left-6 bg-black text-white p-6 rounded-2xl'>
              <p className='text-3xl font-black'>10+</p>
              <p className='text-zinc-400 text-xs'>Năm kinh nghiệm</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────── */}
      <section className='py-20 bg-zinc-50'>
        <div className='max-w-7xl mx-auto px-6'>
          <h2 className='text-3xl font-black uppercase tracking-wide text-center mb-12'>
            Giá trị cốt lõi
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[
              {
                icon: '🏆',
                title: 'Chất lượng',
                desc: '100% sản phẩm Nike chính hãng, có tem xác nhận và bảo hành đầy đủ.',
              },
              {
                icon: '⚡',
                title: 'Tốc độ',
                desc: 'Giao hàng nhanh chóng trong 24-48 giờ, miễn phí với đơn từ 1.5 triệu.',
              },
              {
                icon: '❤️',
                title: 'Tận tâm',
                desc: 'Đội ngũ tư vấn am hiểu bóng đá, sẵn sàng hỗ trợ bạn chọn đúng sản phẩm.',
              },
            ].map((v) => (
              <div
                key={v.title}
                className='bg-white rounded-2xl p-8 text-center hover:shadow-lg transition'
              >
                <span className='text-5xl block mb-4'>{v.icon}</span>
                <h3 className='text-lg font-black uppercase tracking-wide mb-3'>
                  {v.title}
                </h3>
                <p className='text-zinc-500 text-sm leading-relaxed'>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────── */}
      <section className='py-20 bg-white'>
        <div className='max-w-5xl mx-auto px-6'>
          <h2 className='text-3xl font-black uppercase tracking-wide text-center mb-12'>
            Đội ngũ
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {team.map((t) => (
              <div key={t.name} className='text-center group'>
                <div className='relative mx-auto w-32 h-32 mb-4'>
                  <img
                    src={t.img}
                    alt={t.name}
                    className='w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition duration-500'
                  />
                  <div className='absolute inset-0 rounded-full border-2 border-black opacity-0 group-hover:opacity-100 transition' />
                </div>
                <h4 className='font-black text-sm'>{t.name}</h4>
                <p className='text-zinc-400 text-xs mt-1'>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────── */}
      <section className='bg-black py-20 text-center text-white px-6'>
        <h2 className='text-3xl font-black uppercase mb-4'>
          Liên hệ với chúng tôi
        </h2>
        <p className='text-zinc-400 mb-8 max-w-md mx-auto text-sm'>
          Có câu hỏi hoặc cần tư vấn? Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ
          bạn.
        </p>
        <div className='flex flex-col sm:flex-row justify-center gap-4'>
          <a
            href='mailto:contact@nikefootball.vn'
            className='bg-white text-black font-black px-8 py-3 rounded-full text-sm hover:bg-zinc-200 transition'
          >
            📧 contact@nikefootball.vn
          </a>
          <a
            href='tel:0901234567'
            className='border-2 border-white text-white font-black px-8 py-3 rounded-full text-sm hover:bg-white hover:text-black transition'
          >
            📞 090 123 4567
          </a>
        </div>
      </section>
    </div>
  );
}
