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
}

export interface FormData extends TeamBase, ClusterBase, FieldValues {
  leader?: FieldData;
  supervisor: { value: number; label: string } | undefined;
  assistant?: FieldData;
  users_id: number[];
  supervisorField: FieldData;
  primary_file: string;
  cluster?: FieldData[];
  secondary_file: string;
  cluster_favourite: number[];
  cluster_id: number[];
  area_id: Array<number | []> | undefined;
  area?: FieldData[];
}

export interface TeamBase extends Omit<Team, 'supervisor' | 'areas'> {}
export interface ClusterBase extends Omit<Cluster, 'cluster'> {}
