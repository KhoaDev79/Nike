import React from 'react';

const Badge = ({ children, variant = 'status', className = '' }) => {
  // DESIGN.md: no shadows, tight spacing
  const baseClasses = 'text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full';
  
  const variants = {
    discount: 'bg-[var(--color-nike-red)] text-[var(--color-nike-white)]',
    status: 'bg-[var(--color-nike-black)] text-[var(--color-nike-white)]',
    tier: 'bg-transparent text-[var(--color-nike-black)] border border-[var(--color-nike-black)]',
    outline: 'bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border-secondary)]'
  };

  return (
    <span className={`${baseClasses} ${variants[variant] || variants.status} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
