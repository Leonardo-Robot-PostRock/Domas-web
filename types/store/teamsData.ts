import { TeamEdit } from '../Form/teamEdit';
import { Team, Technician } from '../api/teams';

export interface TeamsData {
  primaryFile: [];
  secondaryFile: [];
  technicianDataField: Technician[];
  error: Error | null;
  loading: boolean;
  teams: Team[];
  teamEdit?: TeamEdit | null;
}
