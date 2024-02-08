import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { AxiosResponse, isAxiosError } from 'axios';
import { NextResponse } from 'next/server';

import { GetTicketsFromDB } from '@/types/api/getTicketsFromDb';

const axios = require('axios').default;

export async function GET() {
  const cookiesStore = cookies();
  const token = cookiesStore.get('auth_service');

  console.log(token);

  if (!token) return redirect(`${process.env.APP_URL}`);

  try {
    const response: AxiosResponse<GetTicketsFromDB> = await axios.get(`${process.env.AUTH_BASE_URL}/v1/order/user`, {
      headers: {
        withCredentials: true,
        Cookie: `auth_service=${token.value}`,
      },
    });

    return NextResponse.json(response.data ? response.data : error.message, {
      status: 200,
    });
  } catch (error: unknown) {
    console.error('Error:', error);
    if (isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.log('axios error.response.data', error.response.data);
        return new Response(JSON.stringify(error.response.data), { status: error.response.status });
      } else if (error.request) {
        // The request was made but no response was received
        console.log('axios error.request', error.request);
        return new Response(JSON.stringify({ message: 'No se recibió una respuesta del servidor.' }), { status: 500 });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('axios error.message', error.message);
        return new Response(JSON.stringify({ message: 'Error en la solicitud.' }), { status: 500 });
      }
    }
  }
}
