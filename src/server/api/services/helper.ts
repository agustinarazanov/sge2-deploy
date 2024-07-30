import { TRPCError } from "@trpc/server";
import { type z } from "zod";

export const validarInput = (schema: z.ZodTypeAny, input: unknown) => {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: `Error en los parametros: ${result.error.message}`,
      cause: result.error,
    });
  }

  return result.data;
};
