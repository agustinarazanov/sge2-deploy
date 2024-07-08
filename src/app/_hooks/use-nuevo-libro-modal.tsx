"use client";

import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { useCommonModal } from "./use-common-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { FormInput, toast } from "@/components/ui";
import { inputAddBooks } from "@/shared/biblioteca-filter.schema";

import { api } from "@/trpc/react";

type NuevoLibroModalProps = {
  onCancel?: () => void;
  onSubmit?: () => void;
};

export default function useNuevoLibroModal({ onCancel, onSubmit }: NuevoLibroModalProps) {
  const handleCancel = () => {
    onCancel?.();
    confirmCheckoutModal.close();
  };

  const handleSubmit = () => {
    onSubmit?.();
    confirmCheckoutModal.close();
  };

  const confirmCheckoutModal = useCommonModal({
    size: "lg",
    title: "Agregar libro a la biblioteca",
    children: <NuevoLibroModal onCancel={handleCancel} onSubmit={handleSubmit} />,
  });

  return {
    ...confirmCheckoutModal,
    open: () => {
      confirmCheckoutModal.open();
    },
  };
}

export type FormNuevoLibroType = z.infer<typeof inputAddBooks>;

const NuevoLibroModal = ({ onSubmit, onCancel }: NuevoLibroModalProps) => {
  const agregarlibro = api.biblioteca.nuevoLibro.useMutation({
    onSuccess: () => {
      toast.success("Libro agregado con éxito!");

      onSubmit?.();
    },

    onError: (error) => {
      toast.error(error?.message ?? "Error al agregar el libro");
    },
  });

  const formHook = useForm<FormNuevoLibroType>({
    mode: "onChange",
    defaultValues: {
      anio: new Date().getFullYear().toString(),
      autor: "",
      editorial: "",
      idioma: "",
      inventario: "",
      isbn: "",
      titulo: "",
    },
    resolver: zodResolver(inputAddBooks),
  });

  const { handleSubmit, control } = formHook;

  const handleFormSubmit = async () => {
    const values = formHook.getValues();

    agregarlibro.mutate(values);
  };

  return (
    <>
      <FormProvider {...formHook}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="flex flex-col space-y-4 px-0 md:px-6">
            <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
              <div className="mt-4 w-full">
                <FormInput label={"Titulo"} control={control} name="titulo" type={"text"} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
              <div className="mt-4 basis-1/3">
                <FormInput label={"Inventario"} control={control} name="inventario" type={"text"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput label={"Año"} control={control} name="anio" type={"text"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput label={"Autor"} control={control} name="autor" type={"text"} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
              <div className="mt-4 basis-1/3">
                <FormInput label={"Editorial"} control={control} name="editorial" type={"text"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput
                  label={"Idioma"}
                  id="idioma"
                  control={control}
                  name="idioma"
                  type={"text"}
                  className="mt-2"
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput label={"ISBN"} control={control} name="isbn" type={"text"} className="mt-2" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button className="px-12" color={"secondary"} onClick={() => onCancel?.()}>
              Cerrar
            </Button>
            <Button type="submit" className="px-12" color={"primary"} disabled={agregarlibro.isPending}>
              Agregar
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
