"use client";

import { BibliotecaFilterText } from "./biblioteca-filter-text";
import { BibliotecaNewLibro } from "./biblioteca-new-book";
import { useRouter } from "next/navigation";

export const ActionButtons = () => {
  const router = useRouter();

  const handleCambioEnBiblioteca = () => router.refresh();

  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-2 md:flex-row-reverse  md:space-x-1.5 md:space-y-0">
      <div className="relative flex w-full flex-row justify-end md:w-auto md:basis-1/3">
        <BibliotecaNewLibro onSubmit={handleCambioEnBiblioteca} />
      </div>

      <div className="w-full md:basis-1/3">
        <BibliotecaFilterText />
      </div>
    </div>
  );
};