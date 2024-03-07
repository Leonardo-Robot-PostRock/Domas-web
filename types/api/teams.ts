export interface Team {
  id: number;
  name: string;
  google_calendar_id: string;
  mesa_username: string;
  traccar_device_id: number | null;
  supervisor_id: number;
  deletedAt: null;
  always_active: boolean;
  min_tickets_to_do: number;
  max_tickets_to_do_only_omnichannel: number;
  supervisor?: Supervisor;
  technicians: Technician[];
  starting_point: null;
  areas: Area[];
  clusters: Cluster[];
}

export interface Area {
  id: number;
  name: Name;
}

export type Name = string;

export interface Cluster {
  id: number;
  name: string;
  model: Model;
  favourite_group: number;
}

export enum Model {
  C2 = 'C2'
}

export type Supervisor = string;

export interface Technician {
  id: number;
  name: string;
  photo: null;
  mesa_username: string;
}
