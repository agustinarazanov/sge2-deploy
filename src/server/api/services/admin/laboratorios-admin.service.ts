import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import { inputGetLaboratorios } from "@/shared/filters/admin-laboratorios-filter.schema";
import { getAllLaboratorios } from "../../repositories/admin/laboratorios-admin.repository";

export const getTodosLosLaboratoriosProcedure = protectedProcedure
  .input(inputGetLaboratorios)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetLaboratorios, input);

    const laboratorios = await getAllLaboratorios(ctx, input);

    return laboratorios;
  });
