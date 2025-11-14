import { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@shared/lib/utils';
import { ChevronDownIcon } from '@shared/ui/icons';

const formatDisplayDate = (date) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

export const DatePicker = ({
  label,
  value,
  onChange,
  error,
  className,
  placeholder = 'Select date and time',
  min,
  max,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || '');
  const [selectedTime, setSelectedTime] = useState(value ? new Date(value).toTimeString().slice(0, 5) : '');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const dateStr = date.toISOString().split('T')[0];
          setSelectedDate(dateStr);
          setSelectedTime(date.toTimeString().slice(0, 5));
        } else {
          setSelectedDate('');
          setSelectedTime('');
        }
      } catch {
        setSelectedDate('');
        setSelectedTime('');
      }
    } else {
      setSelectedDate('');
      setSelectedTime('');
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      const datetime = `${date}T${selectedTime}`;
      onChange?.(datetime);
    } else if (date) {
      const datetime = `${date}T00:00`;
      onChange?.(datetime);
    } else {
      onChange?.('');
    }
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    if (selectedDate && time) {
      const datetime = `${selectedDate}T${time}`;
      onChange?.(datetime);
    } else if (selectedDate) {
      const datetime = `${selectedDate}T00:00`;
      onChange?.(datetime);
    }
  };

  const handleClear = () => {
    setSelectedDate('');
    setSelectedTime('');
    onChange?.('');
    setIsOpen(false);
  };

  const handleOpen = () => {
    if (selectedDate && !isOpen) {
      const date = new Date(selectedDate);
      if (!isNaN(date.getTime())) {
        setDisplayYear(date.getFullYear());
        setDisplayMonth(date.getMonth());
      }
    }
    setIsOpen(!isOpen);
  };

  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [displayYear, setDisplayYear] = useState(currentYear);
  const [displayMonth, setDisplayMonth] = useState(currentMonth);

  const calendarDays = useMemo(() => {
    const getDaysInMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
      return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(displayYear, displayMonth);
    const firstDay = getFirstDayOfMonth(displayYear, displayMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [displayYear, displayMonth]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const handleDayClick = (day) => {
    if (day === null) return;
    const dateStr = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    handleDateChange(dateStr);
  };

  const isSelectedDay = (day) => {
    if (day === null || !selectedDate) return false;
    const dateStr = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === selectedDate;
  };

  const isToday = (day) => {
    if (day === null) return false;
    const dateStr = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === today;
  };

  return (
    <div className={cn('w-full', className)} ref={containerRef}>
      {label && (
        <label className="block text-sm sm:text-base font-medium text-text-muted mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          ref={inputRef}
          onClick={handleOpen}
          className={cn(
            'w-full h-[44px] sm:h-[48px] px-4 text-sm sm:text-base search-input',
            'bg-bg-card border border-border-subtle rounded-[12px] text-text-main',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
            'transition-all duration-200 placeholder:text-text-soft',
            'backdrop-blur-sm cursor-pointer flex items-center justify-between',
            error && 'border-red-500 focus:ring-red-500',
            isOpen && 'ring-2 ring-primary border-primary'
          )}
        >
          <span className={cn('flex-1', !value && 'text-text-soft')}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
          <ChevronDownIcon
            className={cn(
              'w-4 h-4 text-text-soft transition-transform duration-200',
              isOpen && 'transform rotate-180'
            )}
          />
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-full sm:w-auto min-w-[320px] bg-bg-card border border-border-subtle rounded-[12px] shadow-lg p-4 animate-[dropdown_0.2s_ease-out] backdrop-blur-sm card-elevated">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-primary-subtle hover:text-primary rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-base font-semibold text-text-main">
                  {monthNames[displayMonth]} {displayYear}
                </h3>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-primary-subtle hover:text-primary rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-xs font-semibold text-text-muted text-center py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    disabled={day === null}
                    className={cn(
                      'h-9 w-9 rounded-lg text-sm font-medium transition-all duration-200',
                      day === null && 'cursor-default',
                      day !== null && 'hover:bg-primary-subtle hover:text-primary',
                      isSelectedDay(day) && 'bg-primary text-text-on-primary',
                      isToday(day) && !isSelectedDay(day) && 'bg-primary-subtle text-primary font-bold',
                      !isSelectedDay(day) && !isToday(day) && day !== null && 'text-text-main'
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-border-subtle">
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full h-[44px] px-4 text-sm sm:text-base bg-bg-elevated border border-border-subtle rounded-[12px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-elevated rounded-lg transition-colors duration-200"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium bg-primary text-text-on-primary rounded-lg hover:bg-primary-soft transition-colors duration-200"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

