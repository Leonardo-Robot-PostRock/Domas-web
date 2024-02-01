import axios from 'axios';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';
import isAxiosError from '@/utils/AxiosError';

interface Order {
  status: number;
  data?: any;
  message?: string;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.auth_service;

  if (!token) return redirect(`${process.env.APP_URL}/login`);

  try {
    const orders = await axios.get<Order>(`${process.env.AUTH_BASE_URL}/v1/order/workers`, {
      headers: {
        Authorization: `auth_service=${token}`,
      },
    });

    console.log('verrrrr', orders);
    return Response.json(orders.data ? orders.data : orders.message, {
      status: orders.status,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.log('axios error.response.data', error.response.data);
        return Response.json(error.response.data, {
          status: error.response.status,
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.log('axios error.request', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('axios error.message', error.message);
      }

      return Response.json({ message: 'Hubo un error al realizar la petición.' }, { status: 400 });
    }
  }
}