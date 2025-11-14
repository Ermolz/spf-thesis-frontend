import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { toast as hotToast } from 'react-hot-toast';

export const ToastProvider = () => {
  useEffect(() => {
    const setupSwipe = (toastElement) => {
      if (toastElement.dataset.swipeSetup) return;
      toastElement.dataset.swipeSetup = 'true';

      let startX = 0;
      let currentX = 0;
      let isDragging = false;

      const handleTouchStart = (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        toastElement.style.transition = 'none';
      };

      const handleTouchMove = (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        if (diff < 0) {
          toastElement.style.transform = `translateX(${diff}px)`;
          toastElement.style.opacity = `${Math.max(0, 1 + diff / 200)}`;
        }
      };

      const handleTouchEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        const diff = currentX - startX;
        toastElement.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        
        if (diff < -100) {
          toastElement.style.transform = 'translateX(-100%)';
          toastElement.style.opacity = '0';
          setTimeout(() => {
            const toastId = toastElement.getAttribute('data-hot-toast-id');
            if (toastId) {
              hotToast.dismiss(toastId);
            }
          }, 100);
        } else {
          toastElement.style.transform = 'translateX(0)';
          toastElement.style.opacity = '1';
        }
      };

      const handleMouseDown = (e) => {
        startX = e.clientX;
        isDragging = true;
        toastElement.style.transition = 'none';
        toastElement.style.cursor = 'grabbing';
      };

      const handleMouseMove = (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
        const diff = currentX - startX;
        if (diff < 0) {
          toastElement.style.transform = `translateX(${diff}px)`;
          toastElement.style.opacity = `${Math.max(0, 1 + diff / 200)}`;
        }
      };

      const handleMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        toastElement.style.cursor = 'grab';
        const diff = currentX - startX;
        toastElement.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        
        if (diff < -100) {
          toastElement.style.transform = 'translateX(-100%)';
          toastElement.style.opacity = '0';
          setTimeout(() => {
            const toastId = toastElement.getAttribute('data-hot-toast-id');
            if (toastId) {
              hotToast.dismiss(toastId);
            }
          }, 100);
        } else {
          toastElement.style.transform = 'translateX(0)';
          toastElement.style.opacity = '1';
        }
      };

      toastElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      toastElement.addEventListener('touchmove', handleTouchMove, { passive: true });
      toastElement.addEventListener('touchend', handleTouchEnd);
      
      const mouseMoveHandler = (e) => handleMouseMove(e);
      const mouseUpHandler = () => {
        handleMouseUp();
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
      
      toastElement.addEventListener('mousedown', (e) => {
        handleMouseDown(e);
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      });
    };

    const handleSwipe = () => {
      const toasts = document.querySelectorAll('[data-hot-toast-id]');
      toasts.forEach(setupSwipe);
    };

    const observer = new MutationObserver(handleSwipe);
    observer.observe(document.body, { childList: true, subtree: true });
    handleSwipe();

    return () => observer.disconnect();
  }, []);

  return (
    <Toaster
      position="top-right"
      containerClassName="!top-4 !right-4 sm:!top-6 sm:!right-6 z-50"
      pauseOnHover={true}
      toastOptions={{
        duration: 3000,
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          padding: '14px 18px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          maxWidth: '90vw',
          width: 'auto',
          minWidth: '300px',
          fontSize: '14px',
          fontWeight: '500',
          backdropFilter: 'blur(10px)',
        },
        success: {
          iconTheme: {
            primary: 'var(--success)',
            secondary: 'var(--bg-card)',
          },
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--success)',
            boxShadow: '0 20px 25px -5px rgba(34, 197, 94, 0.2), 0 10px 10px -5px rgba(34, 197, 94, 0.1)',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: 'var(--bg-card)',
          },
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid #ef4444',
            boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.2), 0 10px 10px -5px rgba(239, 68, 68, 0.1)',
          },
        },
        loading: {
          iconTheme: {
            primary: 'var(--primary)',
            secondary: 'var(--bg-card)',
          },
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--primary)',
          },
        },
      }}
    />
  );
};

