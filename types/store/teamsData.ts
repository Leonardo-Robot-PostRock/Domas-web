import { TeamEdit } from '../Form/teamEdit';

export interface TeamsData {
  teamData?: TeamEdit | null;
  loading: boolean;
  error: Error | null;
}
