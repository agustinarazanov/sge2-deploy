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
export const getUltimoInventarioId = async (ctx: {
  db: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >;
}) => {
  const equipoTablaNombre = Prisma.ModelName.Equipo;
  const inventarioIdNombre = Prisma.EquipoScalarFieldEnum.inventarioId;

  const nuevoInventarioId = await ctx.db
    .$queryRaw<string>`SELECT MAX(CAST(SUBSTRING("${inventarioIdNombre}" FROM 3) AS INTEGER)) FROM ${equipoTablaNombre} WHERE "${inventarioIdNombre}" LIKE '${PREFIJO_INVENTARIO_ID}%'`;

  return Number(nuevoInventarioId);
};

export const generarInventarioId = (inventarioId: number) => {
  return `NG${inventarioId}`;
};
