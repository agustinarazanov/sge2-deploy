import React from "react";
type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Editar - Division</h3>
      <div className="flex flex-col items-center justify-center gap-12 px-4 ">{children}</div>
    </>
  );
}
