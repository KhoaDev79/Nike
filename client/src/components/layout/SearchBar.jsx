import { useNavigate } from 'react-router-dom';
import useSearch from '../../hooks/useSearch';
import useClickOutside from '../../hooks/useClickOutside';
import { useRef, useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

export default function SearchBar() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    search,
    setSearch,
    suggestions,
    loading: suggestLoading,
    showDropdown,
    setShowDropdown,
    clearSearch,
  } = useSearch();

  useClickOutside(searchRef, () => {
    setShowDropdown(false);
    if (!search) setIsExpanded(false);
  });

  const handleSelectSuggestion = (slug) => {
    navigate(`/product/${slug}`);
    clearSearch();
    setIsExpanded(false);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      clearSearch();
      setIsExpanded(false);
    }
  };

  const toggleSearch = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div ref={searchRef} className='relative shrink-0 flex items-center'>
      <div
        className={`relative flex items-center overflow-hidden transition-all duration-500 ease-out border ${
          isExpanded
            ? 'w-64 bg-zinc-800/80 border-white/20 px-4 h-10 rounded-full shadow-inner'
            : 'w-10 h-10 bg-transparent hover:bg-zinc-800/40 border-transparent rounded-full cursor-pointer justify-center'
        }`}
        onClick={!isExpanded ? toggleSearch : undefined}
      >
        <SearchIcon
          className={`shrink-0 transition-colors duration-300 ${
            isExpanded ? 'text-zinc-400 mr-3 w-4 h-4' : 'text-white w-5 h-5'
          }`}
          strokeWidth={isExpanded ? 2.5 : 2}
        />

        <input
          ref={inputRef}
          type='text'
          placeholder='Tìm kiếm sản phẩm...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleSearch}
          className={`bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none w-full transition-all duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 w-0'
          }`}
        />
        
        {isExpanded && search && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSearch('');
              inputRef.current?.focus();
            }}
            className='text-zinc-400 hover:text-white shrink-0 ml-2 p-1 rounded-full hover:bg-zinc-700/50 transition-colors'
          >
             <X className='w-4 h-4' strokeWidth={2.5} />
          </button>
        )}
      </div>

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
