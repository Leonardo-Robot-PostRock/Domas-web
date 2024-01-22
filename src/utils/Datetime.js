import dayjs from 'dayjs';

export const currentDatetimeObject = dayjs().$d;
export const currentDatetime = () => (dayjs().subtract(3, 'hours').$d);
export const currentDatetimeForDB = () => (dayjs().subtract(3, 'hours').$d);
export const currentHour = () => (dayjs().subtract(3,'hours').hour());
export const tomorrowDatetime = () => (dayjs().subtract(3, 'hours').add('1','day').$d);
export const tomorrowDatetimeForDB = () => (dayjs().add('1','day').$d);
export const currentMonth = () => (dayjs().startOf('month').$d);
// Probados en BD: (devuelve ordenes de 00 a 23:59)
export const startOfDay = () => (dayjs().startOf('day').$d);    
export const endOfDay = () => (dayjs().endOf('day').$d);
export const startOfDate = (date) => (dayjs(date).startOf('day').$d);
export const endOfDate = (date) => (dayjs(date).endOf('day').$d);

export const datetimeFormatted = (date,format) => (dayjs(date).format(format));
export const datetimeDiff = (date1,date2) => (dayjs(date1).diff(date2,'day'));

import relativeTime from 'dayjs/plugin/relativeTime';
import es from 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es')

export const datetimeFromNow = (date) => (dayjs(date).fromNow());