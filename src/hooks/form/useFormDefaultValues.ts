/* eslint-disable @typescript-eslint/naming-convention */
import { useAppDispatch, useAppSelector } from '@/lib';
import { setSelectedTechnician } from '@/lib/store/technicians/techniciansSlice';
import type { FieldData } from '@/types/Form/FormFieldProps';
import type { FormData, TeamEdit } from '@/types/Form/teamEdit';
import { useEffect } from 'react';
import type { DefaultValues } from 'react-hook-form';

const LeaderOption = (): FieldData | undefined => {
  const { technicianDataField, selectedTechnicians } = useAppSelector((state) => state.technicians);
  const dispatch = useAppDispatch();
  const leader = technicianDataField.find((tech) => tech.label === selectedTechnicians.leader.label);

  console.log('Leader: ', leader);

  useEffect(() => {
    if (leader) {
      dispatch(setSelectedTechnician({ field: 'leader', technicians: leader }));
    }
  }, [dispatch, leader]);

  return leader ? { value: leader.value, label: leader.label } : undefined;
};

const AssistantOption = (): FieldData | undefined => {
  const { technicianDataField, selectedTechnicians } = useAppSelector((state) => state.technicians);
  const dispatch = useAppDispatch();
  const assistant = technicianDataField.find((tech) => tech.label === selectedTechnicians.assistant.label);

  console.log('Assistant: ', assistant);

  useEffect(() => {
    if (assistant) {
      dispatch(setSelectedTechnician({ field: 'assistant', technicians: assistant }));
    }
  }, [dispatch, assistant]);

  return assistant
    ? { value: selectedTechnicians.assistant.value, label: selectedTechnicians.assistant.label }
    : undefined;
};

export const useFormDefaultValues = (teamData: TeamEdit | null | undefined): DefaultValues<FormData> | undefined => {
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
  const leader = LeaderOption();
  const assistant = AssistantOption();

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
