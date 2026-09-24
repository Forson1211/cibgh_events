import React from 'react';
import { cn } from '../../lib/utils';
import { ArrowRight, Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'gold' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showArrow?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      showArrow = false,
      isLoading = false,
      leftIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'group inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-[#088d01] via-[#72ac00] to-[#dccb00] hover:brightness-105 active:scale-95 text-white font-bold shadow-md hover:shadow-lg focus:ring-[#088d01]',
      secondary:
        'bg-cib-charcoal-900 hover:bg-black text-white shadow-md focus:ring-cib-charcoal-700',
      accent:
        'bg-cib-red-600 hover:bg-cib-red-700 text-white shadow-md hover:shadow-cib-red-600/20 focus:ring-cib-red-500',
      gold:
        'bg-gradient-to-r from-amber-500 to-cib-gold-600 hover:from-amber-600 hover:to-cib-gold-700 text-cib-charcoal-950 font-bold shadow-md hover:shadow-glow-gold focus:ring-amber-500',
      outline:
        'bg-white border-2 border-slate-200 hover:border-cib-green-600 hover:text-cib-green-700 text-slate-700 focus:ring-cib-green-500',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-cib-charcoal focus:ring-slate-400',
      danger:
        'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 focus:ring-rose-400',
    };

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5',
      xl: 'text-lg px-8 py-4 gap-3 font-bold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {showArrow && !isLoading && (
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
