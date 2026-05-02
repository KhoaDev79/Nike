import { Link, useNavigate } from 'react-router-dom';

export default function MobileMenu({ open, onClose }) {
  const navigate = useNavigate();

  const handleGoHome = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!open) return null;

  return (
    <div className='md:hidden bg-zinc-900/50 backdrop-blur-md px-6 pb-4 flex flex-col gap-3 text-sm font-medium border-t border-white/5 mt-1 pt-3'>
      <Link to='/' onClick={(e) => { onClose(); handleGoHome(e); }} className='py-2 border-b border-white/5 text-zinc-300 hover:text-white transition'>
        Trang chủ
      </Link>
      <Link to='/shop' onClick={onClose} className='py-2 border-b border-white/5 text-zinc-300 hover:text-white transition'>
        Cửa hàng
      </Link>
      <Link to='/about' onClick={onClose} className='py-2 text-zinc-300 hover:text-white transition'>
        Về chúng tôi
      </Link>
    </div>
  );
}
