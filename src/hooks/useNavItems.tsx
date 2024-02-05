import { usePathname } from 'next/navigation';

import { useAuthentication } from './useAuthentication';

import { icons } from '@/components/ui/nav/iconsComponent/Icons';
import { LinkItem } from '@/types/NavMenuItemProps/linksAndSublink';

export const useNavItems = () => {
  const pathname = usePathname();
  const { userRoles } = useAuthentication();

  const Links: LinkItem[] = [
    {
      id: 1,
      link: '',
      title: 'Coordinación',
      selected: pathname == '/coordinateTk' || pathname == '/coordinations',
      allow: userRoles.includes('COORDINADOR'),
      icon: icons[6], // RiRoadMapLine
      subLinks: [
        {
          id: 1,
          link: '/coordinateTk',
          title: 'Coordinar visita',
          selected: pathname == '/coordinateTk',
          allow: userRoles.includes('COORDINADOR'),
          icon: icons[2], // AiFillPushpin
        },
        {
          id: 2,
          link: '/coordinations',
          title: 'Mis coordinaciones',
          selected: pathname == '/coordinations',
          allow: userRoles.includes('COORDINADOR'),
          icon: icons[7], // BsCardList
        },
      ],
    },
    {
      id: 2,
      link: '',
      title: 'Supervisión',
      selected:
        pathname == '/today_orders' ||
        pathname == '/roadmaps' ||
        pathname == '/teams' ||
        pathname == '/calendar' ||
        pathname == '/activity',
      allow:
        (userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR')) && !userRoles.includes('CALLCENTER'),
      icon: icons[3], // RiHistoryLine
      subLinks: [
        {
          id: 1,
          link: '/today_orders',
          title: 'Ordenes',
          selected: pathname == '/today_orders',
          allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
          icon: icons[4], // RiTodoFill
        },
        {
          id: 2,
          link: '/roadmaps',
          title: 'Hojas de ruta',
          selected: pathname == '/roadmaps',
          allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
          icon: icons[6], // RiRoadMapLine
        },
        {
          id: 3,
          link: '/teams',
          title: 'Cuadrillas',
          selected: pathname == '/teams',
          allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
          icon: icons[0], // AiFillCar
        },
        {
          id: 4,
          link: '/calendar',
          title: 'Calendario',
          selected: pathname == '/calendar',
          allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
          icon: icons[1], // AiFillCalendar
        },
        {
          id: 5,
          link: '/activity',
          title: 'Actividad',
          selected: pathname == '/activity',
          allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
          icon: icons[3], // RiHistoryLine
        },
      ],
    },
    {
      id: 3,
      link: '/ticket/todo',
      title: 'Ticket para hacer',
      selected: pathname == '/ticket/todo',
      allow: userRoles.includes('TECNICO'),
      icon: icons[4], // RiTodoFill
    },
    {
      id: 4,
      link: 'https://geodex.westnet.com.ar/st',
      title: 'Mapa',
      selected: pathname == 'https://geodex.westnet.com.ar/st',
      allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
      icon: icons[14], // IoMapSharp
    },
    {
      id: 5,
      link: '/dashboard',
      title: 'Dashboard',
      selected: pathname == '/dashboard',
      allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
      icon: icons[5], // RiDashboardFill
    },
    {
      id: 6,
      link: '',
      title: 'Call Center',
      selected: pathname == '/callcenter/tickets-assigned',
      allow: userRoles.includes('CALLCENTER'),
      icon: icons[12], // BsTelephoneFill
      subLinks: [
        {
          id: 1,
          link: '/callcenter/tickets-assigned',
          title: 'Tickets Asignados',
          selected: pathname == '/callcenter/tickets-assigned',
          allow: userRoles.includes('CALLCENTER'),
          icon: icons[13], // BsTelephonePlusFill
        },
      ],
    },
    {
      id: 7,
      link: '',
      title: 'Buscar',
      selected: pathname == '/search-tk' || pathname == '/mesa/search-customer',
      allow:
        userRoles.includes('SUPERVISOR') ||
        userRoles.includes('ADMINISTRADOR') ||
        userRoles.includes('COORDINADOR') ||
        userRoles.includes('CALLCENTER'),
      icon: icons[11], // BsSearch
      subLinks: [
        {
          id: 1,
          link: '/search-tk',
          title: 'Ticket en Do+',
          selected: pathname == '/search-tk',
          allow:
            userRoles.includes('SUPERVISOR') ||
            userRoles.includes('ADMINISTRADOR') ||
            userRoles.includes('COORDINADOR'),
          icon: icons[8], // BsFillTicketFill
        },
        {
          id: 2,
          link: '/mesa/search-customer',
          title: 'Cliente',
          selected: pathname == '/mesa/search-customer',
          allow: userRoles.includes('CALLCENTER') || userRoles.includes('ADMINISTRADOR'),
          icon: icons[9], // BsFillPersonLinesFill
        },
      ],
    },
  ];

  return {
    Links,
  };
};
