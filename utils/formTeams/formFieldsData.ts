import { FormValidations } from './TeamsFormUtils';

// Array para campos genéricos
export const genericFormFields = [
  {
    id: 'nameField',
    label: 'Nombre*',
    name: 'name',
    validation: FormValidations.REQUIRED
  },
  {
    id: 'calendarField',
    label: 'Google Calendar ID',
    name: 'google_calendar_id',
    validation: FormValidations.GOOGLE_CALENDAR_ID
  },
  {
    id: 'usermesaField',
    label: 'Usuario de mesa*',
    name: 'mesa_username',
    validation: FormValidations.REQUIRED
  }
];

// Array para campos de tickets
export const ticketFormFields = [
  {
    id: 'ticketsMinField',
    label: 'Mínimo de tickets a realizar',
    name: 'min_tickets_to_do'
  },
  {
    id: 'ticketsMaxField',
    label: 'Máximo de tickets a realizar (Solo para OMNICANALIDAD)',
    name: 'max_tickets_to_do_only_omnichannel'
  }
];
