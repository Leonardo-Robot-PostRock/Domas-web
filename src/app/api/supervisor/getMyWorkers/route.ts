import axios, { isAxiosError } from 'axios';
import type { RequestObject } from '@/types/api/request';
import { redirect } from 'next/navigation';

export async function GET(request: RequestObject): Promise<Response | undefined> {
  const token = request.cookies.get('auth_service');

  if (!token) return redirect(`${process.env.APP_URL}/login`);

  const workers = await axios.get(`${process.env.AUTH_BASE_URL}/v1/user/my-workers`, {
    headers: {
      Cookie: `auth_service=${token.value}`
    }
  });
  try {
    return new Response(JSON.stringify(workers), {
      status: workers.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    if (isAxiosError(error)) {
      return new Response(JSON.stringify({ error: true, message: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
