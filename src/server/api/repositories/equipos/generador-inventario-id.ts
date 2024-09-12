import { Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";

const PREFIJO_INVENTARIO_ID = "NG";

/**
 * Durante el desarrollo de este módulo, detectamos que utilizan inventarioId de muchas formas distintas.
 * Primero eran solo numeros, luego numeros con sufijos, o parentesis. Y al final vimos que manejan un `NG<numero>` para nuevos inventarios.
 * Por lo tanto para no obligarlos a actualizar todos su inventario, decidimos mantener el nuevo formato de "NG<numero>".
 *
 * @description Obtiene el último numero de `inventarioId` de cualquier equipo que tenga un `inventarioId` con el formato `NG<numero>`.
 * @param ctx viene de prisma por defecto, o una transccion de prisma si se quiere realizar una transaccion
 * @returns el ultimo numero de inventarioId de cualquier equipo que tenga un `inventarioId` con el formato `NG<numero>`
 */
export const getUltimoEquipoInventarioId = async (ctx: {
  db: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
}) => {
  validarNombresDeTablaYColumna();

  const query = Prisma.sql`SELECT MAX(CAST(SUBSTRING("inventarioId" FROM 3) AS INTEGER)) as max FROM "Equipo" WHERE "inventarioId" LIKE CONCAT(${PREFIJO_INVENTARIO_ID}, '%')`;

  const nuevoInventarioId = await ctx.db.$queryRaw<{ max: string }[]>(query);

  if (!nuevoInventarioId?.length) {
    return 1;
  }

  if (nuevoInventarioId[0]?.max === undefined) {
    return 1;
  }

  return Number(nuevoInventarioId[0]?.max);
};

export const generarEquipoInventarioId = (inventarioId: number) => {
  return `${PREFIJO_INVENTARIO_ID}${inventarioId}`;
};

/**
 * Debido a la naturaleza de la query, la única forma de obtener el último inventarioId de la tabla Libro es con una `queryRaw`
 * Pero para obtenerlo sin exponernos a un SQL-Injection, necesitaba utilizar `queryRaw` y no `queryRawUnsafe`
 * Por lo tanto, en `queryRaw` no podemos interpolar nombres de tablas ni nombres de columnas, asi que esta validación, esta solo por si alguien cambia el nombre de la tabla
 *
 * https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries#queryrawunsafe
 *
 * @description Si alguno de estos errores falla, significa que hay que cambiar el nombre 'Libro' o 'inventarioId' en la queryRaw
 */
const validarNombresDeTablaYColumna = () => {
  const laTablaTieneNombreCorrecto = Prisma.ModelName.Equipo === "Equipo";
  if (!laTablaTieneNombreCorrecto) {
    throw new Error("La tabla 'Equipo' cambió de nombre y no podemos obtener el último inventarioId");
  }

  const laColumnaTieneNombreCorrecto = Prisma.EquipoScalarFieldEnum.inventarioId === "inventarioId";
  if (!laColumnaTieneNombreCorrecto) {
    throw new Error("La columna 'inventarioId' de Equipo cambió de nombre y no podemos obtener el último inventarioId");
  }
};
