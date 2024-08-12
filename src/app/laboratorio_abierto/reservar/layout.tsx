"use server";

type LayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default async function Layout({ children, modal }: LayoutProps) {
  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Laboratorio Abierto - Reservar</h3>
      <p className="text-center text-lg antialiased">
        El Laboratorio Abierto (LA) del Departamento de Ingeniería Electrónica de la UTN-FRBA está diseñado para
        facilitar el acceso al instrumental del departamento a estudiantes, egresados, docentes y asociados de esta
        facultad, permitiéndoles realizar pruebas, ensayos y trabajos relacionados con sus estudios.
      </p>
      <p className="text-center text-lg antialiased">
        El LA se encuentra en el departamento de electrónica y ofrece tres opciones de uso:
      </p>
      {children}
      {modal}
    </>
  );
}
