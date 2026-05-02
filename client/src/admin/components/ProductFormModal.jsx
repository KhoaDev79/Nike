import { useState, useEffect } from 'react';
import { createProductAPI, updateProductAPI } from '../../api/productApi';
import toast from 'react-hot-toast';

const TIERS = ['Elite', 'Pro', 'Academy', 'Club'];
const SURFACES = ['FG', 'AG', 'TF', 'IC', 'SG', 'MG'];
const CATEGORIES = ['Phantom', 'Mercurial', 'Tiempo', 'Vapor', 'Lifestyle', 'Running', 'Gym & Training', 'Other'];

const empty = {
  name: '', sku: '', description: '', price: '', originalPrice: '', weight: '',
  tier: 'Academy', surfaceType: 'TF', category: 'Phantom',
  isFeatured: false, isActive: true,
  images: [''],
  sizes: [{ size: 39, stock: 10 }, { size: 40, stock: 10 }, { size: 41, stock: 10 }, { size: 42, stock: 10 }],
  specs: [],
};

export default function ProductFormModal({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '', sku: product.sku || '', description: product.description || '',
        price: product.price || '', originalPrice: product.originalPrice || '', weight: product.weight || '',
        tier: product.tier || 'Academy', surfaceType: product.surfaceType || 'TF',
        category: product.category || 'Phantom',
        isFeatured: product.isFeatured ?? false, isActive: product.isActive ?? true,
        images: product.images?.length ? [...product.images] : [''],
        sizes: product.sizes?.length ? product.sizes.map(s => ({ size: s.size, stock: s.stock })) : [{ size: 39, stock: 0 }],
        specs: product.specs?.length ? [...product.specs] : [],
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

  // Specs
  const setSpec = (i, k, v) => { const s = [...form.specs]; s[i] = { ...s[i], [k]: v }; set('specs', s); };
  const addSpec = () => set('specs', [...form.specs, { key: '', value: '' }]);
  const removeSpec = (i) => set('specs', form.specs.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      images: form.images.filter(Boolean),
      specs: form.specs.filter(s => s.key && s.value),
    };
    if (!payload.name || !payload.price || !payload.description) return toast.error('Thiếu tên, giá hoặc mô tả');
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
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--color-nike-black)]/40 backdrop-blur-sm'>
      <div className='w-full max-w-3xl max-h-[90vh] bg-[var(--color-nike-white)] rounded-[20px] shadow-2xl flex flex-col overflow-hidden border border-[var(--color-border-secondary)]'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-[var(--color-border-secondary)] shrink-0'>
          <h2 className='text-[18px] font-bold'>{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button onClick={onClose} className='w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-light-gray)] hover:bg-[var(--color-hover-gray)] transition-colors cursor-pointer'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12'/></svg>
          </button>
        </div>

        {/* Form Body */}
        <div className='flex-1 overflow-y-auto p-6'>
          <form id='product-form' onSubmit={handleSubmit} className='space-y-8'>
            
            {/* General Info */}
            <div>
              <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-4 border-b border-[var(--color-border-secondary)] pb-2'>Thông tin cơ bản</p>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='md:col-span-2'>
                  <label className='text-[12px] font-bold block mb-2'>Tên sản phẩm *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder='Nike Phantom GX 2 Elite FG...'
                    className='w-full text-[14px] px-4 py-3 rounded-[12px] outline-none border border-[var(--color-border-secondary)] focus:border-[var(--color-nike-black)] focus:ring-1 focus:ring-[var(--color-nike-black)] transition-colors bg-[var(--color-nike-white)]' />
                </div>
                
                <div>
                  <label className='text-[12px] font-bold block mb-2'>Mã sản phẩm (SKU)</label>
                  <input value={form.sku} onChange={e => set('sku', e.target.value)} placeholder='Tự động tạo nếu để trống'
                    className='w-full text-[14px] px-4 py-3 rounded-[12px] outline-none border border-[var(--color-border-secondary)] focus:border-[var(--color-nike-black)] focus:ring-1 focus:ring-[var(--color-nike-black)] transition-colors bg-[var(--color-snow)]' />
                </div>

                <div>
                  <label className='text-[12px] font-bold block mb-2'>Trọng lượng (gram)</label>
                  <input type='number' value={form.weight} onChange={e => set('weight', e.target.value)} placeholder='Ví dụ: 210'
                    className='w-full text-[14px] px-4 py-3 rounded-[12px] outline-none border border-[var(--color-border-secondary)] focus:border-[var(--color-nike-black)] focus:ring-1 focus:ring-[var(--color-nike-black)] transition-colors bg-[var(--color-nike-white)]' />
                </div>

                <div>
                  <label className='text-[12px] font-bold block mb-2'>Giá bán (VNĐ) *</label>
                  <input type='number' value={form.price} onChange={e => set('price', e.target.value)} required placeholder='2450000'
                    className='w-full text-[14px] px-4 py-3 rounded-[12px] outline-none border border-[var(--color-border-secondary)] focus:border-[var(--color-nike-black)] focus:ring-1 focus:ring-[var(--color-nike-black)] transition-colors bg-[var(--color-nike-white)] font-bold tabular-nums' />
                </div>

                <div>
                  <label className='text-[12px] font-bold block mb-2'>Giá gốc (VNĐ)</label>
                  <input type='number' value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder='2990000'
                    className='w-full text-[14px] px-4 py-3 rounded-[12px] outline-none border border-[var(--color-border-secondary)] focus:border-[var(--color-nike-black)] focus:ring-1 focus:ring-[var(--color-nike-black)] transition-colors bg-[var(--color-nike-white)] tabular-nums' />
                </div>
              </div>
            </div>

            {/* Classification */}
            <div>
              <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-4 border-b border-[var(--color-border-secondary)] pb-2'>Phân loại</p>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {[['Dòng giày', 'category', CATEGORIES], ['Phân khúc', 'tier', TIERS], ['Loại sân', 'surfaceType', SURFACES]].map(([label, key, opts]) => (
                  <div key={key}>
                    <label className='text-[12px] font-bold block mb-2'>{label}</label>
                    <select value={form[key]} onChange={e => set(key, e.target.value)}
                      className='w-full text-[14px] px-4 py-3 rounded-[12px] outline-none appearance-none cursor-pointer border border-[var(--color-border-secondary)] focus:border-[var(--color-nike-black)] bg-[var(--color-snow)] font-bold'>
                      {opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Specs */}
            <div>
              <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-4 border-b border-[var(--color-border-secondary)] pb-2'>Mô tả & Thông số</p>
              <div className='space-y-4'>
                <div>
                  <label className='text-[12px] font-bold block mb-2'>Mô tả chi tiết *</label>
                  <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={4} placeholder='Cảm nhận sự khác biệt với Nike...'
                    className='w-full text-[14px] px-4 py-3 rounded-[12px] outline-none resize-y min-h-[100px] border border-[var(--color-border-secondary)] focus:border-[var(--color-nike-black)] focus:ring-1 focus:ring-[var(--color-nike-black)] transition-colors bg-[var(--color-nike-white)] leading-relaxed' />
                </div>
                
                {/* Dynamic Specs */}
                <div>
                  <div className='flex items-center justify-between mb-3'>
                    <label className='text-[12px] font-bold'>Thông số kỹ thuật</label>
                    <button type='button' onClick={addSpec} className='text-[12px] font-bold text-[var(--color-nike-black)] hover:underline cursor-pointer'>+ Thêm thông số</button>
                  </div>
                  <div className='space-y-2'>
                    {form.specs.map((s, i) => (
                      <div key={i} className='flex gap-2'>
                        <input value={s.key} onChange={e => setSpec(i, 'key', e.target.value)} placeholder='VD: Upper'
                          className='flex-1 text-[12px] px-3 py-2 rounded-[8px] outline-none border border-[var(--color-border-secondary)] focus:border-[var(--color-nike-black)]' />
                        <input value={s.value} onChange={e => setSpec(i, 'value', e.target.value)} placeholder='VD: Flyknit'
                          className='flex-[2] text-[12px] px-3 py-2 rounded-[8px] outline-none border border-[var(--color-border-secondary)] focus:border-[var(--color-nike-black)]' />
                        <button type='button' onClick={() => removeSpec(i)} className='w-9 shrink-0 flex items-center justify-center text-[var(--color-nike-red)] hover:bg-[var(--color-nike-red)]/10 rounded-[8px] transition-colors'>✕</button>
                      </div>
                    ))}
                    {form.specs.length === 0 && <p className='text-[12px] text-[var(--color-text-secondary)] italic'>Chưa có thông số nào.</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <div className='flex items-center justify-between mb-4 border-b border-[var(--color-border-secondary)] pb-2'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]'>Hình ảnh (URL) *</p>
                <button type='button' onClick={addImage} className='text-[12px] font-bold text-[var(--color-nike-black)] hover:underline cursor-pointer'>+ Thêm ảnh</button>
              </div>
              <div className='space-y-3'>
                {form.images.map((img, i) => (
                  <div key={i} className='flex gap-3 items-center'>
                    <input value={img} onChange={e => setImage(i, e.target.value)} placeholder='https://images.nike.com/...' required
                      className='flex-1 text-[12px] px-4 py-2.5 rounded-[8px] outline-none border border-[var(--color-border-secondary)] focus:border-[var(--color-nike-black)] transition-colors' />
                    {img && <div className='w-12 h-12 rounded-[8px] border border-[var(--color-border-secondary)] overflow-hidden shrink-0 bg-[var(--color-snow)] p-1'><img src={img} className='w-full h-full object-contain mix-blend-multiply' alt='' /></div>}
                    {form.images.length > 1 && <button type='button' onClick={() => removeImage(i)} className='w-8 h-8 flex items-center justify-center text-[var(--color-nike-red)] hover:bg-[var(--color-nike-red)]/10 rounded-[8px] transition-colors'>✕</button>}
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes & Stock */}
            <div>
              <div className='flex items-center justify-between mb-4 border-b border-[var(--color-border-secondary)] pb-2'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]'>Kích cỡ & Tồn kho *</p>
                <button type='button' onClick={addSize} className='text-[12px] font-bold text-[var(--color-nike-black)] hover:underline cursor-pointer'>+ Thêm Size</button>
              </div>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {form.sizes.map((s, i) => (
                  <div key={i} className='flex flex-col gap-2 p-3 rounded-[12px] border border-[var(--color-border-secondary)] bg-[var(--color-snow)] relative group'>
                    <div className='flex justify-between items-center'>
                      <label className='text-[10px] font-bold uppercase text-[var(--color-text-secondary)]'>EU Size</label>
                      <input type='number' value={s.size} onChange={e => setSize(i, 'size', e.target.value)}
                        className='w-12 text-right bg-transparent text-[14px] font-bold outline-none' />
                    </div>
                    <div className='flex justify-between items-center border-t border-[var(--color-border-secondary)] pt-2'>
                      <label className='text-[10px] font-bold uppercase text-[var(--color-text-secondary)]'>Stock</label>
                      <input type='number' value={s.stock} onChange={e => setSize(i, 'stock', e.target.value)} min={0}
                        className='w-16 text-right bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] rounded-[4px] px-1 text-[14px] font-bold outline-none tabular-nums' />
                    </div>
                    {form.sizes.length > 1 && (
                      <button type='button' onClick={() => removeSize(i)} className='absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[var(--color-nike-red)] text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm'>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className='flex gap-8 p-4 rounded-[12px] bg-[var(--color-snow)] border border-[var(--color-border-secondary)]'>
              {[['Nổi bật (Featured)', 'isFeatured'], ['Hiển thị (Active)', 'isActive']].map(([label, key]) => (
                <label key={key} className='flex items-center gap-3 cursor-pointer'>
                  <div className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${form[key] ? 'bg-[var(--color-nike-black)]' : 'bg-[var(--color-border-secondary)]'}`}>
                    <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${form[key] ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <input type='checkbox' className='sr-only' checked={form[key]} onChange={(e) => set(key, e.target.checked)} />
                  <span className='text-[12px] font-bold'>{label}</span>
                </label>
              ))}
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className='p-6 border-t border-[var(--color-border-secondary)] bg-[var(--color-snow)] flex justify-end gap-3 shrink-0'>
          <button type='button' onClick={onClose} className='px-6 py-3 rounded-full text-[14px] font-bold bg-[var(--color-nike-white)] border border-[var(--color-border-secondary)] hover:border-[var(--color-nike-black)] transition-colors cursor-pointer'>
            Hủy
          </button>
          <button type='submit' form='product-form' disabled={saving} className='px-8 py-3 rounded-full text-[14px] font-bold bg-[var(--color-nike-black)] text-[var(--color-nike-white)] hover:bg-[var(--color-text-secondary)] transition-colors disabled:opacity-50 cursor-pointer shadow-md'>
            {saving ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Thêm sản phẩm'}
          </button>
        </div>
      </div>
    </div>
  );
}
