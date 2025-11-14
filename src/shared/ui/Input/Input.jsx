import { forwardRef } from 'react';
import { cn } from '@shared/lib/utils';

export const Input = forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm sm:text-base font-medium text-text-muted mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full h-[44px] sm:h-[48px] px-4 text-sm sm:text-base search-input',
          'bg-bg-card border border-border-subtle rounded-[12px] text-text-main',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
          'transition-all duration-200 placeholder:text-text-soft',
          'backdrop-blur-sm',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

