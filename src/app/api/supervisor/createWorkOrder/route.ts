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
        return new Response(JSON.stringify(error.response.data), {
          status: error.response.status,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
  }
}
