import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export default function AdminSidebar({ stats }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { label: 'Báo cáo', path: '/admin/reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Đơn hàng', path: '/admin/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', badge: stats?.orders?.pending },
    { label: 'Sản phẩm', path: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Khách hàng', path: '/admin/customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  ];

  return (
    <aside className='w-[200px] hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50 bg-[var(--color-snow)] border-r border-[var(--color-border-secondary)]'>
      {/* User Profile */}
      <div className='px-4 py-5 flex items-center gap-3 border-b border-[var(--color-border-secondary)]'>
        <div className='w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-nike-white)] bg-[var(--color-nike-black)] font-bold text-sm shrink-0'>
          {user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <div className='min-w-0'>
          <p className='text-[12px] font-semibold text-[var(--color-text-primary)] truncate leading-tight'>{user?.name}</p>
          <p className='text-[10px] text-[var(--color-text-secondary)]'>Admin</p>
        </div>
      </div>

      {/* Nav Label */}
      <div className='px-4 pt-5 pb-2'>
        <p className='text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]'>Menu</p>
      </div>

      {/* Navigation */}
      <nav className='flex-1 px-3 space-y-1'>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`relative w-full flex items-center gap-3 h-[40px] px-3 rounded-lg transition-colors duration-150 cursor-pointer ${
                isActive 
                  ? 'bg-[var(--color-nike-black)] text-[var(--color-nike-white)]' 
                  : 'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-hover-gray)]'
              }`}
            >
              <svg
                className='w-[16px] h-[16px] shrink-0'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d={item.icon} />
              </svg>
              <span className='text-[12px] font-medium'>
                {item.label}
              </span>
              {item.badge > 0 && (
                <div className='ml-auto w-[18px] h-[18px] rounded-full bg-[var(--color-nike-red)] flex items-center justify-center'>
                  <span className='text-[9px] font-bold text-[var(--color-nike-white)]'>{item.badge}</span>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className='px-3 py-4 border-t border-[var(--color-border-secondary)]'>
        <button
          onClick={() => navigate('/shop')}
          className='w-full flex items-center gap-3 h-[40px] px-3 rounded-lg transition-colors duration-150 cursor-pointer bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-hover-gray)]'
        >
          <svg className='w-[16px] h-[16px]' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M10 19l-7-7m0 0l7-7m-7 7h18'/>
          </svg>
          <span className='text-[12px] font-medium'>Về cửa hàng</span>
        </button>
      </div>
    </aside>
  );
}
