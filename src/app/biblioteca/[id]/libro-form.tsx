"use client";

import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui";

export const LibroForm = ({ id }: { id?: string }) => {
  const libroId = parseInt(id ?? "");

  const { data: libro, isLoading, isError } = api.biblioteca.libroPorId.useQuery({ libroId }, { enabled: !!id });

  const form = useForm({
    defaultValues: {},
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  return (
    <FormProvider {...form}>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full flex-col gap-4">
          <Input label={"Titulo"} name="titulo" type={"text"} className="mt-2" value={libro?.titulo ?? ""} readOnly />
          <div className="flex flex-col gap-4">
            <Input
              label={"Autor"}
              name="autor"
              type={"text"}
              className="mt-2"
              value={libro?.autor?.autorNombre ?? ""}
              readOnly
            />
            <Input
              label={"Editorial"}
              name="editorial"
              type={"text"}
              className="mt-2"
              value={libro?.editorial?.editorial ?? ""}
              readOnly
            />
            <Input
              label={"Idioma"}
              name="idioma"
              type={"text"}
              className="mt-2"
              value={libro?.idioma?.idioma ?? ""}
              readOnly
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
