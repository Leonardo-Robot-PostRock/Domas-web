'use client';

import { usePathname } from 'next/navigation';

//Hook for handle cookies
import { useAuthentication } from './useAuthentication';

import { AiFillCar, AiFillCalendar, AiFillPushpin } from 'react-icons/ai';
import { RiHistoryLine, RiTodoFill, RiDashboardFill, RiRoadMapLine } from 'react-icons/ri';
import {
  BsCardList,
  BsFillPersonLinesFill,
  BsFillTicketFill,
  BsJournals,
  BsSearch,
  BsTelephoneFill,
  BsTelephonePlusFill,
} from 'react-icons/bs';
import { IoMapSharp } from 'react-icons/io5';
import { GiPapers } from 'react-icons/gi';

export const useNavigationDomas = () => {
  const pathname = usePathname();

  const { userRoles } = useAuthentication();

  const Links = [
    {
      id: 1,
      link: '',
      title: 'Coordinación',
      selected: pathname == '/coordinateTk' || pathname == '/coordinations',
      allow: userRoles.includes('COORDINADOR'),
      icon: <RiRoadMapLine />,
      subLinks: [
        {
          id: 1,
          link: '/coordinateTk',
          title: 'Coordinar visita',
          selected: pathname == '/coordinateTk',
          allow: userRoles.includes('COORDINADOR'),
          icon: <AiFillPushpin />,
        },
        {
          id: 2,
          link: '/coordinations',
          title: 'Mis coordinaciones',
          selected: pathname == '/coordinations',
          allow: userRoles.includes('COORDINADOR'),
          icon: <BsCardList />,
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
      icon: <BsJournals />,
      subLinks: [
        {
          id: 1,
          link: '/today_orders',
          title: 'Ordenes',
          selected: pathname == '/today_orders',
          allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
          icon: <GiPapers />,
        },
        {
          id: 2,
          link: '/roadmaps',
          title: 'Hojas de ruta',
          selected: pathname == '/roadmaps',
          allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
          icon: <RiRoadMapLine />,
        },
        {
          id: 3,
          link: '/teams',
          title: 'Cuadrillas',
          selected: pathname == '/teams',
          allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
          icon: <AiFillCar />,
        },
        {
          id: 4,
          link: '/calendar',
          title: 'Calendario',
          selected: pathname == '/calendar',
          allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
          icon: <AiFillCalendar />,
        },
        {
          id: 5,
          link: '/activity',
          title: 'Actividad',
          selected: pathname == '/activity',
          allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
          icon: <RiHistoryLine />,
        },
      ],
    },
    {
      id: 3,
      link: '/ticket/todo',
      title: 'Ticket para hacer',
      selected: pathname == '/ticket/todo',
      allow: userRoles.includes('TECNICO'),
      icon: <RiTodoFill />,
    },
    {
      id: 4,
      link: 'https://geodex.westnet.com.ar/st',
      title: 'Mapa',
      selected: pathname == 'https://geodex.westnet.com.ar/st',
      allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
      icon: <IoMapSharp />,
    },
    {
      id: 5,
      link: '/dashboard',
      title: 'Dashboard',
      selected: pathname == '/dashboard',
      allow: userRoles.includes('SUPERVISOR') || userRoles.includes('ADMINISTRADOR'),
      icon: <RiDashboardFill />,
    },
    {
      id: 6,
      link: '',
      title: 'Call Center',
      selected: pathname == '/callcenter/tickets-assigned',
      allow: userRoles.includes('CALLCENTER'),
      icon: <BsTelephoneFill />,
      subLinks: [
        {
          id: 1,
          link: '/callcenter/tickets-assigned',
          title: 'Tickets Asignados',
          selected: pathname == '/callcenter/tickets-assigned',
          allow: userRoles.includes('CALLCENTER'),
          icon: <BsTelephonePlusFill />,
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
      icon: <BsSearch />,
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
          icon: <BsFillTicketFill />,
        },
        {
          id: 2,
          link: '/mesa/search-customer',
          title: 'Cliente',
          selected: pathname == '/mesa/search-customer',
          allow: userRoles.includes('CALLCENTER') || userRoles.includes('ADMINISTRADOR'),
          icon: <BsFillPersonLinesFill />,
        },
      ],
    },
  ];

  return {
    Links,
  };
};
