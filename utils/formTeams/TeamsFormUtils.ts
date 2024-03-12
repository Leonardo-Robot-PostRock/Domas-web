import type { DynamicHelperText, DynamicLabel } from '@/types/Form/FormFieldProps';

export const FormValidations = {
  AREA_REQUIRED: 'Por favor, seleccione un area.',
  ASSISTANT_REQUIRED: 'Por favor, seleccione un auxiliar.',
  CLUSTER_CONF_REQUIRED: 'Por favor, seleccione al menos un grupo principal de cluster.',
  CLUSTER_REQUIRED: 'Por favor, seleccione al menos un cluster.',
  GEOLOCATION:
    'Por favor, ingresa una geolocalización válida en el formato de ejemplo -32.88674234061537, -68.85978536314231',
  GOOGLE_CALENDAR_ID: 'Por favor, ingresa un ID válido para Google Calendar.',
  LIDER_REQUIRED: 'Por favor, seleccione un lider.',
  PHOTO_ASSISTANT_REQUIRED: 'Por favor, adjunta una foto del auxiliar.',
  PHOTO_LEADER_REQUIRED: 'Por favor, adjunta una foto del líder.',
  MESA_USERNAME: 'Por favor, ingrese nombre de usuario de mesa',
  NAME_REQUIRED: 'Por favor, ingrese nombre de la cuadrilla',
  SUPERVISOR_REQUIRED: 'Por favor, seleccione un supervisor.'
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
