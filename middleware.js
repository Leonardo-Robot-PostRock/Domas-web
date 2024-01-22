import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server'
import fetch from 'isomorphic-unfetch';

export async function middleware (req, res) {
    const session = req.cookies.get('auth_service');


    if (session) {

        const auth_session_url = `${process.env.AUTH_BASE_URL}/session`;
        const auth_response = await fetch(auth_session_url, {
            headers: {
                'Cookie': `auth_service=${session.value}`
            }
        });
        const session_status = auth_response.status;

        if (session_status >= 200 && session_status <= 300) {
            const user = await auth_response.json();
            user.roles = user.roles.map(role => role.name.toUpperCase());

            const { pathname } = req.nextUrl;


            if (!user.roles.includes('ADMINISTRADOR')) {
                if (pathname == '/') {
                    if (user.roles.includes('TECNICO')) {
                        return NextResponse.redirect(`${process.env.APP_URL}/ticket/todo`)
                    } 
                    else if (user.roles.includes('SUPERVISOR') && !user.roles.includes('CALLCENTER')) {
                        return NextResponse.redirect(`${process.env.APP_URL}/today_orders`)
                    }
                    else if (user.roles.includes('COORDINADOR')) {
                        return NextResponse.redirect(`${process.env.APP_URL}/coordinateTk`)
                    }
                    else if (user.roles.includes('CALLCENTER')) {
                        return NextResponse.redirect(`${process.env.APP_URL}/callcenter/tickets-assigned`)
                    }
                } else if (pathname == '/orders' || pathname == '/today_orders' || pathname == '/teams' || pathname == '/roadmaps' || pathname == '/calendar' || pathname == '/dashboard' || pathname == '/activity') {
                    // Rutas exclusivamente para rol SUPERVISOR

                    if (!user.roles.includes('SUPERVISOR') || user.roles.includes('CALLCENTER')) {
                        return NextResponse.redirect(`${process.env.APP_URL}/`)
                    }
                } else if (pathname == '/ticket/todo') {
                    // Rutas exclusivamente para rol TECNICO

                    if (!user.roles.includes('TECNICO')) {
                        return NextResponse.redirect(`${process.env.APP_URL}/`)
                    }
                } else if (pathname == '/coordinations' || pathname == '/coordinateTk') {
                    // Rutas exclusivamente para rol COORDINADOR

                    if (!user.roles.includes('COORDINADOR')) {
                        return NextResponse.redirect(`${process.env.APP_URL}/`)
                    }
                } else if (pathname == '/users') {
                    // Rutas exclusivamente para rol ADMINISTRADOR

                    if (!user.roles.includes('ADMINISTRADOR')) {
                        return NextResponse.redirect(`${process.env.APP_URL}/`)
                    }
                } else if (pathname == '/verify' || pathname == '/callcenter/tickets-assigned') {
                    // Rutas exclusivamente para rol CALL CENTER

                    if (!user.roles.includes('CALLCENTER')) {
                        return NextResponse.redirect(`${process.env.APP_URL}/`)
                    }
                } else if (pathname == '/search-tk') {
                    if (user.roles.includes('TECNICO')) {
                        return NextResponse.redirect(`${process.env.APP_URL}/`)
                    }
                }
            }


            return NextResponse.next()
        }
    }

    return NextResponse.redirect(`${process.env.APP_URL}/login`);


}

export const config = {
    matcher: ['/', '/coordinations', '/orders', '/roadmaps', '/ticket/todo', '/teams', '/calendar', '/dashboard', '/coordinateTk', '/users', '/activity', '/verify', '/today_orders', '/search-tk', '/callcenter/tickets-assigned', '/mesa/:path*']
}