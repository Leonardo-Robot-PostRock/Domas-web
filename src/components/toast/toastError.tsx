import { type ToastPosition, toast } from 'react-hot-toast';

export const toastError = (message: string, position = 'top'): void => {
  toast.error(message, {
    id: message,
    duration: 5000,
    position: `${position} center` as ToastPosition,
    style: {
      border: '3px solid #f0775c',
      backgroundColor: '#FCEDEA',
      borderRadius: '15px',
      boxShadow: '0px 2px 22px 0px rgba(235,78,44,0.20)'
    }
  });
};

toastError('Ocurrió un error al cargar los cluster');
