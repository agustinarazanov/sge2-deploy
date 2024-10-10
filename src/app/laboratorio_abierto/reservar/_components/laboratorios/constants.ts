import { type RouterOutputs } from "@/trpc/react";
import exp from "constants";

export type LaboratorioAbiertoType =
  RouterOutputs["admin"]["laboratorios"]["getAll"]["laboratorios"][number]["laboratorioAbiertoTipo"];

export type ReservaLaboratorioAbiertoType = {
  tipo: LaboratorioAbiertoType;
  habilitado: boolean;
  titulo: string;
  descripcion: string[];
  alerta?: string;
  contenido?: string;
};

export const tiposReserva = [
  {
    tipo: "LA",
    habilitado: true,
    titulo: "Laboratorio Abierto (propiamente dicho) - LA",
    descripcion: [
      "Incluye el uso de las instalaciones y el instrumental del departamento disponibles para esta finalidad.",
      "No incluye apoyo alguno, y el usuario es responsable por el buen uso de los bienes del departamento.",
      "Para acceder al LA debe realizar una reserva, y aguardar la conformidad por correo electrónico. Concurrir a recepción en la fecha y hora acordadas. Al retirarse, dar aviso.",
    ],
    contenido: `
      <p><b>Horarios:</b></p>
      <p><b>Sede Medrano:</b> Lunes a Viernes de 9 a 23 hs, Sábado de 9 a 18 hs.</p>
      <p><b>Sede Campus:</b> Lunes a Viernes de 19 a 22:30 hs.</p>
    `,
  },
  {
    tipo: "TLA_BASICA",
    habilitado: true,
    titulo: "Tutoría básica en Laboratorio Abierto - TLA Básica",
    descripcion: [
      "Incluye el uso de las instalaciones y el instrumental del departamento disponibles para esta finalidad; y el acompañamiento de una persona calificada para el fin.",
      "El usuario y el tutor son co-responsables por el buen uso de los bienes del departamento.",
    ],
    alerta:
      "Asegurarse por medio de la grilla horaria la disponibilidad de un Tutor en el horario deseado; si no, no se podrá cursar el pedido.",
    contenido:
      "Para acceder a la TLA debe hacer la reserva, <b>indicando en observaciones que solicita tutoría básica</b>. Aguardar la conformidad por correo electrónico. Concurrir a recepción en la fecha y hora acordadas. Al retirarse, dar aviso.",
  },
  {
    tipo: "TLA",
    habilitado: true,
    titulo: "Tutoría en alguna disciplina en Laboratorio Abierto - TLA",
    descripcion: [
      "Idem anterior pero con apoyo orientado a un campo de la electrónica en especial, por ejemplo: ARM, Osciladores, Amplificadores, DSP, Video, etc.",
    ],
    alerta:
      "Asegurarse por medio de la grilla horaria la disponibilidad de un Tutor en el horario deseado; si no, no se podrá cursar el pedido.",
  },
] as ReservaLaboratorioAbiertoType[];
