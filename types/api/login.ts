export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  sessionCookie: SessionCookie;
}

export interface SessionCookie {
  auth_service: string;
  'Max-Age': string;
  Domain: string;
  Path: string;
  Expires: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  roles: Role[];
  mesa_username: string;
  iat: number;
  exp: number;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  deletedAt: null;
}
