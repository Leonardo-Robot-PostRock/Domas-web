import type { Inputs } from '@/types/Form/inputs';
import type { LoginResponse } from '@/types/api/login';
import axios from 'axios';

export async function loginUser(data: Inputs): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>('/api/login', data);
    return response.data;
  } catch (error) {
    throw new Error('Error al iniciar sesión');
  }
}
