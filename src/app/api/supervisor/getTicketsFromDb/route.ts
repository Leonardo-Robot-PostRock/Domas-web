import { redirect } from 'next/navigation';

import axios, { type AxiosResponse, isAxiosError } from 'axios';

import type { GetTicketsFromDB } from '@/types/api/getTicketsFromDb';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest): Promise<Response | undefined> {
  const token = request.cookies.get('auth_service');

  if (!token) return redirect(`${process.env.APP_URL}`);

  try {
    const response: AxiosResponse<GetTicketsFromDB> = await axios.get(`${process.env.AUTH_BASE_URL}/v1/order/user`, {
      headers: {
        withCredentials: true,
        Cookie: `auth_service=${token.value}`
      }
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response) {
        return new Response(JSON.stringify(error.response.data), { status: error.response.status });
      } else if (error.request) {
        return new Response(JSON.stringify({ message: 'No se recibió una respuesta del servidor.' }), { status: 500 });
      } else {
        return new Response(JSON.stringify({ message: 'Error en la solicitud.' }), { status: 500 });
      }
    }
  }
}
