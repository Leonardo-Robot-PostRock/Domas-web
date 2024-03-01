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
  supervisor?: SupervisorDetails;
  technicians: TechnicianDetails[];
  starting_point: null;
  areas: AreaDetails[];
  clusters: ClusterDetails[];
}

export interface AreaDetails {
  id: number;
  name: Name;
}

export enum Name {
  name = 'ST'
}

export interface ClusterDetails {
  id: number;
  name: string;
  model: Model;
  favourite_group: number;
}

export enum Model {
  C2 = 'C2'
}

export type SupervisorDetails = string;

export interface TechnicianDetails {
  id: number;
  name: string;
  photo: null;
  mesa_username: string;
}
