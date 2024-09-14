"use server";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
  return (
    <main className="flex w-full flex-col">
      <div className="flex flex-col items-center justify-center gap-12 px-0 py-0 ">{children}</div>
    </main>
  );
}
