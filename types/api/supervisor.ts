export interface Supervisor {
  users: User[];
}

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  mesa_username: string;
  status: string;
  createdAt: string;
  api_key: null;
  photo: null;
  telegram_chat_id: null;
}
