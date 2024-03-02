/* eslint-disable @typescript-eslint/naming-convention */
import { redirect } from 'next/navigation';
import axios, { isAxiosError } from 'axios';

import { processImage } from '@/utils/processImages';
import type { ImageFile, GetParams, RequestObject } from '@/types/api/request';

export async function PATCH(request: RequestObject, { params }: { params: GetParams }): Promise<Response | undefined> {
  const token = request.cookies.get('auth_service');

  if (!token) return redirect(`${process.env.APP_URL}/login`);

  const id = params.id;

  const body: ImageFile = request.body;

  const { primary_file, secondary_file } = body;

  const updateTeamUrl = `${process.env.AUTH_BASE_URL}/v1/team/${id}/update`;

  if (request.body.primary_file) {
    request.body.primary_file = processImage(primary_file);
  }

  if (request.body.secondary_file) {
    request.body.secondary_file = processImage(secondary_file);
  }

  try {
    const teamsResponse = await axios.patch(updateTeamUrl, request.body, {
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
