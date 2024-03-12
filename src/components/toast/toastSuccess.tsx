import type { ReactNode } from 'react';
import { type Id, toast, type ToastOptions } from 'react-toastify';

interface AlertMessageProps {
  title: string;
  text: string;
}

export const AlertMessage = ({ title, text }: AlertMessageProps): ReactNode => {
  return (
    <div className="msg-container">
      <p className="msg-title">{title}</p>
      <p className="msg-description">{text}</p>
    </div>
  );
};

interface ToasterProps {
  title: string;
  text: string;
}

export const toaster = (myProps: ToasterProps, toastProps: ToastOptions): Id =>
  toast(<AlertMessage {...myProps} />, { ...toastProps });

toaster.success = (myProps: ToasterProps, toastProps: ToastOptions): Id =>
  toast.success(<AlertMessage {...myProps} />, { ...toastProps });
