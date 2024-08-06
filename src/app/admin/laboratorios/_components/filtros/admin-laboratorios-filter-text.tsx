"use client";

import { Input } from "@/components/ui";
import { SearchIcon } from "lucide-react";
import { useAdminLaboratoriosQueryParam } from "../../_hooks/use-admin-laboratorios-query-param";
import { type z } from "zod";
import { useState } from "react";
import { type inputGetLaboratorios } from "@/shared/filters/admin-laboratorios-filter.schema";

type AdminLaboratoriosFilters = z.infer<typeof inputGetLaboratorios>;

type Props = {
  filters: AdminLaboratoriosFilters;
};

export const AdminLaboratoriosFilterText = ({ filters }: Props) => {
  const { searchText, onSearchTextChange } = useAdminLaboratoriosQueryParam(filters);

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
        placeholder={"Buscar por nombre"}
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
