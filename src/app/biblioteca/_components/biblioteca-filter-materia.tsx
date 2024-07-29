"use client";

import React from "react";
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { api } from "@/trpc/react";
import { XIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { type z } from "zod";
import { type inputGetBooks } from "@/shared/biblioteca-filter.schema";
import { useBibliotecaQueryParam } from "../_hooks/use-biblioteca-query-param";

type BibliotecaFilters = z.infer<typeof inputGetBooks>;

type Props = {
  filters: BibliotecaFilters;
};

export const BibliotecaFilterMateria = ({ filters }: Props) => {
  const { materia, onMateriaChange } = useBibliotecaQueryParam(filters);

  const { data: materias, isLoading, isError } = api.materia.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex flex-row items-center space-x-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full">
        <Select>
          <div className="flex flex-row items-center space-x-2">
            <SelectTrigger
              disabled
              id="selectMateria"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Error cargando materias" />
            </SelectTrigger>
          </div>
        </Select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Select onValueChange={(value) => onMateriaChange(value)} value={materia}>
        <div className="flex flex-row items-center space-x-2">
          <SelectGroup className="w-full">
            <SelectLabel className="sr-only">Selecciona una materia</SelectLabel>
            <SelectTrigger
              id="selectMateria"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Selecciona una materia" />
            </SelectTrigger>
            <SelectContent>
              {materias?.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.nombre} ({option.codigo})
                </SelectItem>
              ))}
            </SelectContent>
          </SelectGroup>
          <Button
            className="h-full"
            disabled={!materia}
            variant="icon"
            color="outline"
            icon={XIcon}
            type="button"
            size="md"
            onClick={(e) => {
              e.preventDefault();
              onMateriaChange("");
            }}
          />
        </div>
      </Select>
    </div>
  );
};
