import { type z } from "zod";
import { BibliotecaFilterMateria } from "./filtros/biblioteca-filter-materia";
import { BibliotecaFilterText } from "./filtros/biblioteca-filter-text";
import { BibliotecaNewLibro } from "./biblioteca-new-book";
import { type inputGetBooks } from "@/shared/filters/biblioteca-filter.schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type BibliotecaFilters = z.infer<typeof inputGetBooks>;

type ActionButtonsProps = {
  filters: BibliotecaFilters;
};

export const ActionButtons = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 md:flex-row-reverse md:space-x-1.5 md:space-y-0">
      <div className="relative flex w-full flex-col justify-end space-y-3 sm:basis-1/2 sm:flex-row sm:space-x-2 sm:space-y-0 md:w-auto md:basis-1/3 md:space-y-0">
        <BibliotecaNewLibro />
        <Button color={"ghost"}>
          <Link href="/biblioteca/prestamos" passHref>
            Ir a préstamos
          </Link>
        </Button>
      </div>

      <div className="w-full space-y-3 sm:flex sm:flex-row sm:space-x-3 sm:space-y-0 md:basis-1/2">
        <div className="md:basis-1/2">
          <BibliotecaFilterText filters={filters} />
        </div>
        <div className="md:basis-1/2">
          <BibliotecaFilterMateria filters={filters} />
        </div>
      </div>
    </div>
  );
};
