interface Props extends Request {
  username: string;
  password: string;
}

interface ErrorMessage {
  message: string;
}

function isErrorMessage(error: any): error is ErrorMessage {
  return typeof error?.message === 'string';
}

export async function POST(request: Request) {
  const body: Props = await request.json();

  const { username, password } = body;

  try {
    const response = await fetch(`${process.env.AUTH_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    const session_cookie = response.headers.get('set-cookie');
    if (!session_cookie) {
      throw new Error('Session cookie not found');
    }

    const cookieParts = session_cookie.split(';');

    const obj: { [key: string]: string } = {};

    cookieParts.forEach((part: string) => {
      const [key, value] = part.split('=');
      if (key && value) {
        obj[key.trim()] = value.trim();
      }
    });

    console.log(obj);

    const responseBody = {
      username,
      password,
      session_cookie: obj,
    };

    console.log(responseBody);

    return new Response(JSON.stringify(responseBody), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    if (isErrorMessage(error)) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
