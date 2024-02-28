import { redirect } from 'next/navigation';
import axios, { isAxiosError } from 'axios';

import type { GetParams, RequestObject } from '@/types/api/request';

export async function GET(request: RequestObject, { params }: { params: GetParams }): Promise<Response | undefined> {
  const token = request.cookies.get('auth_service');

  if (!token) return redirect(`${process.env.APP_URL}/login`);

  const id = params.id;

  console.log(id);

  console.log(request.method);

  const url = `${process.env.AUTH_BASE_URL}/v1/team/${id}`;
  try {
    const teamsResponse = await axios.get(url, {
      headers: {
        Cookie: `auth_service=${token.value}`
      }
    });

    console.log(teamsResponse.data);

    return new Response(JSON.stringify(teamsResponse?.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response) {
        return new Response(JSON.stringify({ error: true, message: error.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ error: true, message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
