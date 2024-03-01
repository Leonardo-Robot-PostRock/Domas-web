import axios from 'axios';

import { setTechnicianDataField } from './techniciansSlice';
import { handleAxiosError } from '@/utils/errorHandling';

import type { AsyncThunkAction } from '@/types/store/actionType';
import type { Technician } from '@/types/api/technician';
import type { Team, TechnicianDetails } from '@/types/api/teams';
import type { TechnicianField } from '@/types/store/technician';

export const fetchTechnician = (): AsyncThunkAction => async (dispatch, getState) => {
  const dataTeams = getState().teams.teams;

  if (Array.isArray(dataTeams)) {
    try {
      const response = await axios.get<Technician>('/api/technician/all');
      const technicians: Technician = response.data;

      const updateTechnicianData: TechnicianField[] = technicians.users.map((item) => {
        const team = dataTeams.find((teamItem: Team) =>
          teamItem.technicians.some((technician: TechnicianDetails) => technician.id === item.id)
        );

        return { value: item.id, label: `${item.name} - ${team ? item.name : 'libre'}` };
      });

      dispatch(setTechnicianDataField(updateTechnicianData));
    } catch (error) {
      handleAxiosError(dispatch, error);
    }
  }
};
