import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect } from "react";
import { inputEditarCurso } from "@/shared/cursos-filter.schema";
import { FormSelect } from "@/components/ui/autocomplete";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormEditarCursoType = z.infer<typeof inputEditarCurso>;

export const CursoForm = ({ id, onSubmit, onCancel }: Props) => {
  const esNuevo = id === undefined;
  const cursoId = parseInt(id ?? "");

  const { data: curso, isLoading, isError } = api.cursos.cursoPorId.useQuery({ id: cursoId }, { enabled: !!id });

  const editarCurso = api.cursos.editarCurso.useMutation(); // Se llama si existe cursoId
  const agregarCurso = api.cursos.nuevoCurso.useMutation(); // Se llama si no existe cursoId

  const formHook = useForm<FormEditarCursoType>({
    mode: "onChange",
    defaultValues: {
      id: curso?.id ?? undefined,
      horaInicio1: "",
      duracion1: "",
      horaInicio2: "",
      duracion2: "",
      dia1: undefined,
      dia2: undefined,
      profesorUserId: "",
      ayudanteUserId: "",
      anioDeCarrera: undefined,
      activo: true,
      ac: "",
      sedeId: undefined,
      materiaId: undefined,
      divisionId: undefined,
      turnoId: undefined,
    },
    resolver: zodResolver(inputEditarCurso),
  });

  const { handleSubmit, control } = formHook;

  // TODO: Separar componente de formulario y logica de carga y actualización de curso
  useEffect(() => {
    if (curso) {
      formHook.reset({
        id: curso.id,
        horaInicio1: "",
        duracion1: "",
        horaInicio2: "",
        duracion2: "",
        dia1: undefined,
        dia2: undefined,
        profesorUserId: "",
        ayudanteUserId: "",
        anioDeCarrera: undefined,
        activo: true,
        ac: "",
        sedeId: undefined,
        materiaId: undefined,
        divisionId: undefined,
        turnoId: undefined,
      });
    }
  }, [formHook, curso]);

  if (!esNuevo && isNaN(cursoId)) {
    return <div>Error al cargar...</div>;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const onFormSubmit = (formData: FormEditarCursoType) => {
    if (esNuevo) {
      agregarCurso.mutate(formData, {
        onSuccess: () => {
          toast.success("Curso agregado con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al agregar el curso");
        },
      });
      return;
    }

    editarCurso.mutate(formData, {
      onSuccess: () => {
        toast.success("Curso actualizado con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar el curso");
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
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex flex-col space-y-4 px-0 md:px-6">
            <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
              <div className="mt-4 w-full">
                <FormInput
                  label={"División"}
                  control={control}
                  name="divisionId"
                  type={"text"}
                  className="mt-2"
                  required
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/3">
                <FormSelect
                  label={"Duración"}
                  control={control}
                  name="ac"
                  className="mt-2"
                  items={[
                    { id: "A", label: "Anual" },
                    { id: "C", label: "Cuatrimestral" },
                  ]}
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormSelect
                  label={"Turno"}
                  control={control}
                  name="turnoId"
                  className="mt-2"
                  items={[
                    { id: "MANANA", label: "Mañana" },
                    { id: "TARDE", label: "Tarde" },
                    { id: "NOCHE", label: "Noche" },
                  ]}
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormSelect
                  label={"Sede"}
                  control={control}
                  name="sedeId"
                  className="mt-2"
                  items={[
                    { id: "1", label: "Medrano" },
                    { id: "2", label: "Lugano" },
                  ]}
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/3">
                <FormSelect
                  label={"Día 1"}
                  control={control}
                  name="dia1"
                  className="mt-2"
                  items={[
                    { id: "LUNES", label: "Lunes" },
                    { id: "MARTES", label: "Martes" },
                    { id: "MIERCOLES", label: "Miércoles" },
                    { id: "JUEVES", label: "Jueves" },
                    { id: "VIERNES", label: "Viernes" },
                    { id: "SABADO", label: "Sábado" },
                    { id: "DOMINGO", label: "Domingo" },
                  ]}
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput
                  label={"Hora inicio 1"}
                  control={control}
                  name="horaInicio1"
                  type={"string"}
                  className="mt-2"
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput label={"Duración 1"} control={control} name="duracion1" type={"string"} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/3">
                <FormSelect
                  label={"Día 2"}
                  control={control}
                  name="dia2"
                  className="mt-2"
                  items={[
                    { id: "LUNES", label: "Lunes" },
                    { id: "MARTES", label: "Martes" },
                    { id: "MIERCOLES", label: "Miércoles" },
                    { id: "JUEVES", label: "Jueves" },
                    { id: "VIERNES", label: "Viernes" },
                    { id: "SABADO", label: "Sábado" },
                    { id: "DOMINGO", label: "Domingo" },
                  ]}
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput
                  label={"Hora inicio 2"}
                  control={control}
                  name="horaInicio2"
                  type={"string"}
                  className="mt-2"
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput label={"Duración 2"} control={control} name="duracion2" type={"string"} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/2">
                <FormSelect
                  label={"Profesor"}
                  control={control}
                  name="profesorUserId"
                  className="mt-2"
                  items={[{ id: "1", label: "Alexander Armua" }]}
                />
              </div>

              <div className="mt-4 basis-1/2">
                <FormSelect
                  label={"Ayudante/s"}
                  control={control}
                  name="ayudanteUserId"
                  className="mt-2"
                  items={[{ id: "1", label: "Alexander Armua" }]}
                />
              </div>
            </div>
          </div>
        </div>
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
