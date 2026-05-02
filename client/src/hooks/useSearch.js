import { useState, useEffect } from 'react';
import { getProductsAPI } from '../api/productApi';

/**
 * Hook quản lý search với debounce + autocomplete
 * Tách logic nghiệp vụ ra khỏi Header component
 */
export default function useSearch() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Real-time suggestions with debounce
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await getProductsAPI({ search: search.trim(), limit: 5 });
        setSuggestions(data?.data || []);
      } catch (err) {
        console.error('Failed to get suggestions:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Re-open dropdown when query changes
  useEffect(() => {
    if (search.trim()) {
      setShowDropdown(true);
    }
  }, [search]);

  const clearSearch = () => {
    setSearch('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return {
    search,
    setSearch,
    suggestions,
    loading,
    showDropdown,
    setShowDropdown,
    clearSearch,
  };
}
