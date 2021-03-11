import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

const pattern = "d/MM/yyyy HH:mm:ss.SSS";
const patternNoTime = "d/MM/yyyy";
const timezonePatter = " OOO";
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const standardZone = process.env.STANDARD_TIMEZONE
  ? process.env.STANDARD_TIMEZONE
  : timeZone;

export const timeNow = () => {
  let date = new Date();

  return serverTimeToStandardZone(date);
};

export const serverTimeToStandardZone = (date: Date) => {
  let utctime = zonedTimeToUtc(date, timeZone);

  return utcToZonedTime(utctime, standardZone);
};

export const standardFormat = (date: Date, noTime = false, timezone = true) => {
  let localPattern = noTime ? patternNoTime : pattern;
  localPattern = timezone ? localPattern + timezonePatter : localPattern;

  return format(date, localPattern);
};

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
