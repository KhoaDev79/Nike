import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

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
    <aside
      className='w-[200px] hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50'
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* User Profile */}
      <div className='px-4 py-5 flex items-center gap-3' style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className='w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0'
          style={{ background: 'linear-gradient(135deg, #7c3aed, #0d9488)' }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <div className='min-w-0'>
          <p className='text-[12px] font-semibold text-white truncate leading-tight'>{user?.name}</p>
          <p className='text-[10px]' style={{ color: 'rgba(255,255,255,0.3)' }}>Admin</p>
        </div>
      </div>

      {/* Nav Label */}
      <div className='px-4 pt-5 pb-2'>
        <p className='text-[9px] font-semibold uppercase tracking-[0.12em]' style={{ color: 'rgba(255,255,255,0.2)' }}>Menu</p>
      </div>

      {/* Navigation */}
      <nav className='flex-1 px-3 space-y-0.5'>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className='relative w-full flex items-center gap-3 h-[40px] px-3 rounded-lg transition-all duration-150 cursor-pointer'
              style={{
                background: isActive ? 'rgba(124,58,237,0.25)' : 'transparent',
                border: isActive ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <svg
                className='w-[16px] h-[16px] shrink-0'
                fill='none'
                stroke={isActive ? '#a78bfa' : 'rgba(255,255,255,0.35)'}
                strokeWidth='1.5'
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d={item.icon} />
              </svg>
              <span className='text-[12px] font-medium' style={{ color: isActive ? '#a78bfa' : 'rgba(255,255,255,0.55)' }}>
                {item.label}
              </span>
              {item.badge > 0 && (
                <div className='ml-auto w-[18px] h-[18px] rounded-md bg-[#ef4444] flex items-center justify-center'>
                  <span className='text-[9px] font-bold text-white'>{item.badge}</span>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className='px-3 py-4' style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => navigate('/shop')}
          className='w-full flex items-center gap-3 h-[40px] px-3 rounded-lg transition-all duration-150 cursor-pointer'
          style={{ color: '#2dd4bf' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(13,148,136,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <svg className='w-[16px] h-[16px]' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M10 19l-7-7m0 0l7-7m-7 7h18'/>
          </svg>
          <span className='text-[12px] font-medium'>Về cửa hàng</span>
        </button>
      </div>
    </aside>
  );
}
