"use client";

import { Input } from "@/components/ui";
import { SearchIcon } from "lucide-react";
import { useEquiposQueryParam } from "../../_hooks/use-equipos-query-param";
import { type z } from "zod";
import { useState } from "react";
import { type inputGetEquipos } from "@/shared/filters/equipos-filter.schema";

type EquiposFilters = z.infer<typeof inputGetEquipos>;

type Props = {
  filters: EquiposFilters;
};

export const EquiposFilterText = ({ filters }: Props) => {
  const { searchText, onSearchTextChange } = useEquiposQueryParam(filters);

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
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <Input
        placeholder={"Texto a buscar"}
        name="searchText"
        unit={<SearchIcon className="relative top-0.5 h-4 w-4 text-sub" />}
        type={"search"}
        value={currentSearchText}
        onChange={handleTextChange}
        onKeyUp={handleKeyUp}
        autoFocus
      />
    </form>
  );
};
