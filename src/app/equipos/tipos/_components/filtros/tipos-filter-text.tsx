"use client";

import { Input } from "@/components/ui";
import { SearchIcon } from "lucide-react";
import { useTiposQueryParam } from "../../_hooks/use-tipos-query-param";
import { type z } from "zod";
import { useState } from "react";
import { type inputGetTipos } from "@/shared/filters/equipos-tipos-filter.schema";

type TiposFilters = z.infer<typeof inputGetTipos>;

type Props = {
  filters: TiposFilters;
};

export const TiposFilterText = ({ filters }: Props) => {
  const { searchText, onSearchTextChange } = useTiposQueryParam(filters);

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
        placeholder={"Buscar por tipo"}
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
