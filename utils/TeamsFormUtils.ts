import type { DynamicHelperText, DynamicLabel } from '@/types/Form/FormFieldProps';

export const FormValidations = {
  REQUIRED: 'Este campo es obligatorio.',
  GEOLOCATION:
    'Por favor, ingresa una geolocalización válida en el formato de ejemplo -32.88674234061537, -68.85978536314231',
  GOOGLE_CALENDAR_ID: 'Por favor, ingresa un ID válido para Google Calendar.',
  SUPERVISOR_REQUIRED: 'Por favor, selecciona un supervisor.',
  CLUSTER_REQUIRED: 'Por favor, selecciona al menos un cluster.',
  CLUSTER_CONF_REQUIRED: 'Por favor, selecciona al menos un grupo principal de cluster.',
  PHOTO_LEADER_REQUIRED: 'Por favor, adjunta una foto del líder.',
  ASSISTANT_REQUIRED: 'Por favor, selecciona un auxiliar.',
  PHOTO_ASSISTANT_REQUIRED: 'Por favor, adjunta una foto del auxiliar.'
};

export const dynamicLabel: DynamicLabel = {
  minTicketsTodo: 'Representa la cantidad minima de tickets que debe realizar la cuadrilla.',
  maxTicketsTodo:
    'Representa la cantidad maxima de tickets que puede realizar la cuadrilla para los canales de OMNICANALIDAD'
};

export const dynamicHelperText: DynamicHelperText = {
  minTodoHelperText: 'En caso de no definirlo, por defecto se tomará 5.',
  maxTodoHelperText: 'En caso de no definirlo, por defecto se tomará 8.'
};
