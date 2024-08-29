import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, Select, SelectTrigger, SelectValue, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputEditBooks } from "@/shared/filters/biblioteca-filter.schema";
import { type z } from "zod";
import { type ReactElement, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSelectFormField } from "@/components/ui/multi-select";
import { cn } from "@/components/utils";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormEditarLibroType = z.infer<typeof inputEditBooks>;

export const LibroForm = ({ id, onSubmit, onCancel }: Props) => {
  const esNuevo = id === undefined;
  const libroId = parseInt(id ?? "");

  const { data: libro, isLoading, isError } = api.biblioteca.libroPorId.useQuery({ libroId }, { enabled: !!id });

  const editarLibro = api.biblioteca.editarLibro.useMutation(); // Se llama si existe libroId
  const agregarlibro = api.biblioteca.nuevoLibro.useMutation(); // Se llama si no existe libroId

  const libroBase: Partial<FormEditarLibroType> = useMemo(() => {
    if (!libro) return {};
    return {
      titulo: libro.titulo,
      isbn: libro.isbn,
      bibliotecaId: libro.bibliotecaId,
      inventarioId: libro.inventarioId,
      editorialId: libro.editorialId,
      idiomaId: libro.idiomaId,
      laboratorioId: libro.laboratorioId,
      armarioId: libro.armarioId,
      estanteId: libro.estanteId,
      sedeId: libro.sedeId,
      autorId: libro.autorId,
      anio: libro.anio,
      materias: libro.materias.map((materia) => String(materia.materia.id)),
    };
  }, [libro]);

  const formHook = useForm<FormEditarLibroType>({
    mode: "onChange",
    defaultValues: libroBase,
    resolver: zodResolver(inputEditBooks),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => formHook.reset(libroBase), [formHook, libroBase]);

  if (!esNuevo && isNaN(libroId)) {
    return <div>Error al cargar...</div>;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const onFormSubmit = (formData: FormEditarLibroType) => {
    if (esNuevo) {
      agregarlibro.mutate(formData, {
        onSuccess: () => {
          toast.success("Libro agregado con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al agregar el libro");
        },
      });
      return;
    }

    editarLibro.mutate(formData, {
      onSuccess: () => {
        toast.success("Libro actualizado con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar el libro");
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
                <FormInput label={"Titulo"} control={control} name="titulo" type={"text"} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/2">
                <FormInput
                  label={"Inventario ID"}
                  control={control}
                  name="inventarioId"
                  type={"text"}
                  className="mt-2"
                />
              </div>

              <div className="mt-4 basis-1/2">
                <FormInput
                  label={"Biblioteca ID"}
                  control={control}
                  name="bibliotecaId"
                  type={"text"}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/2">
                <FormInput label={"ISBN"} control={control} name="isbn" type={"text"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/2">
                <FormInput label={"Año"} control={control} name="anio" type={"number"} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/4">
                <FormInput label={"Sede"} control={control} name="sedeId" type={"number"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/4">
                <FormInput
                  label={"Laboratorio"}
                  control={control}
                  name="laboratorioId"
                  type={"number"}
                  className="mt-2"
                />
              </div>

              <div className="mt-4 basis-1/4">
                <FormInput label={"Armario"} control={control} name="armarioId" type={"number"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/4">
                <FormInput label={"Estante"} control={control} name="estanteId" type={"number"} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/2">
                <FormInput label={"Editorial"} control={control} name="editorialId" type={"number"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/2">
                <FormInput
                  label={"Idioma"}
                  id="idioma"
                  control={control}
                  name="idiomaId"
                  type={"number"}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 w-full">
                <MateriaDropdownMultiple />
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

const MateriaDropdownMultiple = (props: { className?: string }): ReactElement => {
  const { control } = useFormContext<FormEditarLibroType>();

  const { data, isLoading, isError } = api.materia.getAll.useQuery();

  const materias = useMemo(() => {
    if (!data) return [];

    return data.map((materia) => {
      const { id, nombre } = materia;

      return {
        label: nombre,
        value: String(id),
      };
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-row items-center space-x-2">
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
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
    );
  }

  return (
    <Controller
      name="materias"
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            <MultiSelectFormField
              className={props.className}
              options={materias}
              disabled={isLoading}
              defaultValue={field.value || []}
              onValueChange={field.onChange}
              placeholder="All"
              variant="secondary"
            />
            {error?.message && <span className={cn("ml-1 mt-2 block text-xs text-danger")}>{error.message}</span>}
          </>
        );
      }}
    ></Controller>
  );
};
