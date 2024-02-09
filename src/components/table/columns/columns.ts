import { Team } from '@/types/api/teamById';

// The object represent each column of the table

export const COLUMNS = [
  { label: 'Nombre', renderCell: (item: Team) => item.name },
  { label: 'Integrantes', renderCell: (item: Team) => item.technicians.map((tech) => tech.name).join(', ') },
  { label: 'Usuario de Mesa', renderCell: (item: Team) => item.mesa_username },
  { label: 'Supervisor', renderCell: (item: Team) => item.supervisor },
  { label: 'Áreas', renderCell: (item: Team) => item.areas.map((area) => area.name).join(', ') },
  { label: 'Cluster', renderCell: (item: Team) => item.clusters.map((cluster) => cluster?.name).join(', ') },
  {
    label: 'Ppal Cluster',
    renderCell: (item: Team) => item.clusters.find((cluster) => cluster.favourite_group)?.name || '-',
  },
  { label: 'Tickets diarios mínimo', renderCell: (item: Team) => item.min_tickets_to_do },
  { label: 'Tickets máximos para Omnicanalidad', renderCell: (item: Team) => item.max_tickets_to_do_only_omnichannel },
  { label: 'Punto de partida', renderCell: (item: Team) => item.starting_point || '-' },
  { label: 'ID de Traccar', renderCell: (item: Team) => item.traccar_device_id || '-' },
];
