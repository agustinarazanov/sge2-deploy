import React from "react";
import type { AppRoute } from "@/shared/server-routes";

type PageLayoutProps = {
  title: string;
  routes: AppRoute[];
  button: React.ReactNode;
  children: React.ReactNode;
};

export default function PageLayout({ title, routes, button, children }: PageLayoutProps) {
  return (
    <>
      <header className="border-b border-slate-200">
        <div className="mx-auto flex items-center px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-gray-90 mr-8 w-[300px] truncate border-r border-slate-200 pr-8 text-3xl font-bold tracking-tight">
            {title}
          </h1>
          <nav className="flex space-x-8">
            {routes.map((subRuta) => (
              <a key={subRuta.href} href={subRuta.href} className="font-medium text-gray-500 hover:text-blue-700">
                {subRuta.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto">{button}</div>
        </div>
      </header>
      <main>
        <div className="mx-auto space-y-6 px-4 py-6 pb-10 sm:px-6 lg:px-8">{children}</div>
      </main>
    </>
  );
}
