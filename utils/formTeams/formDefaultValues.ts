/* eslint-disable @typescript-eslint/naming-convention */
import type { FormData, TeamEdit } from '@/types/Form/teamEdit';
import type { DefaultValues } from 'react-hook-form';

export const getDefaultValues = (teamData: TeamEdit): DefaultValues<FormData> | undefined => {
  if (!teamData) return {};

  const {
    name,
    google_calendar_id,
    mesa_username,
    supervisor_id,
    min_tickets_to_do,
    max_tickets_to_do_only_omnichannel,
    starting_point
  } = teamData;

  const supervisor = supervisor_id ? { value: supervisor_id, label: teamData.supervisor ?? '' } : undefined;

  return {
    name,
    mesa_username,
    google_calendar_id,
    min_tickets_to_do,
    max_tickets_to_do_only_omnichannel,
    supervisor,
    leader: { value: '', label: '' },
    assistant: { value: '', label: '' },
    starting_point
  };
};
