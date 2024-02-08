import { FilePondProps } from 'react-filepond';

export interface TeamsData {
  showSupervisorField: boolean;
  supervisorsDataField: { value: number; label: string }[];
  technicianDataField: { value: number; label: string }[];
  primaryFile: FilePondProps[];
  secondaryFile: FilePondProps[];
  clusterData: { value: number; label: string }[];
  areaData: { value: number; label: string }[];
  clustersGroup: { value: number; label: string }[];
  areaGroup: { value: number; label: string }[];
  clustersFav: { cluster_id: number; isChecked: boolean }[];
}
