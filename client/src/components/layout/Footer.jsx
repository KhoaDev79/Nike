import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className='bg-black text-white pt-20 pb-10 border-t border-zinc-800'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-16'>
          {/* Brand */}
          <div className='md:col-span-1'>
            <div className='flex items-center gap-2 mb-6'>
              <svg className='w-10 h-10 fill-white' viewBox='0 0 192.756 192.756' xmlns='http://www.w3.org/2000/svg'>
                <path d='M42.741 71.477c-9.881 11.604-19.355 25.994-19.45 36.75-.037 4.047 1.255 7.58 4.354 10.256 4.46 3.854 9.374 5.213 14.264 5.221 7.146.01 14.242-2.873 19.798-5.096 9.357-3.742 112.79-48.659 112.79-48.659.998-.5.811-1.123-.438-.812-.504.126-112.603 30.505-112.603 30.505a24.771 24.771 0 0 1-6.524.934c-8.615.051-16.281-4.731-16.219-14.808.024-3.943 1.231-8.698 4.028-14.291z' />
              </svg>
              <span className='text-sm font-black tracking-widest uppercase'>Nike Football</span>
            </div>
            <p className='text-zinc-500 text-sm leading-relaxed'>
              Trang bị tốt nhất cho mọi sân đấu. Giày đá banh Nike chính hãng 100%.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className='text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6'>Cửa hàng</h4>
            <ul className='space-y-3 text-sm'>
              <li><Link to='/shop?category=Mercurial' className='text-zinc-400 hover:text-white transition'>Mercurial</Link></li>
              <li><Link to='/shop?category=Phantom' className='text-zinc-400 hover:text-white transition'>Phantom</Link></li>
              <li><Link to='/shop?category=Tiempo' className='text-zinc-400 hover:text-white transition'>Tiempo</Link></li>
              <li><Link to='/shop' className='text-zinc-400 hover:text-white transition'>Tất cả sản phẩm</Link></li>
            </ul>
          </div>

          <div>
            <h4 className='text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6'>Hỗ trợ</h4>
            <ul className='space-y-3 text-sm'>
              <li><Link to='/about' className='text-zinc-400 hover:text-white transition'>Về chúng tôi</Link></li>
              <li><span className='text-zinc-400'>Chính sách đổi trả</span></li>
              <li><span className='text-zinc-400'>Hướng dẫn chọn size</span></li>
              <li><span className='text-zinc-400'>Liên hệ</span></li>
            </ul>
          </div>

          <div>
            <h4 className='text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6'>Liên hệ</h4>
            <ul className='space-y-3 text-sm text-zinc-400'>
              <li>📍 TP. Hồ Chí Minh, Việt Nam</li>
              <li>📞 0909 123 456</li>
              <li>✉️ info@nikefootball.vn</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className='pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4'>
          <p className='text-xs text-zinc-600'>
            © {new Date().getFullYear()} Nike Football Vietnam. Tất cả quyền được bảo lưu.
          </p>
          <div className='flex gap-6'>
            <a href='#' className='text-zinc-600 hover:text-white transition'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'/></svg>
            </a>
            <a href='#' className='text-zinc-600 hover:text-white transition'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
