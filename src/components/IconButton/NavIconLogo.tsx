import type { ReactNode } from 'react';
import Image from 'next/image';

export const NavIconLogo = (): ReactNode => {
  return <Image src="/logo.svg" width={60} height={60} alt="Do+ logo" />;
};
