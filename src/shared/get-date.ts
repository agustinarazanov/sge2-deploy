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

  const dateIso = date.toISOString();

  const dateISOSplit = dateIso.split("T");

  const hhmmss = dateISOSplit[1];

  if (hhmmss) {
    return hhmmss;
  }

  return "";
};
