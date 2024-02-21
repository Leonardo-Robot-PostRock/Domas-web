import { Params, TeamEdit } from '@/types/Form/teamEdit';
import { Team } from '@/types/api/teams';
import { DefaultValues } from 'react-hook-form';

export const getDefaultValues = (teamData: Team | null): DefaultValues<TeamEdit> | undefined => {
  if (!teamData) return {};

  const {
    name,
    google_calendar_id,
    mesa_username,
    supervisor_id,
    min_tickets_to_do,
    max_tickets_to_do_only_omnichannel,
    supervisor,
    technicians,
    starting_point,
  } = teamData;

  const supervisorOption = supervisor_id ? { value: supervisor_id, label: supervisor || '' } : undefined;
  const leaderOption = getLeaderOption({ technicians, mesa_username });
  const assistantOption = getAssistantOption({ technicians, mesa_username });

  return {
    name,
    mesa_username,
    google_calendar_id,
    min_tickets_to_do,
    max_tickets_to_do_only_omnichannel,
    supervisorOption: supervisorOption,
    leader: leaderOption,
    assistant: assistantOption,
    starting_point,
  };
};

const getLeaderOption = ({ technicians, mesa_username }: Params) => {
  const leader = technicians?.find((item) => item.mesa_username === mesa_username);
  return leader ? { value: leader.id, label: leader.name } : null;
};

const getAssistantOption = ({ technicians, mesa_username }: Params) => {
  const assistant = technicians?.find((item) => item.mesa_username !== mesa_username);
  return assistant ? { value: assistant.id, label: assistant.name } : null;
};
