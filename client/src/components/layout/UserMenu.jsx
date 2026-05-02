import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export default function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <Link to='/auth' className='bg-white text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-zinc-200 transition'>
        Đăng nhập
      </Link>
    );
  }

  return (
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
  );
}
