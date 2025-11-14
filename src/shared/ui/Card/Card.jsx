import { cn } from '@shared/lib/utils';

export const Card = ({ children, className, onClick, variant = 'default' }) => {
  return (
    <div
      className={cn(
        'project-card bg-bg-card rounded-[18px] p-5 sm:p-6 border border-border-subtle',
        'backdrop-blur-sm',
        variant === 'elevated' && 'card-elevated',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => {
  return (
    <div className={cn('mb-3 sm:mb-4', className)}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className }) => {
  return (
    <h3 className={cn('text-lg sm:text-xl font-semibold text-text-main leading-tight', className)}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className }) => {
  return (
    <div className={cn('text-sm sm:text-base text-text-muted leading-relaxed', className)}>
      {children}
    </div>
  );
};
