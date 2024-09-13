"use server";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-12 px-0 py-0 ">
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Préstamos de Biblioteca</h3>
      {children}
    </div>
  );
}
