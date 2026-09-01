import React, { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({ variant = 'primary', fullWidth = false, className = '', children, onClick, type = 'button', disabled = false, ...props }: ButtonProps) {
  const baseStyle = "flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100";
  
  const variants = {
    primary: "bg-primary-deep text-white hover:bg-primary-plum shadow-[0_8px_16px_-6px_rgba(142,30,99,0.4)]",
    secondary: "bg-primary-soft text-primary-deep hover:bg-primary-soft/80",
    outline: "border-2 border-border-main text-text-main hover:border-primary-soft hover:bg-primary-soft/10",
  };
  
  const sizeStyle = "px-6 py-4 text-base";
  
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizeStyle} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
