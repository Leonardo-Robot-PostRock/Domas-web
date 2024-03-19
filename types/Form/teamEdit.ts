import type { FieldValues } from 'react-hook-form';
import type { Cluster } from '../api/clusters';
import type { Team, Technician } from '../api/teams';
import type { FieldData } from './FormFieldProps';

export interface TeamEdit extends Team {}

export interface ItemTeam {
  item: Team;
}

export interface Params {
  technicians: Technician[];
  mesa_username: string;
}

export interface FormData extends TeamBase, Cluster, FieldValues {
  leader?: FieldData;
  supervisor: { value: number; label: string } | undefined;
  assistant?: FieldData;
  users_id: number[];
  supervisorField: FieldData;
  primary_file: string;
  secondary_file: string;
  cluster_favourite: Array<number | null>;
  cluster_id: number[];
  area_id: Array<number | []> | undefined;
  area?: string;
}

export interface TeamBase extends Omit<Team, 'supervisor' | 'areas'> {}
