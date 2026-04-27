import { Link } from 'react-router-dom';

const links = {
  'Sản phẩm': ['Phantom', 'Mercurial', 'Tiempo', 'Vapor'],
  'Loại sân': ['Sân cỏ tự nhiên (FG)', 'Sân nhân tạo (AG)', 'Sân cứng (TF)'],
  'Hỗ trợ': ['Chính sách đổi trả', 'Hướng dẫn chọn size', 'Liên hệ', 'FAQ'],
};

export default function Footer() {
  return (
    <footer className='bg-black text-white pt-16 pb-8'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-zinc-800'>
          {/* Brand */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <svg className='w-10 h-10 fill-white' viewBox='0 0 24 24'>
                <path d='M3 10.5L18.5 4l-5 10.5H6L3 10.5z' />
              </svg>
              <span className='text-xl font-black tracking-widest uppercase'>
                Nike Football
              </span>
            </div>
            <p className='text-zinc-400 text-sm leading-relaxed'>
              Trang bị tốt nhất để chinh phục mọi sân đấu. Chất lượng Nike — tốc
              độ, kiểm soát, đỉnh cao.
            </p>
            <div className='flex gap-3 mt-5'>
              {['f', 'in', 'yt'].map((s) => (
                <a
                  key={s}
                  href='#'
                  className='w-9 h-9 rounded-full border border-zinc-700 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition text-zinc-400 text-sm font-bold'
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className='text-sm font-bold uppercase tracking-widest mb-4'>
                {title}
              </h4>
              <ul className='space-y-2'>
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      to='/shop'
                      className='text-zinc-400 text-sm hover:text-white transition'
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-zinc-500 text-xs'>
          <p>
            © {new Date().getFullYear()} Nike Football Store. All rights
            reserved.
          </p>
          <div className='flex gap-4'>
            <a href='#' className='hover:text-white transition'>
              Chính sách bảo mật
            </a>
            <a href='#' className='hover:text-white transition'>
              Điều khoản sử dụng
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
