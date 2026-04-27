import { useState } from 'react';

const TIERS = ['Elite', 'Pro', 'Academy'];
const SURFACE_TYPES = ['FG', 'AG', 'TF', 'IC', 'SG'];
const CATEGORIES = ['Phantom', 'Mercurial', 'Tiempo', 'Vapor', 'Other'];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Mới nhất' },
  { value: 'price', label: 'Giá tăng dần' },
  { value: '-price', label: 'Giá giảm dần' },
  { value: '-rating', label: 'Đánh giá cao' },
];

const SURFACE_LABELS = {
  FG: 'FG — Sân cỏ tự nhiên',
  AG: 'AG — Sân nhân tạo',
  TF: 'TF — Sân cứng',
  IC: 'IC — Trong nhà',
  SG: 'SG — Sân mềm',
};

function AccordionSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className='border-b border-zinc-200 pb-4 mb-4'>
      <button
        onClick={() => setOpen(!open)}
        className='w-full flex items-center justify-between text-sm font-bold uppercase tracking-widest text-gray-800 mb-3'
      >
        {title}
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          strokeWidth='2.5'
          viewBox='0 0 24 24'
        >
          <path d='m6 9 6 6 6-6' />
        </svg>
      </button>
      {open && <div className='space-y-2'>{children}</div>}
    </div>
  );
}

function CheckItem({ label, checked, onChange }) {
  return (
    <label className='flex items-center gap-2.5 cursor-pointer group'>
      <input
        type='checkbox'
        checked={checked}
        onChange={onChange}
        className='w-4 h-4 accent-black rounded cursor-pointer'
      />
      <span className='text-sm text-zinc-600 group-hover:text-black transition'>
        {label}
      </span>
    </label>
  );
}

export default function FilterSidebar({ filters, onChange, onReset }) {
  const toggle = (key, value) => {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const isChecked = (key, value) => (filters[key] || []).includes(value);
  const activeCount = [
    ...(filters.tier || []),
    ...(filters.surfaceType || []),
    ...(filters.category || []),
    ...(filters.minPrice ? ['p'] : []),
  ].length;

  return (
    <aside className='w-full'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-base font-black uppercase tracking-widest'>
          Bộ lọc
          {activeCount > 0 && (
            <span className='ml-2 bg-black text-white text-xs w-5 h-5 rounded-full inline-flex items-center justify-center'>
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className='text-xs text-zinc-400 hover:text-black underline transition'
          >
            Xoá tất cả
          </button>
        )}
      </div>

      <AccordionSection title='Sắp xếp'>
        <select
          value={filters.sort || '-createdAt'}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
          className='w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-black transition'
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </AccordionSection>

      <AccordionSection title='Phân khúc'>
        {TIERS.map((t) => (
          <CheckItem
            key={t}
            label={t}
            checked={isChecked('tier', t)}
            onChange={() => toggle('tier', t)}
          />
        ))}
      </AccordionSection>

      <AccordionSection title='Loại sân'>
        {SURFACE_TYPES.map((s) => (
          <CheckItem
            key={s}
            label={SURFACE_LABELS[s]}
            checked={isChecked('surfaceType', s)}
            onChange={() => toggle('surfaceType', s)}
          />
        ))}
      </AccordionSection>

      <AccordionSection title='Dòng giày'>
        {CATEGORIES.map((c) => (
          <CheckItem
            key={c}
            label={c}
            checked={isChecked('category', c)}
            onChange={() => toggle('category', c)}
          />
        ))}
      </AccordionSection>

      <AccordionSection title='Khoảng giá'>
        <div className='space-y-3'>
          <div>
            <label className='text-xs text-zinc-500 mb-1 block'>
              Giá tối thiểu (đ)
            </label>
            <input
              type='number'
              placeholder='0'
              value={filters.minPrice || ''}
              onChange={(e) =>
                onChange({ ...filters, minPrice: e.target.value })
              }
              className='w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition'
            />
          </div>
          <div>
            <label className='text-xs text-zinc-500 mb-1 block'>
              Giá tối đa (đ)
            </label>
            <input
              type='number'
              placeholder='10.000.000'
              value={filters.maxPrice || ''}
              onChange={(e) =>
                onChange({ ...filters, maxPrice: e.target.value })
              }
              className='w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition'
            />
          </div>
        </div>
      </AccordionSection>
    </aside>
  );
}
