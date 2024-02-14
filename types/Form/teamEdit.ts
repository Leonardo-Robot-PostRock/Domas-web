import { Supervisor, Technician } from '@/types/api/teamById';

export interface TeamEdit {
  id: number;
  name: string;
  google_calendar_id: string;
  mesa_username: string;
  supervisor_id: number;
  min_tickets_to_do: number;
  max_tickets_to_do_only_omnichannel: number;
  supervisor: Supervisor;
  technicians: Technician[];
  starting_point: null;
}

export interface EditProps {
  edit: TeamEdit;
}

export interface Params {
  technicians: Technician[];
  mesa_username: string;
}
