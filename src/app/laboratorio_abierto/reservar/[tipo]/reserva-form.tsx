import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, Input, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect } from "react";
import { inputReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { FormTextarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MinusIcon } from "lucide-react";
import { EquipoTipoSelector } from "@/app/laboratorios/mis_cursos/_components/filtros/equipo-tipo-selector";

type Props = {
  cursoId: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormReservarLaboratorioType = z.infer<typeof inputReservaLaboratorioCerrado>;

export const LaboratorioAbiertoForm = ({ cursoId, onSubmit, onCancel }: Props) => {
  const {
    data: curso,
    isLoading,
    isError,
  } = api.cursos.cursoPorId.useQuery({ id: Number(cursoId) }, { enabled: !!cursoId });

  const { data: todosLosEquiposTipo } = api.equipos.getAllTipos.useQuery();

  const editarCurso = api.cursos.editarCurso.useMutation();

  const formHook = useForm<FormReservarLaboratorioType>({
    mode: "onChange",
    defaultValues: {
      cursoId: Number(cursoId),
      aceptoTerminos: false,
      equipoRequerido: [],
      fechaReserva: undefined,
      requierePc: false,
      requiereProyecto: false,
    },
    resolver: zodResolver(inputReservaLaboratorioCerrado),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => {
    formHook.reset({
      cursoId: Number(cursoId),
      aceptoTerminos: false,
      equipoRequerido: [],
      fechaReserva: undefined,
      requierePc: false,
      requiereProyecto: false,
    });
  }, [formHook, cursoId]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const onFormSubmit = (formData: FormReservarLaboratorioType) => {
    editarCurso.mutate(formData, {
      onSuccess: () => {
        toast.success("Reserva creada con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al crear la reserva");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  const onEquipoTipoChange = (equipoTipoId: string) => {
    const equipos = formHook.getValues("equipoRequerido");

    const existeEquipo = equipos.find((equipo) => equipo.idTipo === equipoTipoId);

    if (existeEquipo) {
      return;
    } else {
      formHook.setValue("equipoRequerido", [...equipos, { idTipo: equipoTipoId, cantidad: 1 }]);
      return;
    }
  };

  const onEquipoTipoDelete = (equipoTipoId: string) => {
    const equipos = formHook.getValues("equipoRequerido");

    formHook.setValue(
      "equipoRequerido",
      equipos.filter((equipo) => equipo.idTipo !== equipoTipoId),
    );
  };

  const currentEquipoTipo = formHook.watch("equipoRequerido");

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex flex-col space-y-4 px-0 md:px-6">
            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 w-full">
                <Input
                  label={"Materia"}
                  name="materia"
                  type={"text"}
                  className="mt-2"
                  value={curso?.materia.nombre ?? ""}
                  readOnly
                />
              </div>
              <div className="mt-4 w-full">
                <Input
                  label={"División"}
                  name="division"
                  type={"text"}
                  className="mt-2"
                  value={curso?.division.nombre ?? ""}
                  readOnly
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 w-full">
                <Input
                  label={"Turno"}
                  name="turno"
                  type={"text"}
                  className="mt-2"
                  value={curso?.turno ?? ""}
                  readOnly
                />
              </div>
              <div className="mt-4 w-full">
                <Input
                  label={"Sede"}
                  name="sede"
                  type={"text"}
                  className="mt-2"
                  value={curso?.sede.nombre ?? ""}
                  readOnly
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 w-full">
                <Input
                  label={"Profesor"}
                  name="profesor"
                  type={"text"}
                  className="mt-2"
                  value={curso?.profesores.map((profesor) => profesor.usuario.apellido).join(", ") ?? ""}
                  readOnly
                />
              </div>
              <div className="mt-4 w-full">
                <Input
                  label={"Ayudante/s"}
                  name="ayudante"
                  type={"text"}
                  className="mt-2"
                  value={curso?.ayudantes.map((ayudante) => ayudante.usuario.apellido).join(", ") ?? ""}
                  readOnly
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/3">
                {/* TODO: Habilitar fecha de reserva a los días de curso */}
                <FormInput
                  label={"Fecha de reserva"}
                  control={control}
                  name="fechaReserva"
                  className="mt-2"
                  type={"date"}
                  required
                />
              </div>
            </div>

            <div className="flex w-full flex-col justify-end gap-y-4 lg:justify-between">
              <div className="items-top flex space-x-2">
                <Checkbox id="requierePc" name="requierePc" />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="requierePc">Requiere PCs para los alumnos</label>
                </div>
              </div>

              <div className="items-top flex space-x-2">
                <Checkbox id="requiereProyector" name="requiereProyector" />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="requiereProyector">Requiere proyector</label>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col justify-end gap-y-4 lg:justify-between">
              <div className="items-top flex space-x-2">
                <Checkbox id="equipoRequerido" name="equipoRequerido" />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="equipoRequerido">Requiere instumental</label>
                </div>
              </div>

              {/* TODO: Habilitar seccion solo si requiere instrumental = true */}
              <div className="mt-4 w-full">
                <EquipoTipoSelector onEquipoTipoChange={onEquipoTipoChange} />
              </div>

              <div className="mt-4 w-full">
                <ScrollArea className="max-h-80 w-full">
                  <div className="flex w-full flex-col">
                    {currentEquipoTipo?.map((equipoTipo) => (
                      <div key={equipoTipo.idTipo} className="flex w-full flex-row gap-x-4 pl-4">
                        <Input
                          readOnly
                          value={
                            todosLosEquiposTipo?.find((equipo) => String(equipo.id) === equipoTipo.idTipo)?.nombre ?? ""
                          }
                          className="mt-2 grow basis-2/3"
                        />
                        <Input readOnly value={equipoTipo.cantidad} type="number" className="mt-2 grow basis-1/3" />
                        <Button
                          type="button"
                          variant={"icon"}
                          icon={MinusIcon}
                          size="sm"
                          className="mt-2 rounded-md border-none"
                          onClick={() => onEquipoTipoDelete(equipoTipo.idTipo)}
                          title={`Eliminar ${equipoTipo.idTipo} equipo`}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 w-full">
                <FormTextarea label={"Observaciones"} control={control} name="observaciones" className="mt-2 w-full" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4">
                <div className="items-top flex space-x-2">
                  <Checkbox id="aceptoTerminos" name="aceptoTerminos" className="mt-2" />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <b> Declaro conocer las nuevas políticas de uso de laboratorio</b>
                    </label>
                    <p className="text-sm text-muted-foreground">
                      La política de uso de laboratorio ha cambiado, TODO: LINK
                    </p>
                  </div>
                </div>
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
