import { redirect } from 'next/navigation';
import axios, { isAxiosError } from 'axios';
import type { GetParams } from '@/types/api/request';
import type { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: GetParams }): Promise<Response | undefined> {
  const token = request.cookies.get('auth_service');

  if (!token) return redirect(`${process.env.APP_URL}/login`);

  const { id } = params;

  const url = `${process.env.AUTH_BASE_URL}/v1/team/${id}`;

  const teamsResponse = await axios.delete(url, {
    headers: {
      Cookie: `auth_service=${token.value}`
    }
  });

  try {
    return new Response(JSON.stringify(teamsResponse.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      return new Response(JSON.stringify({ error: true, message: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
