import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getProductsAPI, deleteProductAPI, createProductAPI, updateProductAPI } from '../../api/productApi';
import { getAdminStatsAPI } from '../../api/orderApi';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';
import ProductFormModal from '../components/ProductFormModal';

const glass = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 };
const muted = 'rgba(255,255,255,0.35)';

export default function AdminProductsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filter, setFilter] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchProducts(); fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => { try { const { data } = await getAdminStatsAPI(); setStats(data.data); } catch {} };
  const fetchProducts = async () => {
    try { setLoading(true); const { data } = await getProductsAPI({ admin: true, limit: 100 }); setProducts(data.data); }
    catch { toast.error('Không thể tải sản phẩm'); }
    finally { setLoading(false); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Xoá sản phẩm này?')) return;
    try { await deleteProductAPI(id); toast.success('Đã xoá'); fetchProducts(); } catch { toast.error('Thất bại'); }
  };

  const filtered = products.filter(p => {
    const s = p.name.toLowerCase().includes(filter.toLowerCase());
    const c = catFilter === 'all' || p.category === catFilter;
    return s && c;
  });
  const categories = ['all', ...new Set(products.map(p => p.category))];

  return (
    <div className='min-h-screen relative overflow-hidden' style={{ background: '#080b14', fontFamily: "'Inter',system-ui" }}>
      <div className='fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none' style={{ background: 'rgba(124,58,237,0.12)', filter: 'blur(80px)' }} />
      <div className='fixed bottom-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full pointer-events-none' style={{ background: 'rgba(13,148,136,0.1)', filter: 'blur(80px)' }} />
      <AdminSidebar stats={stats} />

      <main className='ml-[200px] p-6 lg:p-8 xl:p-10 relative z-10'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-end justify-between mb-6 gap-4'>
          <div>
            <h1 className='text-[18px] font-bold text-white' style={{ letterSpacing: '-0.03em' }}>Sản phẩm</h1>
            <p className='text-[12px] mt-0.5' style={{ color: muted }}>
              Đang hiển thị <span className='text-white font-semibold'>{filtered.length}</span> trên tổng số {products.length} mẫu giày.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <input type='text' placeholder='Tìm tên giày...' value={filter} onChange={e => setFilter(e.target.value)}
                className='text-[12px] text-white placeholder-white/30 outline-none pl-9 pr-4 py-2.5 rounded-lg w-64'
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
              <svg className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2' fill='none' stroke='rgba(255,255,255,0.3)' strokeWidth='1.5' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/></svg>
            </div>
            <button onClick={() => { setEditingProduct(null); setShowModal(true); }}
              className='flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-semibold text-white cursor-pointer transition-all'
              style={{ background: 'linear-gradient(135deg, #7c3aed, #0d9488)', border: 'none' }}>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4'/></svg>
              Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className='flex items-center gap-2 mb-6 overflow-x-auto pb-2'>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className='px-4 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-[0.08em] transition-all cursor-pointer whitespace-nowrap'
              style={{
                background: catFilter === cat ? 'rgba(124,58,237,0.25)' : 'transparent',
                border: catFilter === cat ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.06)',
                color: catFilter === cat ? '#a78bfa' : 'rgba(255,255,255,0.4)',
              }}>{cat === 'all' ? 'Tất cả' : cat}</button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className='animate-pulse rounded-xl p-4' style={glass}>
                <div className='aspect-[4/3] rounded-lg mb-4' style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className='h-3 rounded w-2/3 mb-2' style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className='h-4 rounded w-1/3' style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className='py-32 text-center'>
            <p className='text-[32px] mb-4'>🔍</p>
            <p className='text-[14px] font-semibold text-white mb-1'>Không tìm thấy</p>
            <p className='text-[12px]' style={{ color: muted }}>Thử từ khóa hoặc bộ lọc khác.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12'>
            {filtered.map(product => (
              <div key={product._id} className='group rounded-xl overflow-hidden transition-all duration-200 cursor-pointer'
                style={glass}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
                {/* Image */}
                <div className='aspect-[4/3] relative p-4 flex items-center justify-center' style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <img src={product.images[0]} alt={product.name} className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-300' />
                  <div className='absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <button onClick={(e) => { e.stopPropagation(); setEditingProduct(product); setShowModal(true); }}
                      className='w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer'
                      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                      <svg className='w-3.5 h-3.5' fill='none' stroke='white' strokeWidth='1.5' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'/></svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }}
                      className='w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer'
                      style={{ background: 'rgba(239,68,68,0.6)', backdropFilter: 'blur(8px)' }}>
                      <svg className='w-3.5 h-3.5' fill='none' stroke='white' strokeWidth='1.5' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'/></svg>
                    </button>
                  </div>
                </div>
                {/* Info */}
                <div className='p-4'>
                  <div className='flex items-center gap-1.5 mb-1.5'>
                    <span className='text-[9px] font-semibold uppercase tracking-[0.08em]' style={{ color: muted }}>{product.category}</span>
                    <div className='w-1 h-1 rounded-full' style={{ background: 'rgba(255,255,255,0.15)' }} />
                    <span className='text-[9px] font-semibold uppercase tracking-[0.08em]' style={{ color: muted }}>{product.tier}</span>
                  </div>
                  <h3 className='text-[12px] font-medium text-white truncate mb-2'>{product.name}</h3>
                  <p className='text-[16px] font-extrabold text-white' style={{ fontVariantNumeric: 'tabular-nums' }}>{product.price.toLocaleString('vi-VN')}đ</p>
                  <div className='flex flex-wrap gap-1 mt-3'>
                    {product.sizes.slice(0, 5).map(s => (
                      <span key={s.size} className='text-[9px] font-medium px-1.5 py-0.5 rounded' style={{ background: s.stock > 0 ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.1)', color: s.stock > 0 ? 'rgba(255,255,255,0.4)' : 'rgba(239,68,68,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>{s.size}</span>
                    ))}
                    {product.sizes.length > 5 && <span className='text-[9px] font-medium px-1.5 py-0.5 rounded' style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>+{product.sizes.length - 5}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => { setShowModal(false); setEditingProduct(null); }}
          onSaved={fetchProducts}
        />
      )}
    </div>
  );
}
