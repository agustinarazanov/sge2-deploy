"use client";

import { Input } from "@/components/ui";
import { SearchIcon } from "lucide-react";
import { type z } from "zod";
import { useState } from "react";
import { useEquiposPrestamosQueryParam } from "../../_hooks/use-equipos-prestamo-query-param";
import { type inputGetAllPrestamosEquipos } from "@/shared/filters/reservas-equipos-filter.schema";

type EquiposPrestamoFilters = z.infer<typeof inputGetAllPrestamosEquipos>;

type Props = {
  filters: EquiposPrestamoFilters;
};

export const EquiposPrestamoFilterText = ({ filters }: Props) => {
  const { searchText, onSearchTextChange } = useEquiposPrestamosQueryParam(filters);

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

  const onClickIcon = () => {
    onSearchTextChange(currentSearchText);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <Input
        placeholder={"Buscar por tipo o inventario"}
        name="searchText"
        unit={<SearchIcon className="relative top-0.5 h-4 w-4 text-sub" onClick={onClickIcon} />}
        type={"search"}
        value={currentSearchText}
        onChange={handleTextChange}
        onKeyUp={handleKeyUp}
        autoFocus
      />
    </form>
  );
};
