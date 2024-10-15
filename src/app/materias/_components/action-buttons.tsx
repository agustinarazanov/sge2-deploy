import React from "react";
import { NuevaMateria } from "./materia-new-materia";

export const ActionButtons = () => {
  return (
    <div className="relative flex w-full items-center justify-between space-y-3 md:flex-row md:justify-end md:space-x-3 md:space-y-0">
      <div className="flex space-x-2">
        <NuevaMateria />
      </div>
    </div>
  );
};
