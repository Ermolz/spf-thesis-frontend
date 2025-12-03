import { useEffect } from 'react';
import { cn } from '@shared/lib/utils';
import { CloseIcon } from '@shared/ui/icons';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
  };

  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        className={cn(
          'bg-bg-card rounded-lg shadow-xl w-full my-auto border border-border-subtle',
          'max-w-full',
          sizeClasses[size],
          'max-h-[90vh] overflow-y-auto'
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border-subtle sticky top-0 bg-bg-card z-10">
            <h2 className="text-lg sm:text-xl font-semibold text-text-main pr-2">{title}</h2>
            <button
              onClick={onClose}
              className="text-text-soft hover:text-text-main transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>
        )}
        <div className="p-4 sm:p-6">{children}</div>
        {footer && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6 border-t border-border-subtle sticky bottom-0 bg-bg-card">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

