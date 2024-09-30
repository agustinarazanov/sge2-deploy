import { z } from "zod";

export const enumReservaEstatus = z.enum(["PENDIENTE", "FINALIZADA", "CANCELADA", "RECHAZADA", ""]);

export const inputGetReservaLibroPorUsuarioId = z.object({
  id: z.string().min(1),
});

export const inputGetReservasLibroPorLibroId = z.object({
  libroId: z.number().positive().min(1, { message: "Requerido" }),
});

export const inputGetAllPrestamosLibros = z.object({
  pageSize: z.enum(["10", "20", "30", "40", "50"]).default("10").catch("10"),
  pageIndex: z
    .string()
    .default("0")
    .refine((value) => parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch("0"),
  orderBy: z
    .enum([
      "id",
      "libro_inventarioId",
      "libro_titulo",
      "reserva_usuarioSolicito_apellido",
      "reserva_fechaHoraInicio",
      "reserva_fechaHoraFin",
      "reserva_usuarioAprobador_apellido",
      "reserva_usuarioRenovo_apellido",
      "reserva_usuarioRecibio_apellido",
    ])
    .default("id")
    .catch("id"),
  orderDirection: z.enum(["asc", "desc"]).default("desc").catch("desc"),
  searchText: z.string().default(""),
  estatus: enumReservaEstatus.default("").catch(""),
  filtrByUserId: z.enum(["true", "false"]).optional(),
});

export const inputPrestarLibro = z
  .object({
    libroId: z.number().positive().min(1, { message: "Requerido" }),
    usuarioSolicitanteId: z.string().optional(),
    fechaInicio: z.string().min(1, { message: "Requerido" }),
    fechaFin: z.string().min(1, { message: "Requerido" }),
  })
  .superRefine(({ fechaInicio, fechaFin }, ctx) => {
    const date1 = new Date(fechaInicio);
    const date2 = new Date(fechaFin);

    if (date1 > date2) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: "La fecha de inicio debe ser menor a la de fin",
        path: ["fechaInicio"],
      });

      return z.NEVER;
    }
  });

export const inputGetReservaPorUsuarioId = z.object({
  id: z.string().min(1),
});

export const inputGetReservaPorId = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
});
