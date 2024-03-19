export interface Technician {
  users: User[];
}

export interface User {
  id: number;
  username: string;
  password: Password;
  name: string;
  mesa_username: null | string;
  status: Status;
  createdAt: string;
  api_key: null;
  photo: null;
  telegram_chat_id: null;
}

export type Password = string;

export enum Status {
  Active = 'active'
}
