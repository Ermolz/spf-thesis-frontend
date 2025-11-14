import { toast as hotToast } from 'react-hot-toast';

export const toast = {
  success: (message) => {
    hotToast.success(message, {
      duration: 3000,
    });
  },
  error: (message) => {
    hotToast.error(message, {
      duration: 3000,
    });
  },
  info: (message) => {
    hotToast(message, {
      duration: 3000,
      icon: 'ℹ️',
    });
  },
  loading: (message) => {
    return hotToast.loading(message);
  },
  dismiss: (toastId) => {
    hotToast.dismiss(toastId);
  },
};

