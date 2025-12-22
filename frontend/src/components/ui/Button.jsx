import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-sans font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 focus:outline-none rounded-none"; // rounded-none para estilo editorial

  const variants = {
    primary: "bg-vinilo-black text-white hover:bg-vinilo-red border border-transparent",
    secondary: "bg-white text-vinilo-black border border-gray-200 hover:border-vinilo-red hover:text-vinilo-red",
    outline: "bg-transparent text-white border border-white hover:bg-white hover:text-vinilo-black",
  };

  const sizes = {
    sm: "text-[10px] px-6 py-2",
    md: "text-xs px-8 py-3", 
    lg: "text-sm px-12 py-4",
    full: "w-full text-xs py-3"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;