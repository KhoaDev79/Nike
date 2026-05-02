import { useState, useEffect } from 'react';
import { createProductAPI, updateProductAPI } from '../../api/productApi';
import toast from 'react-hot-toast';

const inputStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' };
const muted = 'rgba(255,255,255,0.6)';
const TIERS = ['Elite', 'Pro', 'Academy'];
const SURFACES = ['FG', 'AG', 'TF', 'IC', 'SG'];
const CATEGORIES = ['Phantom', 'Mercurial', 'Tiempo', 'Vapor', 'Other'];

const empty = {
  name: '', description: '', price: '', originalPrice: '',
  tier: 'Academy', surfaceType: 'TF', category: 'Phantom',
  isFeatured: false, isActive: true,
  images: [''],
  sizes: [{ size: 39, stock: 0 }, { size: 40, stock: 0 }, { size: 41, stock: 0 }, { size: 42, stock: 0 }],
};

export default function ProductFormModal({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '', description: product.description || '',
        price: product.price || '', originalPrice: product.originalPrice || '',
        tier: product.tier || 'Academy', surfaceType: product.surfaceType || 'TF',
        category: product.category || 'Phantom',
        isFeatured: product.isFeatured ?? false, isActive: product.isActive ?? true,
        images: product.images?.length ? [...product.images] : [''],
        sizes: product.sizes?.length ? product.sizes.map(s => ({ size: s.size, stock: s.stock })) : [{ size: 39, stock: 0 }],
      });
    } else setForm(empty);
  }, [product]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Images
  const setImage = (i, v) => { const imgs = [...form.images]; imgs[i] = v; set('images', imgs); };
  const addImage = () => set('images', [...form.images, '']);
  const removeImage = (i) => set('images', form.images.filter((_, idx) => idx !== i));

  // Sizes
  const setSize = (i, k, v) => { const s = [...form.sizes]; s[i] = { ...s[i], [k]: Number(v) }; set('sizes', s); };
  const addSize = () => set('sizes', [...form.sizes, { size: 38, stock: 0 }]);
  const removeSize = (i) => set('sizes', form.sizes.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      images: form.images.filter(Boolean),
    };
    if (!payload.name || !payload.price || !payload.description) return toast.error('Thiếu tên/giá/mô tả');
    if (payload.images.length === 0) return toast.error('Cần ít nhất 1 ảnh');
    if (payload.sizes.length === 0) return toast.error('Cần ít nhất 1 size');

    try {
      setSaving(true);
      if (isEdit) await updateProductAPI(product._id, payload);
      else await createProductAPI(payload);
      toast.success(isEdit ? 'Đã cập nhật' : 'Đã thêm sản phẩm');
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thất bại');
    } finally { setSaving(false); }
  };

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4' style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className='w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6' style={{ background: 'rgba(15,20,35,0.98)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-[16px] font-bold text-white'>{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button onClick={onClose} className='w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer' style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <svg className='w-4 h-4' fill='none' stroke='rgba(255,255,255,0.5)' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12'/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Name */}
          <div>
            <label className='text-[10px] font-semibold uppercase tracking-[0.1em] block mb-1.5' style={{ color: muted }}>Tên sản phẩm *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder='Nike Phantom 6 Elite FG...'
              className='w-full text-[12px] text-white px-4 py-3 rounded-lg outline-none placeholder-white/40' style={inputStyle} />
          </div>

          {/* Price row */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-[10px] font-semibold uppercase tracking-[0.1em] block mb-1.5' style={{ color: muted }}>Giá bán (VNĐ) *</label>
              <input type='number' value={form.price} onChange={e => set('price', e.target.value)} required placeholder='2450000'
                className='w-full text-[12px] text-white px-4 py-3 rounded-lg outline-none placeholder-white/40' style={inputStyle} />
            </div>
            <div>
              <label className='text-[10px] font-semibold uppercase tracking-[0.1em] block mb-1.5' style={{ color: muted }}>Giá gốc (nếu giảm)</label>
              <input type='number' value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder='2990000'
                className='w-full text-[12px] text-white px-4 py-3 rounded-lg outline-none placeholder-white/40' style={inputStyle} />
            </div>
          </div>

          {/* Category row */}
          <div className='grid grid-cols-3 gap-4'>
            {[['Dòng giày', 'category', CATEGORIES], ['Phân khúc', 'tier', TIERS], ['Loại sân', 'surfaceType', SURFACES]].map(([label, key, opts]) => (
              <div key={key}>
                <label className='text-[10px] font-semibold uppercase tracking-[0.1em] block mb-1.5' style={{ color: muted }}>{label}</label>
                <select value={form[key]} onChange={e => set(key, e.target.value)}
                  className='w-full text-[12px] text-white px-4 py-3 rounded-lg outline-none appearance-none cursor-pointer' style={inputStyle}>
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className='text-[10px] font-semibold uppercase tracking-[0.1em] block mb-1.5' style={{ color: muted }}>Mô tả *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={3} placeholder='Mô tả sản phẩm...'
              className='w-full text-[12px] text-white px-4 py-3 rounded-lg outline-none resize-none placeholder-white/40' style={inputStyle} />
          </div>

          {/* Images */}
          <div>
            <div className='flex items-center justify-between mb-1.5'>
              <label className='text-[10px] font-semibold uppercase tracking-[0.1em]' style={{ color: muted }}>Ảnh (URL) *</label>
              <button type='button' onClick={addImage} className='text-[10px] text-[#a78bfa] hover:underline cursor-pointer'>+ Thêm ảnh</button>
            </div>
            {form.images.map((img, i) => (
              <div key={i} className='flex gap-2 mb-2'>
                <input value={img} onChange={e => setImage(i, e.target.value)} placeholder='https://cdn.hstatic.net/...'
                  className='flex-1 text-[12px] text-white px-4 py-2.5 rounded-lg outline-none placeholder-white/40' style={inputStyle} />
                {img && <div className='w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-zinc-800 p-0.5'><img src={img} className='w-full h-full object-contain' alt='' /></div>}
                {form.images.length > 1 && <button type='button' onClick={() => removeImage(i)} className='text-red-400 hover:text-red-300 px-1 cursor-pointer'>✕</button>}
              </div>
            ))}
          </div>

          {/* Sizes */}
          <div>
            <div className='flex items-center justify-between mb-1.5'>
              <label className='text-[10px] font-semibold uppercase tracking-[0.1em]' style={{ color: muted }}>Size & Tồn kho *</label>
              <button type='button' onClick={addSize} className='text-[10px] text-[#a78bfa] hover:underline cursor-pointer'>+ Thêm size</button>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
              {form.sizes.map((s, i) => (
                <div key={i} className='flex items-center gap-1 p-2 rounded-lg' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className='flex-1'>
                    <p className='text-[8px] uppercase mb-0.5' style={{ color: muted }}>EU</p>
                    <input type='number' value={s.size} onChange={e => setSize(i, 'size', e.target.value)}
                      className='w-full text-[12px] text-white bg-transparent outline-none font-bold' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-[8px] uppercase mb-0.5' style={{ color: muted }}>SL</p>
                    <input type='number' value={s.stock} onChange={e => setSize(i, 'stock', e.target.value)} min={0}
                      className='w-full text-[12px] text-white bg-transparent outline-none font-bold' />
                  </div>
                  {form.sizes.length > 1 && <button type='button' onClick={() => removeSize(i)} className='text-red-400 hover:text-red-300 text-[10px] cursor-pointer mt-2'>✕</button>}
                </div>
              ))}
            </div>
          </div>



          {/* Toggles */}
          <div className='flex gap-6 p-4 rounded-xl' style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[['Nổi bật', 'isFeatured'], ['Hiển thị', 'isActive']].map(([label, key]) => (
              <label key={key} className='flex items-center gap-2 cursor-pointer'>
                <button type='button' onClick={() => set(key, !form[key])}
                  className='w-10 h-5 rounded-full relative transition-all cursor-pointer' style={{ background: form[key] ? '#0d9488' : 'rgba(255,255,255,0.1)' }}>
                  <div className='w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all' style={{ left: form[key] ? 21 : 3 }} />
                </button>
                <span className='text-[11px] text-white/60'>{label}</span>
              </label>
            ))}
          </div>

          {/* Submit */}
          <button type='submit' disabled={saving}
            className='w-full py-3.5 rounded-xl text-[11px] font-semibold text-white cursor-pointer transition-all disabled:opacity-50'
            style={{ background: 'linear-gradient(135deg, #7c3aed, #0d9488)', border: 'none' }}>
            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
          </button>
        </form>
      </div>
    </div>
  );
}
