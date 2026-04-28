import { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className='max-w-4xl mx-auto px-4 py-10 min-h-[70vh]'>
      <h1 className='text-3xl font-black uppercase tracking-widest mb-8'>Tài khoản của tôi</h1>
      <div className='bg-white border border-zinc-200 rounded-3xl p-8'>
        <div className='flex flex-col md:flex-row items-center gap-6 mb-8'>
          <div className='w-24 h-24 bg-black text-white text-4xl font-black rounded-full flex items-center justify-center uppercase shrink-0 shadow-lg'>
            {user.name.charAt(0)}
          </div>
          <div className='text-center md:text-left'>
            <h2 className='text-2xl font-black'>{user.name}</h2>
            <p className='text-zinc-500 font-medium'>{user.email}</p>
            <span className='inline-block mt-3 bg-zinc-100 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest'>
              Vai trò: {user.role}
            </span>
          </div>
        </div>

        <hr className='border-zinc-100 mb-8' />

        <div>
          <h3 className='text-lg font-black uppercase mb-4 tracking-wider'>Địa chỉ giao hàng</h3>
          {user.addresses && user.addresses.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {user.addresses.map((addr, idx) => (
                <div key={idx} className='bg-zinc-50 border border-zinc-100 p-5 rounded-2xl'>
                  <div className='flex items-center justify-between mb-2'>
                    <p className='font-bold text-black'>{addr.fullName}</p>
                    {addr.isDefault && (
                      <span className='text-[10px] bg-black text-white px-2 py-1 rounded-full font-bold uppercase tracking-widest'>
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className='text-sm font-bold text-zinc-600 mb-2'>{addr.phone}</p>
                  <p className='text-sm text-zinc-500 leading-relaxed'>
                    {addr.street},<br/>
                    {addr.ward}, {addr.district},<br/>
                    {addr.city}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-zinc-500 italic text-sm p-4 bg-zinc-50 rounded-xl'>Chưa có địa chỉ nào được thêm.</p>
          )}
        </div>

        <div className='mt-10 flex gap-4'>
          <button 
            onClick={logout} 
            className='bg-red-50 text-red-600 font-bold px-8 py-3 rounded-full hover:bg-red-100 transition-colors uppercase tracking-widest text-sm'
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
