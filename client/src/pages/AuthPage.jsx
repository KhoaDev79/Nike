import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, user, loading, error, clearError } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});

  // Nếu đã login → về home
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Vui lòng nhập email';
    if (!form.password) errs.password = 'Vui lòng nhập mật khẩu';
    if (!isLogin) {
      if (!form.name) errs.name = 'Vui lòng nhập họ tên';
      if (form.password !== form.confirm)
        errs.confirm = 'Mật khẩu xác nhận không khớp';
      if (form.password && form.password.length < 6)
        errs.password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = isLogin
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password);

    if (result.success) {
      toast.success(isLogin ? 'Đăng nhập thành công!' : 'Đăng ký thành công!');
      navigate('/');
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-3 text-sm outline-none transition ${
      errors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-zinc-300 focus:border-black'
    }`;

  return (
    <div className='min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <svg
            className='w-12 h-12 fill-black mx-auto mb-3'
            viewBox='0 0 24 24'
          >
            <path d='M3 10.5L18.5 4l-5 10.5H6L3 10.5z' />
          </svg>
          <h1 className='text-2xl font-black uppercase tracking-widest'>
            Nike Football
          </h1>
          <p className='text-zinc-400 text-sm mt-1'>
            {isLogin ? 'Đăng nhập vào tài khoản' : 'Tạo tài khoản mới'}
          </p>
        </div>

        {/* Tab switch */}
        <div className='flex bg-zinc-200 rounded-full p-1 mb-6'>
          {['Đăng nhập', 'Đăng ký'].map((label, i) => (
            <button
              key={label}
              onClick={() => {
                setIsLogin(i === 0);
                setErrors({});
              }}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold transition ${
                isLogin === (i === 0)
                  ? 'bg-white text-black shadow'
                  : 'text-zinc-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-2xl shadow-sm p-8 space-y-4'
        >
          {!isLogin && (
            <div>
              <label className='text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1.5 block'>
                Họ và tên
              </label>
              <input
                name='name'
                placeholder='Nguyễn Văn A'
                value={form.name}
                onChange={handleChange}
                className={inputClass('name')}
              />
              {errors.name && (
                <p className='text-red-500 text-xs mt-1'>{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className='text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1.5 block'>
              Email
            </label>
            <input
              name='email'
              type='email'
              placeholder='example@gmail.com'
              value={form.email}
              onChange={handleChange}
              className={inputClass('email')}
            />
            {errors.email && (
              <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
            )}
          </div>

          <div>
            <label className='text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1.5 block'>
              Mật khẩu
            </label>
            <input
              name='password'
              type='password'
              placeholder='••••••••'
              value={form.password}
              onChange={handleChange}
              className={inputClass('password')}
            />
            {errors.password && (
              <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className='text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1.5 block'>
                Xác nhận mật khẩu
              </label>
              <input
                name='confirm'
                type='password'
                placeholder='••••••••'
                value={form.confirm}
                onChange={handleChange}
                className={inputClass('confirm')}
              />
              {errors.confirm && (
                <p className='text-red-500 text-xs mt-1'>{errors.confirm}</p>
              )}
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-black text-white font-black py-4 rounded-full text-sm uppercase tracking-widest hover:bg-zinc-800 transition disabled:opacity-50 mt-2'
          >
            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <p className='text-center text-sm text-zinc-400 mt-4'>
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className='text-black font-bold hover:underline'
          >
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </p>
      </div>
    </div>
  );
}
