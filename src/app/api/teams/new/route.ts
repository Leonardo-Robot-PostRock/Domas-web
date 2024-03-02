/* eslint-disable @typescript-eslint/naming-convention */
import { redirect } from 'next/navigation';
import axios, { isAxiosError } from 'axios';

import { processImage } from '@/utils/processImages';

import type { ImageFile, RequestObject } from '@/types/api/request';

export async function POST(request: RequestObject): Promise<Response | undefined> {
  const token = request.cookies.get('auth_service');

  const body: ImageFile = request.body;
  const { primary_file, secondary_file } = body;

  console.log(request.body.primary_file);
  console.log(request.body.secondary_file);

  if (!token) return redirect(`${process.env.APP_URL}/login`);

  if (request.body.primary_file) {
    request.body.primary_file = processImage(primary_file);
  }

  if (request.body.secondary_file) {
    request.body.secondary_file = await processImage(secondary_file);
  }

  const teamsUrl = `${process.env.AUTH_BASE_URL}/v1/team`;

  try {
    const teamsResponse = await axios.post(teamsUrl, request.body, {
      headers: {
        Cookie: `auth_service=${token.value}`
      }
    });

    return new Response(JSON.stringify(teamsResponse.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
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
