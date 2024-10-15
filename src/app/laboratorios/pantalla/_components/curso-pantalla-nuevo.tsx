import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { type z } from "zod";
import { inputAgregarReservaPantalla } from "@/shared/filters/reserva-pantalla-filter.schema";

type Props = {
  onSubmit: () => void;
  onCancel: () => void;
};

type FormAgregarReservaPantalla = z.infer<typeof inputAgregarReservaPantalla>;

export const AgregarCursoPantallaForm = ({ onSubmit, onCancel }: Props) => {
  const agregarReservaPantalla = api.reservas.pantalla.agregarReservaPantalla.useMutation();

  const cursoBase: FormAgregarReservaPantalla = useMemo(() => {
    return {
      docente: "",
      materiaId: undefined,
      materia: "",
      laboratorio: "",
      horaInicio: "",
    };
  }, []);

  const formHook = useForm<FormAgregarReservaPantalla>({
    mode: "onChange",
    defaultValues: cursoBase,
    resolver: zodResolver(inputAgregarReservaPantalla),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => formHook.reset(cursoBase), [formHook, cursoBase]);

  const onFormSubmit = (formData: FormAgregarReservaPantalla) => {
    agregarReservaPantalla.mutate(formData, {
      onSuccess: () => {
        toast.success("Curso agregado a pantalla con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al agregar curso a la pantalla.");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <ScrollArea className="max-h-[calc(100vh_-_30%)] w-full pr-4">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex w-full flex-col space-y-4 px-0 md:px-6">
              <div className="flex w-full flex-col gap-x-4 md:flex-row">
                <div className="mt-4 w-full">
                  <FormInput label={"Docente"} control={control} name="docente" type={"text"} className="mt-2" />
                </div>
              </div>

              <div className="flex w-full flex-col gap-x-4 md:flex-row">
                <div className="mt-4 w-full">
                  <FormInput label={"Materia"} control={control} name="materia" type={"text"} className="mt-2" />
                </div>
              </div>

              <div className="flex w-full flex-col gap-x-4 md:flex-row">
                <div className="mt-4 w-full">
                  <FormInput
                    label={"Laboratorio"}
                    control={control}
                    name="laboratorio"
                    type={"text"}
                    className="mt-2"
                  />
                </div>
                <div className="mt-4 w-full">
                  <FormInput
                    label={"Hora de Inicio"}
                    control={control}
                    name="horaInicio"
                    type={"text"}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex w-full flex-row items-end justify-end space-x-4">
          <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button title="Guardar" type="submit" variant="default" color="primary">
            Guardar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
