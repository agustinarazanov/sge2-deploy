type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  return <div className="flex flex-col items-center justify-center gap-12 px-4 ">{children}</div>;
}
