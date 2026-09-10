import { useCallback } from 'react';
import { useUIStore } from '../store/ui.store';
import toast from 'react-hot-toast';

export const useNotification = () => {
  const { addNotification } = useUIStore();

  const showNotification = useCallback(({
    message,
    type = 'info',
    duration = 3000,
  }: {
    message: string;
    type?: 'info' | 'success' | 'error' | 'warning';
    duration?: number;
  }) => {
    // Add to store
    addNotification({
      message,
      type,
    });

    // Show toast
    switch (type) {
      case 'success':
        toast.success(message, { duration });
        break;
      case 'error':
        toast.error(message, { duration });
        break;
      case 'warning':
        toast(message, {
          duration,
          icon: '⚠️',
          style: {
            background: '#fef3c7',
            color: '#92400e',
          },
        });
        break;
      default:
        toast(message, { duration });
    }
  }, [addNotification]);

  return { showNotification };
};