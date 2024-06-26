import { redirect } from 'next/navigation';
import axios, { isAxiosError } from 'axios';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest): Promise<Response | undefined> {
  const token = request.cookies.get('auth_service');

  if (!token) return redirect(`${process.env.APP_URL}/login`);

  const teamsUrl = `${process.env.AUTH_BASE_URL}/v1/team/all`;

  try {
    const teamsResponse = await axios.get(teamsUrl, {
      headers: {
        Cookie: `auth_service=${token.value}`
      }
    });

    return new Response(JSON.stringify(teamsResponse.data), {
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
    }
  }
}
