import axios, { type AxiosResponse, isAxiosError } from 'axios';
import type { LoginRequest, LoginResponse } from '@/types/api/login';

type Cookie = Record<string, string>;

export async function POST(request: Request): Promise<Response | undefined> {
  const body: LoginRequest = await request.json();

  const { username, password } = body;

  try {
    const response: AxiosResponse<LoginResponse> = await axios.post(`${process.env.AUTH_BASE_URL}/auth/login`, {
      username,
      password
    });

    const sessionCookie: string | undefined = response.headers['set-cookie']?.[0];
    let obj: Cookie = {};

    if (sessionCookie) {
      const cookieParts: string[] | undefined = sessionCookie?.split(';');
      obj = cookieParts.reduce((accumulator: Cookie, currentValue: string) => {
        let [key, value] = currentValue.split('=');
        key = key.replaceAll(' ', '');
        accumulator[key] = value;
        return accumulator;
      }, {});
    }

    const responseBody = {
      user: response.data,
      sessionCookie: obj
    };

    return new Response(JSON.stringify(responseBody), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response) {
        return new Response(JSON.stringify(error.response.data), {
          status: error.response.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ message: 'Credenciales incorrectas' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
