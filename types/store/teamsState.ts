import type { TeamEdit } from '../Form/teamEdit';
import type { Team, Technician } from '../api/teams';

export interface TeamsState {
  technicianDataField: Technician[];
  error: string | null;
  loading: boolean;
  teams: Team[];
  teamEdit?: TeamEdit | null;
}
