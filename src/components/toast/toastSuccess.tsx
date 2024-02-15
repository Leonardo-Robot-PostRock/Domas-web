import { Message } from 'react-hook-form';
import { ToastPosition, toast } from 'react-hot-toast';

export const toastSuccess = (message: Message, position = 'top') =>
  toast.success(message, {
    id: message,
    duration: 5000,
    position: `${position} center` as ToastPosition,
    style: {
      border: '3px solid #6cc683',
      backgroundColor: '#EBF7EE',
      borderRadius: '15px',
      boxShadow: '0px 2px 22px 0px rgba(56,178,88,0.20)',
    },
  });
