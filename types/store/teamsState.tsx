import type { FilePondFile } from 'filepond';
import type { Team, Technician } from '../api/teams';

export interface TeamsState {
  primaryFile: FilePondFile[];
  secondaryFile: FilePondFile[];
  technicianDataField: Technician[];
  error: string | null;
  loading: boolean;
  teams: Team[];
  teamEdit?: Team | null;
}
