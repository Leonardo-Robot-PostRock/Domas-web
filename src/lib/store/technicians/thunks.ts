/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';

import { setTechnicianDataField } from './techniciansSlice';
import { handleAxiosError } from '@/utils/errorHandling';

import type { AsyncThunkAction } from '@/types/store/actionType';
import type { Technician, User } from '@/types/api/technician';
import type { Team } from '@/types/api/teams';
import type { FieldData } from '@/types/Form/FormFieldProps';

export const fetchTechnicianDataField = (): AsyncThunkAction => async (dispatch, getState) => {
  const dataTeams: Team[] = getState().teams.teams;

  try {
    const response = await axios.get<Technician>('/api/technician/all');
    const technicians: Technician = response.data;

    const updateTechnicianData: FieldData[] = technicians.users.map((item: User) => {
      const team = dataTeams.find((teamItem: Team) =>
        teamItem.technicians.some((technician) => technician.id === item.id)
      );

      return { value: item.id, label: `${item.name} - ${team ? item.name : 'libre'}` };
    });

    dispatch(setTechnicianDataField(updateTechnicianData));
  } catch (error) {
    handleAxiosError(dispatch, error);
  }
};
