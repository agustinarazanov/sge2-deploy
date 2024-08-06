"use client";

import { Input } from "@/components/ui";
import { SearchIcon } from "lucide-react";
import { useAdminUsuariosQueryParam } from "../../_hooks/use-admin-usuarios-query-param";
import { type z } from "zod";
import { useState } from "react";
import { type inputGetUsuarios } from "@/shared/filters/admin-usuarios-filter.schema";

type AdminUsuariosFilters = z.infer<typeof inputGetUsuarios>;

type Props = {
  filters: AdminUsuariosFilters;
};

export const AdminUsuariosFilterText = ({ filters }: Props) => {
  const { searchText, onSearchTextChange } = useAdminUsuariosQueryParam(filters);

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
