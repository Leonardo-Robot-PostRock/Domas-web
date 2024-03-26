/* eslint-disable @typescript-eslint/naming-convention */
import { type NextRequest, NextResponse } from 'next/server';
import { type Role } from '@/types/api/login';

import fetch from 'isomorphic-unfetch';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get('auth_service');

  if (token) {
    const auth_session_url = `${process.env.AUTH_BASE_URL}/session`;
    const auth_response = await fetch(auth_session_url, {
      headers: {
        Cookie: `auth_service=${token.value}`
      }
    });
    const session_status = auth_response.status;

    if (session_status >= 200 && session_status <= 300) {
      const user = await auth_response.json();
      user.roles = user.roles.map((role: Role) => role.name.toUpperCase());

      const { pathname } = request.nextUrl;

      if (!user.roles.includes('ADMINISTRADOR')) {
        if (pathname === '/') {
          if (user.roles.includes('TECNICO')) {
            return NextResponse.redirect(`${process.env.APP_URL}/ticket/todo`);
          } else if (user.roles.includes('SUPERVISOR') && !user.roles.includes('CALLCENTER')) {
            return NextResponse.redirect(`${process.env.APP_URL}/today_orders`);
          } else if (user.roles.includes('COORDINADOR')) {
            return NextResponse.redirect(`${process.env.APP_URL}/coordinateTk`);
          } else if (user.roles.includes('CALLCENTER')) {
            return NextResponse.redirect(`${process.env.APP_URL}/callcenter/tickets-assigned`);
          }
        } else if (
          pathname === '/orders' ||
          pathname === '/today_orders' ||
          pathname === '/teams' ||
          pathname === '/roadmaps' ||
          pathname === '/calendar' ||
          pathname === '/dashboard' ||
          pathname === '/activity'
        ) {
          if (!user.roles.includes('SUPERVISOR') || user.roles.includes('CALLCENTER')) {
            return NextResponse.redirect(`${process.env.APP_URL}/`);
          }
        } else if (pathname === '/ticket/todo') {
          if (!user.roles.includes('TECNICO')) {
            return NextResponse.redirect(`${process.env.APP_URL}/`);
          }
        } else if (pathname === '/coordinations' || pathname === '/coordinateTk') {
          if (!user.roles.includes('COORDINADOR')) {
            return NextResponse.redirect(`${process.env.APP_URL}/`);
          }
        } else if (pathname === '/users') {
          if (!user.roles.includes('ADMINISTRADOR')) {
            return NextResponse.redirect(`${process.env.APP_URL}/`);
          }
        } else if (pathname === '/verify' || pathname === '/callcenter/tickets-assigned') {
          if (!user.roles.includes('CALLCENTER')) {
            return NextResponse.redirect(`${process.env.APP_URL}/`);
          }
        } else if (pathname === '/search-tk') {
          if (user.roles.includes('TECNICO')) {
            return NextResponse.redirect(`${process.env.APP_URL}/`);
          }
        }
      }

      return NextResponse.next();
    }
  }

  return NextResponse.redirect(`${process.env.APP_URL}`);
}

export const config = {
  matcher: [
    '/',
    '/coordinations',
    '/orders',
    '/roadmaps',
    '/ticket/todo',
    '/teams',
    '/calendar',
    '/dashboard',
    '/coordinateTk',
    '/users',
    '/activity',
    '/verify',
    '/today_orders',
    '/search-tk',
    '/callcenter/tickets-assigned',
    '/mesa/:path*'
  ]
};
