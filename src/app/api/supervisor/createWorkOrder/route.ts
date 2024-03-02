import axios, { isAxiosError } from 'axios';
import { redirect } from 'next/navigation';
import type { RequestObject } from '@/types/api/request';

export async function GET(request: RequestObject): Promise<Response | undefined> {
  const token = request.cookies.get('auth_service');

  if (!token) {
    return redirect(`${process.env.APP_URL}/login`);
  }

  const { categories } = request.query;

  try {
    const response = await axios.get(`${process.env.AUTH_BASE_URL}/v1/order/of/the/day?categories=${categories}`, {
      headers: {
        Authorization: `auth_service=${token.value}`
      }
    });

    return new Response(JSON.stringify(response.data), {
      status: response.status
    });
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.log('axios error.response.data', error.response.data);
        return new Response(JSON.stringify(error.response.data), {
          status: error.response.status,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.log('axios error.request', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('axios error.message', error.message);
      }

      return new Response(JSON.stringify({ message: 'Hubo un error al realizar la petición.' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
}
