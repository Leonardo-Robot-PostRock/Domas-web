import type { ReactNode } from 'react';
import { MenuButtonComponent } from '@/components/buttons/MenuButtonComponent';
import { TooltipComponent } from '@/components/tooltips/TooltipComponent';
import type { Team } from '@/types/api/teams';

// The object represent each column of the table

interface TableColumn {
  label: string;
  renderCell: (item: Team) => ReactNode;
  sort?: {
    sortKey: string;
  };
}

export const useColumnsTableTeams = (): TableColumn[] => {
  const columns = [
    {
      label: '',
      renderCell: (item: Team) => <MenuButtonComponent item={item} />
    },
    { label: 'Nombre', renderCell: (item: Team) => item.name, sort: { sortKey: 'NAME' } },
    {
      label: 'Integrantes',
      renderCell: (item: Team) => <TooltipComponent content={item.technicians} />
    },
    {
      label: 'Usuario de Mesa',
      renderCell: (item: Team) => <TooltipComponent content={[{ name: item.mesa_username }]} />
    },
    {
      label: 'Supervisor',
      renderCell: (item: Team) => <TooltipComponent content={[{ name: item.supervisor ?? '' }]} />
    },
    {
      label: 'Áreas',
      renderCell: (item: Team) => item.areas.map((area) => area.name).join(', ')
    },
    {
      label: 'Cluster',
      renderCell: (item: Team) => <TooltipComponent content={item.clusters.map((cluster) => cluster)} />
    },
    {
      label: 'Ppal Cluster',
      renderCell: (item: Team) => {
        const ppalCluster = item.clusters.filter((cluster) => cluster.favourite_group === item.id);
        const ppalClusterName = ppalCluster ?? '-';
        return <TooltipComponent content={ppalClusterName} />;
      }
    },
    { label: 'Tickets diarios mínimo', renderCell: (item: Team) => item.min_tickets_to_do },
    {
      label: 'Tickets máximos para Omnicanalidad',
      renderCell: (item: Team) => item.max_tickets_to_do_only_omnichannel
    },
    {
      label: 'Punto de partida',
      renderCell: (item: Team) => item.starting_point ?? '-'
    },
    { label: 'ID de Traccar', renderCell: (item: Team) => item.traccar_device_id ?? '-' }
  ];

  return columns;
};
