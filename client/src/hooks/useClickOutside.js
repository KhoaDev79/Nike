import { useEffect } from 'react';

/**
 * Hook xử lý click bên ngoài một element
 * @param {React.RefObject} ref - ref của element cần theo dõi
 * @param {Function} handler - callback khi click bên ngoài
 */
export default function useClickOutside(ref, handler) {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        handler();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler]);
}
