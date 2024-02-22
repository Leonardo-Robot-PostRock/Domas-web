import type { FieldValues } from 'react-hook-form';
import type { Cluster } from '../api/clusters';
import type { Supervisor, Team, Technician } from '../api/teams';

export interface TeamEdit extends Team {}

export interface SupervisorField {
  value: number;
  label: Supervisor;
}

export interface LeaderField {
  value: number;
  label: string;
}

export interface AssitantField {
  value: number;
  label: string;
}

export interface EditProps {
  dataToEdit: TeamEdit;
}

export interface ItemTeam {
  item: Team;
}

export interface Params {
  technicians: Technician[];
  mesa_username: string;
}

export interface FormData extends Team, Cluster, FieldValues {
  leader?: LeaderField;
  assistant?: AssitantField;
  users_id: number[];
  supervisorField: SupervisorField;
  primary_file?: string;
  secondary_file?: string;
  cluster_favourite: string[];
  cluster_id: string[];
  area_id: string[];
  area?: string;
}
