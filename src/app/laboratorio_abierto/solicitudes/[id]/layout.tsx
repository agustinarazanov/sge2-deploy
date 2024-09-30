type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Reserva</h3>
      <div className="flex flex-col items-center justify-center gap-6 px-4">{children}</div>
    </>
  );
}
