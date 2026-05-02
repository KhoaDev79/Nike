import { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getProductsAPI, deleteProductAPI } from '../../api/productApi';
import { getAdminStatsAPI } from '../../api/orderApi';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';
import ProductFormModal from '../components/ProductFormModal';

const CATEGORIES = ['all', 'Football', 'Running', 'Basketball', 'Lifestyle', 'Gym & Training', 'Other'];

export default function AdminProductsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filter, setFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchStats();
  }, [user, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [page, catFilter, filter]);

  const fetchStats = async () => { try { const { data } = await getAdminStatsAPI(); setStats(data.data); } catch {} };
  
  const fetchProducts = async () => {
    try { 
      setLoading(true); 
      const { data } = await getProductsAPI({ 
        admin: true, 
        page, 
        limit: 12,
        search: filter !== '' ? filter : undefined,
        category: catFilter !== 'all' ? catFilter : undefined
      }); 
      setProducts(data.data); 
      setTotalPages(data.pagination.pages);
      setTotalProducts(data.pagination.total);
    }
    catch { toast.error('Không thể tải sản phẩm'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xoá sản phẩm này?')) return;
    try { await deleteProductAPI(id); toast.success('Đã xoá'); fetchProducts(); } catch { toast.error('Thất bại'); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setFilter(searchInput);
  };

  return (
    <div className='min-h-screen relative bg-[var(--color-light-gray)] text-[var(--color-text-primary)]'>
      <AdminSidebar stats={stats} />

      <main className='ml-[200px] p-6 lg:p-8 xl:p-10 relative z-10'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-end justify-between mb-6 gap-4'>
          <div>
            <h1 className='text-[24px] font-bold tracking-tight'>Sản phẩm</h1>
            <p className='text-[14px] text-[var(--color-text-secondary)] mt-0.5'>
              Đang hiển thị <span className='font-bold text-[var(--color-text-primary)]'>{products.length}</span> trên tổng số {totalProducts} mẫu giày.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <form onSubmit={handleSearch} className='relative'>
              <input type='text' placeholder='Tìm tên giày...' value={searchInput} onChange={e => setSearchInput(e.target.value)}
                className='text-[14px] bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] outline-none pl-9 pr-4 py-2.5 rounded-[24px] w-64 focus:border-[var(--color-nike-black)] focus:ring-1 focus:ring-[var(--color-nike-black)] transition-colors' />
              <button type="submit" className='absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-nike-black)] transition-colors cursor-pointer'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/></svg>
              </button>
            </form>
            <button onClick={() => { setEditingProduct(null); setShowModal(true); }}
              className='flex items-center gap-2 px-6 py-2.5 rounded-[30px] text-[14px] font-bold bg-[var(--color-nike-black)] text-[var(--color-nike-white)] hover:bg-[var(--color-text-secondary)] transition-colors cursor-pointer'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4'/></svg>
              Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className='flex items-center gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar'>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setCatFilter(cat); setPage(1); }}
              className={`px-5 py-2 rounded-[30px] text-[12px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer ${
                catFilter === cat 
                  ? 'bg-[var(--color-nike-black)] text-[var(--color-nike-white)] border border-[var(--color-nike-black)]' 
                  : 'bg-[var(--color-nike-white)] text-[var(--color-text-primary)] border border-[var(--color-border-secondary)] hover:border-[var(--color-nike-black)]'
              }`}>
              {cat === 'all' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className='animate-pulse bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] rounded-[20px] p-4'>
                <div className='aspect-[4/3] bg-[var(--color-light-gray)] rounded-[8px] mb-4' />
                <div className='h-3 bg-[var(--color-light-gray)] rounded w-2/3 mb-2' />
                <div className='h-4 bg-[var(--color-light-gray)] rounded w-1/3' />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className='py-32 text-center bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] rounded-[20px]'>
            <p className='text-[32px] mb-4'>🔍</p>
            <p className='text-[16px] font-bold mb-1'>Không tìm thấy</p>
            <p className='text-[14px] text-[var(--color-text-secondary)]'>Thử từ khóa hoặc bộ lọc khác.</p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {products.map(product => {
                const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);
                const isLowStock = totalStock > 0 && totalStock <= 10;
                const isOutOfStock = totalStock === 0;

                return (
                  <div key={product._id} className='group bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] hover:border-[var(--color-nike-black)] rounded-[20px] overflow-hidden transition-colors cursor-pointer flex flex-col'>
                    {/* Image */}
                    <div className='aspect-[4/3] relative p-4 flex items-center justify-center bg-[var(--color-snow)]'>
                      <img src={product.images[0]} alt={product.name} className='w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300' />
                      
                      {/* Stock Badges */}
                      <div className='absolute top-3 left-3 flex flex-col gap-2'>
                        {isOutOfStock && (
                          <span className='px-2.5 py-1 bg-[var(--color-nike-red)] text-[var(--color-nike-white)] text-[9px] font-bold uppercase tracking-widest rounded-[4px]'>
                            Hết hàng
                          </span>
                        )}
                        {isLowStock && (
                          <span className='px-2.5 py-1 bg-[#f59e0b] text-[var(--color-nike-white)] text-[9px] font-bold uppercase tracking-widest rounded-[4px] shadow-sm'>
                            Sắp hết hàng
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Info */}
                    <div className='p-5 flex-1 flex flex-col border-t border-[var(--color-border-secondary)]'>
                      <div className='flex items-center gap-1.5 mb-2'>
                        <span className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]'>{product.category}</span>
                        <div className='w-1 h-1 rounded-full bg-[var(--color-border-secondary)]' />
                        <span className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]'>{product.tier}</span>
                      </div>
                      <h3 className='text-[14px] font-bold truncate mb-2'>{product.name}</h3>
                      <p className='text-[18px] font-black tabular-nums'>{product.price.toLocaleString('vi-VN')}đ</p>
                      
                      <div className='mt-auto pt-4 flex items-end justify-between gap-3'>
                        <div className='flex flex-wrap gap-1.5 flex-1'>
                          {product.sizes.slice(0, 5).map(s => (
                            <span key={s.size} className={`text-[10px] font-bold px-2 py-1 rounded-[4px] border ${
                              s.stock > 5 
                                ? 'border-[var(--color-border-secondary)] text-[var(--color-text-secondary)]' 
                                : s.stock > 0
                                ? 'border-[#f59e0b] text-[#f59e0b] bg-[#f59e0b]/10'
                                : 'border-[var(--color-nike-red)]/30 bg-[var(--color-nike-red)]/10 text-[var(--color-nike-red)]'
                            }`}>
                              {s.size}
                            </span>
                          ))}
                          {product.sizes.length > 5 && (
                            <span className='text-[10px] font-bold px-2 py-1 rounded-[4px] bg-[var(--color-light-gray)] text-[var(--color-text-secondary)]'>
                              +{product.sizes.length - 5}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className='flex items-center gap-1.5 shrink-0'>
                          <button onClick={(e) => { e.stopPropagation(); setEditingProduct(product); setShowModal(true); }}
                            className='w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-light-gray)] hover:bg-[var(--color-nike-black)] text-[var(--color-text-primary)] hover:text-[var(--color-nike-white)] transition-colors'>
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'/></svg>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }}
                            className='w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-light-gray)] hover:bg-[var(--color-nike-red)] text-[var(--color-nike-red)] hover:text-[var(--color-nike-white)] transition-colors'>
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'/></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className='flex items-center justify-center gap-4 mt-8 pb-12'>
                <button 
                  disabled={page === 1} 
                  onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className='w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] hover:border-[var(--color-nike-black)] disabled:opacity-30 disabled:hover:border-[var(--color-border-secondary)] cursor-pointer transition-colors'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7'/></svg>
                </button>
                <span className='text-[12px] font-bold tracking-widest uppercase'>TRANG {page} / {totalPages}</span>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className='w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] hover:border-[var(--color-nike-black)] disabled:opacity-30 disabled:hover:border-[var(--color-border-secondary)] cursor-pointer transition-colors'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7'/></svg>
                </button>
              </div>
            )}
          </>
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

