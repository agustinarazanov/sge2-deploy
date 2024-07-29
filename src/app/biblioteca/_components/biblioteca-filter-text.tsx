"use client";

import { Input } from "@/components/ui";
import { SearchIcon } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import { useEffect, useState } from "react";
import { useBibliotecaQueryParam } from "../_hooks/use-biblioteca-query-param";
import { type inputGetBooks } from "@/shared/biblioteca-filter.schema";
import { type z } from "zod";

const DEBOUNCE_TIME = 300;

type BibliotecaFilters = z.infer<typeof inputGetBooks>;

type Props = {
  filters: BibliotecaFilters;
};

export const BibliotecaFilterText = ({ filters }: Props) => {
  const { searchText, onSearchTextChange } = useBibliotecaQueryParam(filters);

  // Estado actual del campo de búsqueda
  const [currentSearchText, setCurrentSearchText] = useState(searchText);

  // Debounce para evitar que se envíe cada vez que se escribe
  const handleFormSubmit = useDebounceCallback(async () => onSearchTextChange(currentSearchText), DEBOUNCE_TIME);

  useEffect(() => {
    void handleFormSubmit();

    return () => handleFormSubmit.cancel();
  }, [handleFormSubmit, currentSearchText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setCurrentSearchText(e.target.value);
  };

  return (
    <form onSubmit={() => handleFormSubmit.flush()} className="w-full">
      <Input
        placeholder={"Buscar por título o por autor"}
        name="searchText"
        unit={<SearchIcon className="relative top-0.5 h-4 w-4 text-sub" />}
        type={"text"}
        value={currentSearchText}
        onChange={handleTextChange}
        onKeyUp={(e) => e.key === "Escape" && onSearchTextChange("")}
        autoFocus
      />
    </form>
  );
};
