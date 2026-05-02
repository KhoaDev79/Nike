import { useNavigate } from 'react-router-dom';
import useSearch from '../../hooks/useSearch';
import useClickOutside from '../../hooks/useClickOutside';
import { useRef } from 'react';

export default function SearchBar() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const {
    search,
    setSearch,
    suggestions,
    loading: suggestLoading,
    showDropdown,
    setShowDropdown,
    clearSearch,
  } = useSearch();

  useClickOutside(searchRef, () => setShowDropdown(false));

  const handleSelectSuggestion = (slug) => {
    navigate(`/product/${slug}`);
    clearSearch();
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      clearSearch();
    }
  };

  return (
    <div ref={searchRef} className='relative shrink-0'>
      <input
        type='text'
        placeholder='Tìm kiếm...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onClick={() => setShowDropdown(true)}
        onKeyDown={handleSearch}
        className='w-28 sm:w-36 md:w-40 focus:w-48 transition-all duration-300 bg-zinc-800/40 hover:bg-zinc-800/70 border border-white/5 hover:border-white/10 text-white placeholder-zinc-500 rounded-full px-4 py-1.5 pl-8 text-xs focus:ring-1 focus:ring-white focus:outline-none focus:bg-zinc-800/80 h-9 shadow-inner select-text'
      />
      <svg
        className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-60 text-zinc-400 pointer-events-none'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        viewBox='0 0 24 24'
      >
        <circle cx='11' cy='11' r='8' />
        <path d='m21 21-4.35-4.35' />
      </svg>

      {/* Autocomplete Dropdown */}
      {showDropdown && search.trim() !== '' && (
        <div className='absolute right-0 top-full mt-2 w-64 md:w-80 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-2 z-[60] animate-scale-up dropdown-scrollbar max-h-80 overflow-y-auto'>
          {suggestLoading ? (
            <div className='flex flex-col gap-2 px-1'>
              <div className='h-12 bg-zinc-800/80 rounded-xl animate-pulse w-full' />
              <div className='h-12 bg-zinc-800/80 rounded-xl animate-pulse w-full' />
            </div>
          ) : suggestions.length > 0 ? (
            <div className='flex flex-col gap-1'>
              {suggestions.map((p) => (
                <button
                  key={p._id}
                  onClick={() => handleSelectSuggestion(p.slug)}
                  className='flex items-center gap-3 p-2 hover:bg-zinc-800/80 rounded-xl transition text-left group'
                >
                  <div className='w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden shrink-0 border border-zinc-700/40 p-1'>
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className='w-full h-full object-contain group-hover:scale-110 transition duration-300'
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h4 className='text-xs font-bold text-white uppercase truncate group-hover:text-blue-400 transition leading-tight'>
                      {p.name}
                    </h4>
                    <p className='text-[10px] text-zinc-400 mt-0.5'>
                      {p.price?.toLocaleString('vi-VN')}đ • {p.category}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className='text-xs text-zinc-400 px-1 italic text-center'>Không tìm thấy sản phẩm nào.</p>
          )}
        </div>
      )}
    </div>
  );
}
