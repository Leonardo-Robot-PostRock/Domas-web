import { redirect } from 'next/navigation';
import axios, { isAxiosError } from 'axios';
import sharp from 'sharp';

export async function POST(request: { body: any; cookies: { get: (arg0: string) => any } }) {
  const token = request.cookies.get('auth_service');

  console.log(request.body.primary_file);
  console.log(request.body.secondary_file);

  if (!token) return redirect(`${process.env.APP_URL}/login`);

  if (request.body.primary_file) {
    const file = request.body.primary_file;
    var img = Buffer.from(file, 'base64');
    const data = await sharp(img).resize({ width: 200, height: 200 }).toFormat('jpeg').toBuffer();

    request.body.primary_file = data.toString('base64');
  }

  if (request.body.secondary_file) {
    const file = request.body.secondary_file;
    var img = Buffer.from(file, 'base64');
    const data = await sharp(img).resize({ width: 200, height: 200 }).toFormat('jpeg').toBuffer();

    request.body.secondary_file = data.toString('base64');
  }

  const teamsUrl = `${process.env.AUTH_BASE_URL}/v1/team`;

  try {
    const teamsResponse = await axios.post(teamsUrl, request.body, {
      headers: {
        Cookie: `auth_service=${token.value}`,
      },
    });

    return new Response(JSON.stringify(teamsResponse.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response) {
        return new Response(JSON.stringify({ error: true, message: error.toString() }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }
}
