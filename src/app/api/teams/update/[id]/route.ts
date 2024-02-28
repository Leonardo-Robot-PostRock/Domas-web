import { redirect } from 'next/navigation';
import axios, { isAxiosError } from 'axios';
import sharp from 'sharp';

import type { GetParams, RequestObject } from '@/types/api/request';

export async function PATCH(request: RequestObject, { params }: { params: GetParams }): Promise<Response | undefined> {
  const token = request.cookies.get('auth_service');

  if (!token) return redirect(`${process.env.APP_URL}/login`);

  const id = params.id;

  const url = `${process.env.AUTH_BASE_URL}/v1/team/${id}/update`;

  if (request.body.primary_file) {
    const file = request.body.primary_file;
    if (typeof file === 'string') {
      const img = Buffer.from(file, 'base64');
      const data = await sharp(img).resize({ width: 200, height: 200 }).toFormat('jpeg').toBuffer();

      request.body.primary_file = data.toString('base64');
    }
  }
  if (request.body.secondary_file) {
    const file = request.body.secondary_file;
    if (typeof file === 'string') {
      const img = Buffer.from(file, 'base64');
      const data = await sharp(img).resize({ width: 200, height: 200 }).toFormat('jpeg').toBuffer();

      request.body.secondary_file = data.toString('base64');
    }
  }

  try {
    const teamsResponse = await axios.patch(url, request.body, {
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
      return new Response(JSON.stringify({ error: true, message: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
