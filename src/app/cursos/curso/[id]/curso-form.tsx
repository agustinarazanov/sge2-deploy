import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { inputEditarCurso } from "@/shared/filters/cursos-filter.schema";
import { FormSelect } from "@/components/ui/autocomplete";
import { turnosValues } from "@/app/_components/turno-text";
import { SelectMateriasForm } from "@/app/cursos/_components/select-materia";
import { SelectDivisionesForm } from "../../_components/select-division";
import { SelectSedeForm } from "@/app/_components/select-ubicacion/select-sede";
import { DiaAdicionalForm } from "../../_components/cursos-dias-handler";
import {
  getUserLabelNameForSelect,
  SelectMultipleUsuarioForm,
  SelectUsuarioForm,
} from "@/app/_components/select-usuario";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormHelperType = {
  profesorUser: { id: string; label: string };
};

export type FormEditarCursoType = z.infer<typeof inputEditarCurso> & FormHelperType;

const dias = [
  { id: "LUNES", label: "Lunes" },
  { id: "MARTES", label: "Martes" },
  { id: "MIERCOLES", label: "Miércoles" },
  { id: "JUEVES", label: "Jueves" },
  { id: "VIERNES", label: "Viernes" },
  { id: "SABADO", label: "Sábado" },
];

const aniosDeCarrera = [
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4" },
  { id: "5", label: "5" },
];

const horas = ["0", "1", "2", "3", "4", "5", "6"].map((item) => ({
  id: item,
  label: item,
}));

const duracion = ["1", "2", "3", "4", "5", "6"].map((item) => ({
  id: item,
  label: item,
}));

const ac = [
  { id: "ANUAL", label: "Anual" },
  { id: "CUATRIMESTRAL", label: "Cuatrimestral" },
];

export const CursoForm = ({ id, onSubmit, onCancel }: Props) => {
  const [mostrarDia2, setMostrarDia2] = useState(false);

  const handleAddDia2 = () => {
    setMostrarDia2(true);
  };

  const handleRemoveDia2 = () => {
    formHook.setValue("dia2", undefined);
    formHook.setValue("horaInicio2", "");
    formHook.setValue("duracion2", "");
    setMostrarDia2(false);
  };

  const cursoId = parseInt(id ?? "");
  const { data: curso, isLoading, isError } = api.cursos.cursoPorId.useQuery({ id: cursoId }, { enabled: !!id });

  const editarCurso = api.cursos.editarCurso.useMutation(); // Se llama si existe cursoId
  const agregarCurso = api.cursos.nuevoCurso.useMutation(); // Se llama si no existe cursoId

  const cursoBase = useMemo((): FormEditarCursoType => {
    if (!curso) return {} as FormEditarCursoType;
    return {
      id: curso.id,
      horaInicio1: curso.horaInicio1,
      duracion1: curso.duracion1,
      horaInicio2: curso.horaInicio2 ?? "",
      duracion2: curso.duracion2 ?? "",
      dia1: curso.dia1,
      dia2: curso.dia2 ?? undefined,
      profesorUser: {
        id: curso.profesorId ?? "",
        label: curso.profesor ? getUserLabelNameForSelect(curso.profesor) : "",
      },
      profesorUserId: curso.profesorId,
      ayudanteUsersIds: curso.ayudantes?.map((a) => a.usuario.id) ?? [],
      anioDeCarrera: curso.anioDeCarrera ? String(curso.anioDeCarrera) : "",
      activo: curso.activo,
      ac: curso.ac,
      sedeId: curso.sedeId?.toString(),
      materiaId: curso.materiaId.toString(),
      divisionId: curso.division?.id.toString(),
      turno: curso.turno,
    };
  }, [curso]);

  const formHook = useForm<FormEditarCursoType>({
    mode: "onChange",
    defaultValues: cursoBase,
    resolver: zodResolver(inputEditarCurso),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => {
    if (curso?.dia2) {
      setMostrarDia2(true);
    }
  }, [curso]);

  console.log(formHook.formState.errors);

  useEffect(() => formHook.reset(cursoBase), [formHook, curso, cursoBase]);

  const [profesorUser] = formHook.watch(["profesorUser"]);
  useEffect(() => formHook.setValue("profesorUserId", profesorUser?.id), [formHook, profesorUser]);

  const esNuevo = id === undefined;

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
    formData.anioDeCarrera = String(formData.anioDeCarrera);

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
        <ScrollArea className="max-h-[calc(100vh_-_22%)] w-full pr-4 md:max-h-[calc(100vh_-_30%)] lg:max-h-[calc(100vh_-_45%)]">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex w-full flex-col space-y-4 px-0 md:px-6">
              <div className="flex w-full flex-col gap-x-4 md:flex-row lg:flex-row">
                <div className="basis-1/2">
                  <SelectMateriasForm
                    label={"Materia"}
                    control={control}
                    name="materiaId"
                    placeholder={"Seleccione una materia"}
                  />
                </div>
                <div className="basis-1/2">
                  <SelectSedeForm label={"Sede"} control={control} name="sedeId" placeholder={"Seleccione una sede"} />
                </div>
              </div>

              <div className="flex w-full flex-col gap-x-4 md:flex-row lg:flex-row">
                <div className="mt-4 w-full">
                  <FormSelect label={"Duración"} control={control} name="ac" className="mt-2" items={ac} />
                </div>

                <div className="mt-4 w-full">
                  <FormSelect label={"Turno"} control={control} name="turno" className="mt-2" items={turnosValues} />
                </div>

                <div className="mt-4 w-full">
                  <FormSelect
                    label={"Año"}
                    control={control}
                    name="anioDeCarrera"
                    className="mt-2"
                    items={aniosDeCarrera}
                  />
                </div>
                <div className="mt-4 w-full">
                  <SelectDivisionesForm
                    label={"División"}
                    control={control}
                    name="divisionId"
                    placeholder={"Seleccione una división"}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 basis-1/3">
                  <FormSelect label={"Día 1"} control={control} name="dia1" className="mt-2" items={dias} />
                </div>

                <div className="mt-4 basis-1/3">
                  <FormSelect
                    label={"Hora inicio 1"}
                    control={control}
                    name="horaInicio1"
                    className="mt-2"
                    items={horas}
                  />
                </div>

                <div className="mt-4 basis-1/3">
                  <FormSelect
                    label={"Duración 1"}
                    control={control}
                    name="duracion1"
                    items={duracion}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                {mostrarDia2 ? (
                  <DiaAdicionalForm
                    control={control}
                    dias={dias}
                    horas={horas}
                    duracion={duracion}
                    onRemove={handleRemoveDia2}
                  />
                ) : (
                  <button type="button" className="mt-4 text-blue-600" onClick={handleAddDia2}>
                    + Agregar Día 2
                  </button>
                )}
              </div>

              <div className="flex w-full flex-col gap-x-4 md:flex-row lg:flex-row lg:justify-between">
                <div className="mt-4 basis-1/2">
                  <SelectUsuarioForm
                    label={"Profesor"}
                    control={control}
                    name="profesorUser"
                    realNameId="profesorUserId"
                    className="mt-2 bg-white text-gray-900"
                  />
                </div>

                <div className="mb-3 mt-4 basis-1/2 md:mb-0 lg:mb-0">
                  <label htmlFor="jefesTrabajoPracticoUserId">
                    Ayudantes:
                    <SelectMultipleUsuarioForm label={"Ayudantes"} control={control} name="ayudanteUsersIds" />
                  </label>
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
