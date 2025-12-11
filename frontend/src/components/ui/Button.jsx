import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  
  // Estilos base obligatorios para todos los botones (Minimalismo Mattelsa)
  const baseStyles = "inline-flex items-center justify-center font-sans font-bold uppercase tracking-widest transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none";

  // Variantes de estilo
  const variants = {
    primary: "bg-vinilo-black text-white hover:bg-vinilo-red hover:text-white border border-transparent",
    secondary: "bg-white text-vinilo-black hover:bg-vinilo-red hover:text-white border border-transparent shadow-sm",
    outline: "bg-transparent text-vinilo-black border border-vinilo-black hover:bg-vinilo-black hover:text-white hover:border-vinilo-black",
    ghost: "bg-transparent text-vinilo-black hover:text-vinilo-red underline decoration-1 underline-offset-4"
  };

  // Tamaños (Mattelsa usa botones con texto pequeño pero mucho padding)
  const sizes = {
    sm: "text-[10px] px-5 py-2",
    md: "text-xs px-8 py-3", // Tamaño estándar
    lg: "text-sm px-10 py-4",
    full: "w-full text-xs py-3"
  };

  // Combinamos las clases
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;