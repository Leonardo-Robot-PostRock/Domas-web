/* eslint-disable @typescript-eslint/naming-convention */
import { redirect } from 'next/navigation';
import axios, { isAxiosError } from 'axios';

import { processImage } from '@/utils/processImages';
import type { NextResponse } from 'next/server';
import type { FormData } from '@/types/Form/teamEdit';

export async function PATCH(
  request: NextResponse,
  { params }: { params: { id: string } }
): Promise<Response | undefined> {
  const token = request.cookies.get('auth_service');

  const { id } = params;

  if (!token) return redirect(`${process.env.APP_URL}/login`);

  const body: FormData = await request.json();

  const updateTeamUrl = `${process.env.AUTH_BASE_URL}/v1/team/${id}/update`;

  if (body.primary_file) {
    body.primary_file = await processImage(body.primary_file);
  }

  if (body.secondary_file) {
    body.secondary_file = await processImage(body.secondary_file);
  }

  try {
    const teamsResponse = await axios.patch(updateTeamUrl, body, {
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
