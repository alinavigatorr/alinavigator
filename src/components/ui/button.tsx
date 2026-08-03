'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none select-none";
    
    const variants = {
      primary: "bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary))]/90 shadow-[0_0_15px_rgba(20,184,166,0.15)] hover:shadow-[0_0_25px_rgba(20,184,166,0.3)]",
      secondary: "bg-white/5 text-[rgb(var(--text-primary))] hover:bg-white/10 border border-white/5",
      outline: "border border-white/20 bg-transparent text-[rgb(var(--text-primary))] hover:bg-white/5 hover:border-[rgb(var(--primary))]/50",
      ghost: "bg-transparent text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))] hover:bg-white/5",
      icon: "bg-transparent text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))] hover:bg-white/10 border border-transparent hover:border-white/10 rounded-full",
    };

    const sizes = {
      sm: "h-8 px-4 text-xs rounded-[var(--radius-sm)]",
      md: "h-10 px-5 text-sm rounded-[var(--radius-md)]",
      lg: "h-12 px-8 text-base rounded-[var(--radius-md)]",
      icon: "h-10 w-10 p-2",
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    const motionProps = props as HTMLMotionProps<"button">;

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        className={classes}
        whileTap={disabled ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        {...motionProps}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';