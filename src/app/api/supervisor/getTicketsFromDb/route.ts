import isAxiosError from '@/utils/AxiosError';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
const axios = require('axios').default;

export async function GET(request: NextRequest) {
  const token = request.cookies.auth_service;

  if (!token) return redirect(`${process.env.APP_URL}`);

  try {
    const response = await axios.get(`${process.env.AUTH_BASE_URL}/v1/order/user`, {
      headers: {
        Cookie: `auth_service=${token}`,
      },
    });

    const order = {
      status: response.status,
      data: response.data,
    };

    return new Response(JSON.stringify(order), {
      status: order.status,
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
