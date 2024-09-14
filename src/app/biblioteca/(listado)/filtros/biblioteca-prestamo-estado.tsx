"use client";

import { Button, Input } from "@/components/ui";
import { SearchIcon } from "lucide-react";
import { type z } from "zod";
import { useState } from "react";
import { type inputGetAllPrestamosLibros } from "@/shared/filters/reservas-filter.schema";
import { useBibliotecaPrestamosQueryParam } from "../../_hooks/use-biblioteca-prestamo-query-param";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type BibliotecaPrestamoFilters = z.infer<typeof inputGetAllPrestamosLibros>;

type Props = {
  filters: BibliotecaPrestamoFilters;
};

export const BibliotecaPrestamoEstadoFilter = ({ filters }: Props) => {
  const { searchText, onSearchTextChange } = useBibliotecaPrestamosQueryParam(filters);

  const [currentSearchText, setCurrentSearchText] = useState(searchText);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setCurrentSearchText(e.target.value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onSearchTextChange("");
    }

    if (e.key === "Enter") {
      onSearchTextChange(currentSearchText);
    }
  };

  return (
    <ToggleGroup type="single" className="flex flex-row">
      <ToggleGroupItem value="bold" aria-label="Toggle bold" className="basis-1/3 hover:bg-gray-500">
        Pendientes
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic" className="basis-1/3 hover:bg-gray-500">
        Finalizados
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline" className="basis-1/3 hover:bg-gray-500">
        Ambos
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
