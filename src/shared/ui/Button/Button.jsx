import { cn } from '@shared/lib/utils';
import { SpinnerIcon } from '@shared/ui/icons';

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  isLoading,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-[12px] font-semibold button-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-body disabled:opacity-50 disabled:pointer-events-none transition-all duration-200';
  
  const variants = {
    primary: 'bg-primary text-text-on-primary hover:bg-primary-soft focus:ring-primary shadow-lg shadow-primary/20',
    secondary: 'bg-primary-subtle text-text-main hover:bg-primary-soft focus:ring-primary border border-primary/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary-subtle focus:ring-primary bg-transparent',
    ghost: 'text-text-muted hover:bg-bg-card focus:ring-primary border border-border-subtle',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-600/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm sm:text-base',
    lg: 'px-6 py-3 text-base sm:text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

