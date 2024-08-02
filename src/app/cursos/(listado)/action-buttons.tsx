import { type z } from "zod";
import { CursosFilterMateria } from "./filtros/curso-filter-materia";
import { CursosFilterText } from "./filtros/curso-filter-text";
import { type inputGetCursos } from "@/shared/cursos-filter.schema";
import { CursosNuevoCurso } from "./cursos-new-curso";

type CursosFilters = z.infer<typeof inputGetCursos>;

type ActionButtonsProps = {
  filters: CursosFilters;
};

export const ActionButtons = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-2 md:flex-row-reverse  md:space-x-1.5">
      <div className="relative flex w-full flex-row justify-end space-x-2 sm:basis-1/2 md:w-auto md:basis-1/3">
        <CursosNuevoCurso />
      </div>

      <div className="flex w-full flex-row space-x-3 md:basis-1/2">
        <div className="md:basis-1/2">
          <CursosFilterText filters={filters} />
        </div>
        <div className="md:basis-1/2">
          <CursosFilterMateria filters={filters} />
        </div>
      </div>
    </div>
  );
};
