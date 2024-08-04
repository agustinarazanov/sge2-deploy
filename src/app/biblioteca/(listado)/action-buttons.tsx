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
    <div className="relative flex w-full flex-col items-center justify-between space-y-2 md:flex-row-reverse  md:space-x-1.5">
      <div className="relative flex w-full flex-row justify-end space-x-2 sm:basis-1/2 md:w-auto md:basis-1/3">
        <BibliotecaNewLibro />
        <Link href="/biblioteca/prestamos" passHref>
          <Button color={"ghost"}>Ir a prestamos</Button>
        </Link>
      </div>

      <div className="flex w-full flex-row space-x-3 md:basis-1/2">
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
