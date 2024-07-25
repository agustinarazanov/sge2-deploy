"use client";

import React, { useCallback, useMemo } from "react";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { XIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const getMateriaId = (searchParamMateria: string | null | undefined) => {
  if (!searchParamMateria) return "";

  const materiaId = parseInt(searchParamMateria, 10);
  return isNaN(materiaId) || materiaId < 1 ? "" : String(materiaId);
};

export const BibliotecaFilterMateria = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const materia = useMemo(() => getMateriaId(searchParams.get("materia")), [searchParams]);

  const { data: materias, isLoading, isError } = api.materia.getAll.useQuery();

  const handleFormSubmit = useCallback(
    (newMateriaId: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("materia", newMateriaId);

      router.push(`${pathname}?${newParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

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
      <Select onValueChange={(value) => handleFormSubmit(value)} value={materia}>
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
            variant="icon"
            color="outline"
            icon={XIcon}
            type="button"
            size="md"
            onClick={(e) => {
              e.preventDefault();
              handleFormSubmit("");
            }}
          />
        </div>
      </Select>
    </div>
  );
};
