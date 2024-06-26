import axios, { isAxiosError } from 'axios';
import { redirect } from 'next/navigation';
import type { RequestObject } from '@/types/api/request';
import type { ClusterResponse } from '@/types/api/clusters';

export async function GET(request: RequestObject): Promise<Response | undefined> {
  const token = request.cookies.get('auth_service');

  if (!token) return redirect(`${process.env.APP_URL}/login`);

  const clusterUrl = `${process.env.AUTH_BASE_URL}/v1/clusters`;

  try {
    const clusterResponse = await axios.get<ClusterResponse>(clusterUrl, {
      headers: {
        Cookie: `auth_service=${token.value}`
      }
    });

    return new Response(JSON.stringify(clusterResponse.data.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    if (isAxiosError(error)) {
      return new Response(JSON.stringify({ error: true, message: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
