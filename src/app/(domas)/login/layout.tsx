import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Bienvenidos a Do+',
  description: process.env.APP_NAME,
  icons: {
    icon: process.env.APP_ENV!.toUpperCase() === 'PROD' ? '/favicon.ico' : '/faviconLocal.ico',
  },
  openGraph: {
    title: 'Do+',
    images: process.env.APP_ENV!.toUpperCase() === 'PROD' ? '/logo.svg' : '/logoLocal.svg',
  },
};

export default function LayoutLogin({ children }) {
  return <>{children}</>;
}
