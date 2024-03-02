export interface Area {
  id: number;
  name: string;
  description: null;
  deletedAt: null;
  google_calendar_id: null;
  mesa_username: null;
  traccar_device_id: null;
  deleted_at: null;
  always_active: null;
  min_tickets_to_do: null;
  max_tickets_to_do_only_omnichannel: null;
  max_tickets_to_do: null;
  starting_point: null;
  group_id: null;
}

export interface AreaResponse {
  data: Area[];
}
