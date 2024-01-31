import isAxiosError from '@/utils/AxiosError';

const axios = require('axios').default;

interface Cookie {
  [key: string]: string;
}

export async function POST(request: Request) {
  const body = await request.json();

  const { username, password } = body;

  try {
    const axiosResponse = await axios.post(`${process.env.AUTH_BASE_URL}/auth/login`, {
      username,
      password,
    });

    console.log('axiosResponse', axiosResponse);

    const session_cookie = axiosResponse.headers['set-cookie'][0];
    const cookieParts = session_cookie.split(';');

    const obj = cookieParts.reduce((accumulator: Cookie, currentValue: string) => {
      let [key, value] = currentValue.split('=');
      key = key.replaceAll(' ', '');
      accumulator[key] = value;
      return accumulator;
    }, {});

    const responseBody = {
      user: axiosResponse.data,
      sessionCookie: obj,
    };

    return new Response(JSON.stringify(responseBody), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: unknown) {
    console.error('Error:', error);
    if (isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.log('axios error.response.data', error.response.data);
        return new Response(JSON.stringify(error.response.data), {
          status: error.response.status,
          headers: { 'Content-Type': 'application/json' },
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.log('axios error.request', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('axios error.message', error.message);
      }

      return new Response(JSON.stringify({ message: 'Credenciales incorrectas' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
