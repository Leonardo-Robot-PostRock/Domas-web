/* eslint-disable @typescript-eslint/naming-convention */
import type { AssitantField, FormData, LeaderField, Params, TeamEdit } from '@/types/Form/teamEdit';
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
    technicians,
    starting_point
  } = teamData;

  const supervisor = supervisor_id ? { value: supervisor_id, label: teamData.supervisor ?? '' } : undefined;
  const leaderOption = getLeaderOption({ technicians, mesa_username });
  const assistantOption = getAssistantOption({ technicians, mesa_username });

  return {
    name,
    mesa_username,
    google_calendar_id,
    min_tickets_to_do,
    max_tickets_to_do_only_omnichannel,
    supervisor,
    leader: leaderOption,
    assistant: assistantOption,
    starting_point
  };
};

const getLeaderOption = ({ technicians, mesa_username }: Params): LeaderField | undefined => {
  const leader = technicians?.find((item) => item.mesa_username === mesa_username);
  return leader ? { value: leader.id, label: leader.name } : undefined;
};

const getAssistantOption = ({ technicians, mesa_username }: Params): AssitantField | undefined => {
  const assistant = technicians?.find((item) => item.mesa_username !== mesa_username);
  return assistant ? { value: assistant.id, label: assistant.name } : undefined;
};
