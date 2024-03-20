import axios, { isAxiosError } from 'axios';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

interface Order {
  status: number;
  data?: any;
  message?: string;
}

export async function GET(request: NextRequest): Promise<Response | undefined> {
  const token = request.cookies.get('auth_service');

  if (!token) return redirect(`${process.env.APP_URL}`);

  try {
    const order = await axios.get<Order>(`${process.env.AUTH_BASE_URL}/v1/order/workers`, {
      headers: {
        Cookie: `auth_service=${token.value}`
      }
    });

    return Response.json(order.data, {
      status: order.status
    });
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        return Response.json(error.response.data, {
          status: error.response.status
        });
      }
    }
  }
}
