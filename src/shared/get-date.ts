/**
 * Devuelve una fecha con el formato yyyy-MM-dd
 * @param plusExtraDays cantidad de dias a añadir a la fecha actual, por defecto es 0
 * @returns fecha con el formato yyyy-MM-dd
 */
export const getDate = (plusExtraDays = 0) => {
  const today = new Date();

  const dayPlusDays = new Date(today.getTime() + plusExtraDays * 24 * 60 * 60 * 1000);

  const todayISO = dayPlusDays.toISOString();

  const todayISOSplit = todayISO.split("T");

  const yyyyMMdd = todayISOSplit[0];

  if (yyyyMMdd) {
    return yyyyMMdd;
  }

  return "";
};

/**
 * Devuelve una fecha con el formato yyyy-MM-dd
 * @param day fecha con el formato yyyy-MM-dd
 * @returns fecha con el formato Date
 */
export const getDateISO = (day: string) => {
  return new Date(day);
};

/**
 * Devuelve una fecha con el formato yyyy-MM-dd HH:mm
 * @param day fecha con el formato Date
 * @returns fecha con el formato yyyy-MM-dd HH:mm
 * @example
 * getDateTimeISO(new Date("2023-01-01T10:00")); // Devuelve "2023-01-01 10:00"
 */
export const getDateTimeISO = (day: Date) => {
  const dateISOSplit = day.toISOString().split("T");

  return `${dateISOSplit[0]} ${dateISOSplit[1]}`;
};

/**
 * Devuelve una fecha con el formato yyyy-MM-dd
 * @param date fecha con el formato Date
 * @returns fecha con el formato yyyy-MM-dd
 */
export const getDateISOString = (date: Date | undefined) => {
  if (!date) return "";

  const dateIso = date.toISOString();

  const dateISOSplit = dateIso.split("T");

  const yyyyMMdd = dateISOSplit[0];

  if (yyyyMMdd) {
    return yyyyMMdd;
  }

  return "";
};

/**
 * Devuelve una fecha con el formato hh:mm:ss
 * @param date fecha con el formato Date
 * @returns fecha con el formato hh:mm:ss
 */
export const getTimeISOString = (date: Date | undefined) => {
  if (!date) return "";

  return new Date(date ?? "").toLocaleTimeString("es-AR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Devuelve true si la fecha pasada es una fecha pasada
 * @param fecha fecha a comprobar
 * @returns true si la fecha pasada es una fecha pasada
 * @example
 * esFechaPasada("2023-01-01"); // false
 */
export const esFechaPasada = (fecha: string | Date | undefined) => {
  if (!fecha) return false;

  const date = new Date(fecha);

  const now = new Date();

  return date < now;
};

/**
 * Devuelve una fecha en formato Date
 * @param fecha Fecha en formato yyyy-MM-dd
 * @param hora Hora en formato HH:mm
 * @returns fecha en formato Date
 * @example
 * armarFechaReserva("2023-01-01", "10:00"); // Devuelve Date("2023-01-01T10:00")
 */
export const armarFechaReserva = (fecha: string, hora: string) => {
  return new Date(`${fecha}T${hora}`);
};
