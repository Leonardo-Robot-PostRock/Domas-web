import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

// Definir una interfaz para el objeto de solicitud
export interface RequestObject {
  query: { categories: any };
  body: any | ImageFile;
  method: string;
  cookies: RequestCookies;
  get: (arg0: string) => any;
}

export interface GetParams {
  id: string;
}

export interface ImageFile {
  primary_file: string;
  secondary_file: string;
}
