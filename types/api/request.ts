import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

// Definir una interfaz para el objeto de solicitud
export interface RequestObject {
  body: any;
  method: string;
  cookies: RequestCookies;
  get: (arg0: string) => any;
}

export interface GetParams {
  id: string;
}
