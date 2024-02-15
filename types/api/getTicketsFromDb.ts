export interface GetTicketsFromDB {
  id: number;
  tickets: Ticket[];
  worker: Worker;
}

export interface Ticket {
  id: number;
  Team: Team;
  cluster: string;
  ticket_status: TicketStatus;
  ticket_category: TicketCategory;
  appointment_date: null;
  visiting_hours: null;
  customer: Customer;
  ticket_created_at: string;
  recurrent: number;
  order_id: number;
  Ticket_history: TicketHistory[];
}

export interface Team {
  id: number;
  name: Name;
}

export type Name = string;

export interface TicketHistory {
  ticket_id: number;
  ticket_status: TicketStatus;
  description: Description;
  createdAt: string;
}

export enum Description {
  CreaciónDeOrdenDeTrabajo = 'Creación de orden de trabajo.',
}

export enum TicketStatus {
  Pendiente = 'PENDIENTE',
}

export interface Customer {
  code: number;
  name: string;
  plan: string;
  phone: Phone;
  phone2: string;
  phone3: string;
  phone4: string;
  address: string;
  geocode: Geocode;
  lastname: string;
  customer_id: number;
}

export interface Geocode {
  latitude: string;
  longitude: string;
}

export type Phone = string | '';

export enum TicketCategory {
  CambioDeVelocidadFibra = 'CAMBIO DE VELOCIDAD FIBRA',
  ClientePideTécnico = 'CLIENTE PIDE TÉCNICO',
  MejorarValores = 'MEJORAR VALORES',
  Preventivo = 'PREVENTIVO',
  PreventivoLujan = 'PREVENTIVO LUJAN',
  Redireccionar = 'REDIRECCIONAR',
  SinInternetSantaTeresita = 'SIN INTERNET - SANTA TERESITA',
  WifiHome = 'WIFI HOME',
}

export interface Worker {
  worker_id: number;
  username: string;
  name: string;
}
