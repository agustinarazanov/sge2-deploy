import { FormProvider, useForm } from "react-hook-form";
import { type RouterOutputs, api } from "@/trpc/react";
import { Button, FormInput, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect, useState } from "react";
import { inputEditarRol } from "@/shared/filters/admin-roles-filter.schema";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { PermisosSelector } from "../_components/filtros/permisos-selector";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type PermisoType = RouterOutputs["admin"]["roles"]["getAllPermisos"][number];
type FormEditarRolType = z.infer<typeof inputEditarRol>;

export const AdminRolForm = ({ id, onSubmit, onCancel }: Props) => {
  const esNuevo = id === undefined;
  const rolId = parseInt(id ?? "");

  const [permisosDictionario, setPermisosDictionario] = useState<Record<string, PermisoType>>({});

  const { data: todosLosPermisos } = api.admin.roles.getAllPermisos.useQuery();
  const { data: rol, isLoading, isError } = api.admin.roles.getRolById.useQuery({ id: rolId }, { enabled: !!id });

  const editarRol = api.admin.roles.editarRol.useMutation(); // Se llama si existe rolId
  const agregarRol = api.admin.roles.nuevoRol.useMutation(); // Se llama si no existe rolId

  const formHook = useForm<FormEditarRolType>({
    mode: "onChange",
    defaultValues: {
      id: rol?.id ?? undefined,
      nombre: rol?.nombre ?? "",
      permisos: rol?.rolPermiso.map((permiso) => String(permiso.permisoId)) ?? [],
    },
    resolver: zodResolver(inputEditarRol),
  });

  const { handleSubmit, control, setValue, getValues, watch } = formHook;

  const currentPermisos = watch("permisos");

  // TODO: Separar componente de formulario y logica de carga y actualización de rol
  useEffect(() => {
    if (rol) {
      formHook.reset({
        id: rol.id,
        nombre: rol.nombre,
        permisos: rol.rolPermiso.map((permiso) => String(permiso.permisoId)),
      });
    }
  }, [formHook, rol]);

  useEffect(() => {
    if (todosLosPermisos) {
      const newPermisos: Record<string, PermisoType> = {};

      todosLosPermisos.forEach((permiso) => {
        newPermisos[String(permiso.id)] = permiso;
      });

      setPermisosDictionario(newPermisos);
    }
  }, [todosLosPermisos]);

  if (!esNuevo && isNaN(rolId)) {
    return <div>Error al cargar...</div>;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const onFormSubmit = (formData: FormEditarRolType) => {
    if (esNuevo) {
      agregarRol.mutate(formData, {
        onSuccess: () => {
          toast.success("Rol agregado con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al agregar el rol");
        },
      });
      return;
    }

    editarRol.mutate(formData, {
      onSuccess: () => {
        toast.success("Rol actualizado con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar el rol");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  const onPermissionChange = (permiso: string) => {
    const permisos = getValues("permisos");

    if (permisos.includes(permiso)) {
      return;
    } else {
      setValue("permisos", [...permisos, permiso]);
      return;
    }
  };

  const onRolPermisoDelete = (id: string) => {
    const permisos = getValues("permisos");

    setValue(
      "permisos",
      permisos.filter((permiso) => permiso !== id),
    );
  };

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex w-full flex-col space-y-4 px-0 md:px-6">
            <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
              <div className="mt-4 w-full">
                <FormInput
                  label={"Título"}
                  control={control}
                  name="nombre"
                  type={"text"}
                  className="mt-2"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="flex w-full flex-col lg:justify-between">
              <div className="mt-4 w-full">
                {/* TODO: Pasar permisos actuales para que elimine de la lista*/}
                <PermisosSelector onPermisoChange={onPermissionChange} label={"Permisos"} />
              </div>

              <ScrollArea className="mt-4 max-h-80 w-full pr-4">
                <div className="grid w-full grid-cols-2 gap-2">
                  {currentPermisos.map((permiso) => (
                    <Badge
                      key={permiso}
                      label={permisosDictionario[permiso]?.nombre ?? "Error"}
                      variant={"default"}
                      color={"aqua"}
                      className="cursor-pointer justify-between text-sm"
                      onClick={() => onRolPermisoDelete(permiso)}
                      title={`Eliminar ${permisosDictionario[permiso]?.nombre ?? ""} rol`}
                    >
                      <Button
                        title="Eliminar"
                        type="button"
                        variant={"icon"}
                        icon={XIcon}
                        size="sm"
                        color={"ghost"}
                        className="rounded-full border-none hover:bg-[transparent]"
                      />
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
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
