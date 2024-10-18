import { useState } from "react";
import ModalDrawer from "./modal/modal-drawer";
import { Button } from "@/components/ui";

export const PoliticasPrivacidadModal = ({ triggerText }: { triggerText: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <ModalDrawer
      titulo={"Política de asignación de Laboratorios"}
      description={
        "La presente tiene por objeto comunicar a todo el plantel docente las nuevas modificaciones realizadas en la política de asignación de reservas que se efectúa desde la Jefatura de Laboratorios de nuestro Departamento."
      }
      open={open}
      onOpenChange={setOpen}
      className={"max-h-[calc(100vh_-_10%)]"}
      trigger={
        <Button
          title="Ver políticas de asignación de Laboratorios"
          variant="default"
          color="ghost"
          size="sm"
          className="rounded-full border-none"
        >
          {triggerText}
        </Button>
      }
    >
      <div className="flex max-h-max w-full flex-col  gap-4">
        <div className="flex w-full flex-col items-center justify-center gap-12 px-4 ">
          <div className="flex w-full flex-col gap-4">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <b> Política de asignación de Laboratorios</b>
            </p>
            <p className="text-sm text-black">
              La presente tiene por objeto comunicar a todo el plantel docente las nuevas modificaciones realizadas en
              la política de asignación de reservas que se efectúa desde la Jefatura de Laboratorios de nuestro
              Departamento.
            </p>
            <div>
              <p className="text-sm font-bold text-black">
                Por este motivo, al asignar una reserva se seguirá el siguiente criterio:
              </p>
              <ol className="flex list-inside list-decimal flex-col gap-4">
                <li>
                  <p className="text-sm text-black">
                    Tendrá prioridad de asignación el pedido de reserva que involucre la realización de una práctica que
                    incluya el uso de instrumental (ya sea de equipos o PC&apos;s) propio del Departamento, dado que
                    lógicamente el único ámbito donde la misma podrá efectuarse son las instalaciones propias.
                  </p>
                </li>
                <li>
                  <p className="text-sm text-black">
                    Se dará prioridad a aquellos cursos que, al momento de la asignación, hayan hecho un menor uso de
                    los laboratorios, a fin de equiparar la distribución en la utilización de los recursos disponibles.
                  </p>
                </li>
                <li>
                  <p className="text-sm text-black">
                    Para las reservas que solo requieran la utilización de medios audiovisuales (cañón proyector), se
                    les dará lugar en los laboratorios en función del criterio establecido en el punto 1. De ser
                    necesario, el Departamento cuenta en cada sede con un cañón extra que podrá ser prestado al docente
                    que lo solicite para el dictado de la clase en un aula externa.
                  </p>
                </li>
              </ol>
            </div>

            <div>
              <p className="text-sm font-bold text-black ">
                A su vez, recordamos algunos puntos importantes a tener en cuenta al realizar una reserva de
                Laboratorio:
              </p>
              <ol className="flex list-inside list-decimal flex-col gap-4">
                <li>
                  <p className="text-sm text-black">
                    Los laboratorios abiertos son para utilización por parte de los alumnos para sus prácticas en
                    horario extra académico en caso en que lo hayan solicitado por los medios de reserva disponibles. Si
                    hubiese lugar disponible en los mismos, los Laboratorios Abiertos podrán utilizarse para atención de
                    consultas y corrección de proyectos por parte del cuerpo docente, previa solicitud al personal de
                    Pañol, y teniendo en cuenta que los mismos no cuentan con la capacidad de un laboratorio aula.
                  </p>
                </li>
                <li>
                  <p className="text-sm text-black">
                    Los laboratorios pertenecientes al Departamento no están asignados de manera fija a ninguna materia
                    de la carrera. Por una cuestión administrativa, la Subsecretaría de Gestión suele solicitar al
                    inicio de cada año una cantidad de laboratorios para distribución de cursos debido a la
                    superpoblación reinante, y por una cuestión de orden bedelía asigna uno u otro curso. Debe
                    entenderse que la utilización de los laboratorios está supeditada a los puntos antes mencionados, y
                    los mismos son evaluados por el personal responsable del Departamento, motivo por el cual es
                    indispensable realizar la reserva de laboratorio pertinente independientemente de lo publicado por
                    bedelía, pudiendo luego variar el lugar de dictado de la clase (aula o laboratorio) en función de la
                    disponibilidad.
                  </p>
                </li>
                <li>
                  <p className="text-sm text-black">
                    El personal del Departamento no está facultado para gestionar pedidos de reservas ante otras
                    dependencias de la Facultad, tales como la Secretaría de Cultura y Extensión Universitaria, o la
                    Oficina de Medios Audiovisuales, debiendo el docente a cargo del curso o el ayudante que él mismo
                    designe gestionar el pedido correspondiente por el canal que dichas oficinas establezcan.
                  </p>
                </li>
                <li>
                  <p className="text-sm text-black">
                    La Jefatura de Laboratorios se reserva el derecho de cancelar una reserva previamente asignada por
                    motivos de fuerza mayor o conflicto de recursos. Para ello se establece un mínimo de una semana de
                    aviso previo a la fecha en cuestión, con el fin de dar al cuerpo docente el tiempo suficiente para
                    la replanificación de la clase y la posibilidad de aviso a los alumnos.
                  </p>
                </li>
                <li>
                  <p className="text-sm text-black">
                    Se recomienda a los docentes efectuar las reservas de laboratorio con un plazo mínimo de una semana
                    de anticipación, por los motivos citados en el punto anterior, dado que a pesar que su curso tenga
                    una menor utilización del laboratorio, no se podrá dar de baja una reserva sin cumplir con el plazo
                    de aviso previo estipulado, por respeto a las demás cétedras.
                  </p>
                </li>
                <li>
                  <p className="text-sm text-black">
                    El mecanismo de reserva de laboratorio se realiza exclusivamente a través del Sistema de Gestión
                    Electrónica (SGE), no aceptándose pedidos verbales al personal del Departamento. Aquel docente, ya
                    sea profesor o auxiliar, que tenga inconvenientes en el pedido a través del sistema, deberá
                    contactarse a jefatura@electron.frba.utn.edu.ar con el fin de solucionar el problema.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </ModalDrawer>
  );
};
