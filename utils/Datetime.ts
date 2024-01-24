import dayjs, { ConfigType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type DateTimeFormat = string;

export const currentDatetimeObject: dayjs.Dayjs = dayjs();

export const currentDatetime = (): dayjs.Dayjs => dayjs().subtract(3, "hours");

export const currentDatetimeForDB = (): dayjs.Dayjs => currentDatetime();

export const currentHour = (): number => currentDatetime().hour();

export const tomorrowDatetime = (): dayjs.Dayjs =>
  currentDatetime().add(1, "day");

export const tomorrowDatetimeForDB = (): dayjs.Dayjs => dayjs().add(1, "day");

export const currentMonth = (): dayjs.Dayjs => dayjs().startOf("month");

export const startOfDay = (): dayjs.Dayjs => dayjs().startOf("day");

export const endOfDay = (): dayjs.Dayjs => dayjs().endOf("day");

export const startOfDate = (date: ConfigType): dayjs.Dayjs =>
  dayjs(date).startOf("day");

export const endOfDate = (date: ConfigType): dayjs.Dayjs =>
  dayjs(date).endOf("day");

export const datetimeFormatted = (date: ConfigType, format: string): string =>
  dayjs(date).format(format);

export const datetimeDiff = (date1: ConfigType, date2: ConfigType): number =>
  dayjs(date1).diff(dayjs(date2), "day");

dayjs.extend(relativeTime);

export const datetimeFromNow = (date: ConfigType): string =>
  dayjs(date).fromNow();

// Configure dayjs to use 'es' locale
dayjs.locale("es");

// Example usage:
// const formattedDate = datetimeFormatted(currentDatetime(), 'YYYY-MM-DD HH:mm:ss');
// const timeFromNow = datetimeFromNow(currentDatetime());
