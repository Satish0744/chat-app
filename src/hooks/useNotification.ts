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
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-yellow-50 dark:bg-yellow-900/20 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <ExclamationTriangleIcon className="h-10 w-10 text-yellow-400" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    {message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-yellow-200 dark:border-yellow-800">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-yellow-600 hover:text-yellow-500 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        ), { duration });
        break;
      default:
        toast(message, { duration });
    }
  }, [addNotification]);

  return { showNotification };
};