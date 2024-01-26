import { toast } from 'react-hot-toast';

export const toastError = (message, position = 'top') =>
  toast.error(message, {
    id: message,
    duration: 5000,
    position: `${position} center`,
    style: {
      border: '3px solid #f0775c',
      backgroundColor: '#FCEDEA',
      borderRadius: '15px',
      boxShadow: '0px 2px 22px 0px rgba(235,78,44,0.20)',
    },
  });

export const toastSuccess = (message, position = 'top') =>
  toast.success(message, {
    id: message,
    duration: 5000,
    position: `${position} center`,
    style: {
      border: '3px solid #6cc683',
      backgroundColor: '#EBF7EE',
      borderRadius: '15px',
      boxShadow: '0px 2px 22px 0px rgba(56,178,88,0.20)',
    },
  });
