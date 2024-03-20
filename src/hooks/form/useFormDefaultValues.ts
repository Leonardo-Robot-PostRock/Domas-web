/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib';
import { setSelectedTechnician } from '@/lib/store/technicians/techniciansSlice';
import type { DefaultValues } from 'react-hook-form';
import type { FieldData } from '@/types/Form/FormFieldProps';
import type { FormData, Params, TeamEdit } from '@/types/Form/teamEdit';

const LeaderOption = ({ technicians }: Params): FieldData | undefined => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (technicians.length > 0) {
      dispatch(
        setSelectedTechnician({
          field: 'leader',
          technicians: { value: technicians[0].id, label: technicians[0].name }
        })
      );
    }
  }, [dispatch, technicians]);

  if (technicians?.length) {
    return { value: technicians[0].id, label: technicians[0].name };
  }
};

const AssistantOption = ({ technicians }: Params): FieldData | undefined => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (technicians.length > 1) {
      dispatch(
        setSelectedTechnician({
          field: 'assistant',
          technicians: { value: technicians[1].id, label: technicians[1].name }
        })
      );
    }
  }, [dispatch, technicians]);

  if (technicians.length > 1) {
    return { value: technicians[1].id, label: technicians[1].name };
  }
};

export const useFormDefaultValues = (teamData: TeamEdit | null | undefined): DefaultValues<FormData> | undefined => {
  if (!teamData) return {};

  const {
    name,
    google_calendar_id,
    mesa_username,
    supervisor_id,
    min_tickets_to_do,
    technicians,
    max_tickets_to_do_only_omnichannel,
    starting_point
  } = teamData;

  const supervisor = supervisor_id ? { value: supervisor_id, label: teamData.supervisor ?? '' } : undefined;
  const leader = LeaderOption({ technicians });
  const assistant = AssistantOption({ technicians });

  return {
    name,
    mesa_username,
    google_calendar_id,
    min_tickets_to_do,
    max_tickets_to_do_only_omnichannel,
    supervisor,
    leader,
    assistant,
    starting_point
  };
};
