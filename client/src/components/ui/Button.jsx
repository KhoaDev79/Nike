import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  // DESIGN.md: 30px pill radius, ~12px 24px padding, 16px/500 Helvetica Now Text Medium
  // Hover: no lift effect. Transition: background 200ms ease. Focus: 2px ring.
  
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(39,93,197,1)] focus:ring-offset-2 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--color-nike-black)] text-[var(--color-nike-white)] rounded-[30px] px-6 py-3 hover:bg-[var(--color-text-secondary)] disabled:bg-[var(--color-hover-gray)] disabled:text-[var(--color-text-disabled)]',
    
    primaryDark: 'bg-[var(--color-nike-white)] text-[var(--color-nike-black)] rounded-[30px] px-6 py-3 hover:bg-[var(--color-border-secondary)]',
    
    secondary: 'bg-transparent text-[var(--color-nike-black)] border-[1.5px] border-[var(--color-border-secondary)] rounded-[30px] px-6 py-3 hover:border-[var(--color-text-secondary)] hover:bg-[var(--color-hover-gray)] disabled:bg-[var(--color-hover-gray)] disabled:text-[var(--color-text-disabled)]',
    
    icon: 'bg-[var(--color-light-gray)] text-[var(--color-nike-black)] rounded-full p-2 hover:bg-[var(--color-text-secondary)] hover:text-[var(--color-nike-white)]',
    
    ghost: 'bg-transparent text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)]'
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
