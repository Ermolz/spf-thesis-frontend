import { useState, useRef, useEffect } from 'react';
import { cn } from '@shared/lib/utils';
import { ChevronDownIcon, CheckIcon } from '@shared/ui/icons';

export const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue) => {
    if (!disabled) {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-text-muted mb-1">
          {label}
        </label>
      )}
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            'w-full h-[44px] sm:h-[48px] px-4 text-sm sm:text-base',
            'bg-bg-card border rounded-[18px]',
            'flex items-center justify-between',
            'transition-all duration-150 ease-out',
            'focus:outline-none',
            disabled
              ? 'bg-[#020617] text-text-soft border-border-subtle cursor-not-allowed'
              : error
              ? 'border-[#EF4444] text-text-main'
              : 'border-border-subtle text-text-main hover:bg-bg-card-hover hover:border-border-strong focus:border-primary focus:shadow-[0_0_0_1px_rgba(59,130,246,0.5)]'
          )}
        >
          <span
            className={cn(
              'flex-1 text-left truncate',
              !selectedOption && 'text-text-soft'
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon
            className={cn(
              'w-4 h-4 flex-shrink-0 ml-2 transition-transform duration-[120ms]',
              isOpen && 'rotate-180',
              'text-text-soft'
            )}
          />
        </button>

        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            className={cn(
              'absolute z-50 w-full mt-1',
              'bg-bg-elevated border border-border-subtle rounded-[18px]',
              'shadow-soft max-h-[280px] overflow-y-auto',
              'origin-top'
            )}
            style={{
              animation: 'dropdown 0.16s ease-out',
            }}
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-center text-text-soft text-sm">
                No options
              </div>
            ) : (
              <div className="py-1">
                {options.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        'w-full h-[36px] sm:h-[40px] px-3 sm:px-4',
                        'flex items-center justify-between',
                        'text-sm sm:text-base text-text-main',
                        'transition-colors duration-[120ms] ease-out',
                        isSelected
                          ? 'bg-primary-subtle'
                          : 'hover:bg-bg-card-hover'
                      )}
                    >
                      <span className="flex-1 text-left truncate">
                        {option.label}
                      </span>
                      {isSelected && (
                        <CheckIcon className="w-4 h-4 text-primary flex-shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-[#FCA5A5]">{error}</p>
      )}
    </div>
  );
};

