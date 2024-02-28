import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

export function getTitlePathname(pathname: string | null): string {
  let titlePathname = '';
  if (pathname) {
    const pathnameSplit = pathname.split('/');
    titlePathname = pathnameSplit[pathnameSplit.length - 1].toUpperCase();
  }
  return titlePathname;
}

export function handleRedirectAndTitle(pathname: string | null): string {
  const cookiesAuth = Cookies.get();
  if (cookiesAuth && !cookiesAuth.auth_service && pathname !== '/') {
    redirect('/');
  }

  return getTitlePathname(pathname);
}
