import { useAppDispatch } from '@/store';
import { setSquadDrawerId } from '@/store/squad/squadReducer';
import { Team } from '@/types/api/teamById';
import { IconButton } from '@chakra-ui/react';
import { GiFountainPen } from 'react-icons/gi';

// The object represent each column of the table

export const useColumnsTableTeams = () => {
  const dispatch = useAppDispatch();
  const resize = { resizerHighlight: '#FFE5E5' };

  const columns = [
    {
      label: '',
      renderCell: (item: Team) => (
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <IconButton
            aria-label="edit"
            icon={<GiFountainPen size={15} color="863A6F" />}
            size="xs"
            padding={2}
            variant="ghost"
            colorScheme="#4a5568"
            _hover={{ backgroundColor: '#82AAE3' }}
            onClick={() => dispatch(setSquadDrawerId(item.id))}
          />
        </div>
      ),
    },
    { label: 'Nombre', renderCell: (item: Team) => item.name, sort: { sortKey: 'TASK' } },
    {
      label: 'Integrantes',
      renderCell: (item: Team) => item.technicians.map((tech) => tech.name).join(', '),
    },
    { label: 'Usuario de Mesa', renderCell: (item: Team) => item.mesa_username },
    { label: 'Supervisor', renderCell: (item: Team) => item.supervisor },
    {
      label: 'Áreas',
      renderCell: (item: Team) => item.areas.map((area) => area.name).join(', '),
    },
    { label: 'Cluster', renderCell: (item: Team) => item.clusters.map((cluster) => cluster?.name).join(', ') },
    {
      label: 'Ppal Cluster',
      renderCell: (item: Team) => item.clusters.find((cluster) => cluster.favourite_group)?.name || '-',
    },
    { label: 'Tickets diarios mínimo', renderCell: (item: Team) => item.min_tickets_to_do },
    {
      label: 'Tickets máximos para Omnicanalidad',
      renderCell: (item: Team) => item.max_tickets_to_do_only_omnichannel,
    },
    {
      label: 'Punto de partida',
      renderCell: (item: Team) => item.starting_point || '-',
    },
    { label: 'ID de Traccar', renderCell: (item: Team) => item.traccar_device_id || '-' },
  ];

  return columns;
};
