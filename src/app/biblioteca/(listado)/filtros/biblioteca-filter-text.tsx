"use client";

import { Input } from "@/components/ui";
import { SearchIcon } from "lucide-react";
import { useBibliotecaQueryParam } from "../../_hooks/use-biblioteca-query-param";
import { type inputGetBooks } from "@/shared/biblioteca-filter.schema";
import { type z } from "zod";
import { useState } from "react";

type BibliotecaFilters = z.infer<typeof inputGetBooks>;

type Props = {
  filters: BibliotecaFilters;
};

export const BibliotecaFilterText = ({ filters }: Props) => {
  const { searchText, onSearchTextChange } = useBibliotecaQueryParam(filters);

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
        placeholder={"Buscar por título o por autor"}
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
