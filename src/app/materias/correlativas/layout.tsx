"use server";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
  return (
    <main className="flex flex-col">
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">{children}</div>
    </main>
  );
}
