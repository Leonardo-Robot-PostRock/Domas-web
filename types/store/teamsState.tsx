import type { FilePondFile } from 'filepond';
import type { Team, TechnicianDetails } from '../api/teams';

export interface TeamsState {
  primaryFile: FilePondFile[];
  secondaryFile: FilePondFile[];
  technicianDataField: TechnicianDetails[];
  error: string | null;
  loading: boolean;
  teams: Team[];
  teamEdit?: Team | null;
}
