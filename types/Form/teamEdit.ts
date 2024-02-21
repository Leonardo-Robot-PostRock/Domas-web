import { Supervisor, Team, Technician } from '../api/teams';

export interface TeamEdit {
  id: number;
  name: string;
  google_calendar_id: string;
  mesa_username: string;
  supervisor_id: number;
  min_tickets_to_do: number;
  max_tickets_to_do_only_omnichannel: number;
  supervisorOption: SupervisorOption;
  leader?: { value: number; label: string } | null;
  assistant?: { value: number; label: string } | null;
  technicians: Technician[];
  starting_point: null;
}

export interface SupervisorOption {
  value: number;
  label: Supervisor;
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
