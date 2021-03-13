import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

const pattern = "d/MM/yyyy HH:mm:ss.SSS";
const patternNoTime = "d/MM/yyyy";
const timezonePatter = " OOO";
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const standardZone = process.env.STANDARD_TIMEZONE
  ? process.env.STANDARD_TIMEZONE
  : timeZone;

/**
 * The right now date and time on the defined standard timeZone.
 */
export const timeNow = () => {
  let date = new Date();

  return serverTimeToStandardZone(date);
};

/**
 * Convertes the given date (usually the server's) into the defined as standard TimeZone.
 * @param date The date to be converted.
 */
export const serverTimeToStandardZone = (date: Date) => {
  let utctime = zonedTimeToUtc(date, timeZone);

  return utcToZonedTime(utctime, standardZone);
};

/**
 * Formats the given data into a human readable string.
 * @param date The date to be converted.
 * @param noTime If the time shall appear in the string. Default: false.
 * @param timezone If the Timezone GMT shall appear in the string. Default: true.
 */
export const standardFormat = (date: Date, noTime = false, timezone = true) => {
  let localPattern = noTime ? patternNoTime : pattern;
  localPattern = timezone ? localPattern + timezonePatter : localPattern;

  return format(date, localPattern);
};

/**
 * Converts an human readable date string into a date object.
 * @param date Date string to be loaded.
 * @param onlyDate if only the date shall be converted back to date.
 * @PS #TODO: This function is still incapable of converting the GMT.
 */
export const loadFormatedDate = (date: string, onlyDate = true) => {
  let [dt, tm]: any = date.split(" ");

  dt = dt.split("/");
  let deconstructed = [dt[2], dt[1] - 1, dt[0]];

  if (!onlyDate) {
    tm = tm.split(":");
    tm[2] = tm[2].split(".");
    deconstructed = deconstructed.concat([tm[0], tm[1], tm[2][0], tm[2][1]]);
  }

  return new Date(...(deconstructed as []));
};
