import axios from 'axios';

import { handleAxiosError } from '@/utils/errorHandling';

import { AsyncThunkAction } from '@/types/store/actionType';
import { setTechnicianDataField } from './techniciansSlice';
import { Technician, User } from '@/types/api/technician';
import { Team } from '@/types/api/teams';

export const fetchTechnician = (): AsyncThunkAction => async (dispatch, getState) => {
  const dataTeams = getState().teams.teams;

  if (Array.isArray(dataTeams)) {
    try {
      const response = await axios.get<Technician>('/api/technician/all');
      const technicians: Technician = response.data;

      const updateTechnicianData = technicians.users.map((item: User) => {
        const team = dataTeams.find((teamItem: Team) =>
          teamItem.technicians.some((technician) => technician.id === item.id)
        );

        return { value: item.id, label: `${item.name} - ${team ? item.name : 'libre'}` };
      });

      dispatch(setTechnicianDataField(updateTechnicianData));
    } catch (error: unknown) {
      handleAxiosError(dispatch, error);
    }
  }
};
