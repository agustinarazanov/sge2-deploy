type LayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default async function Layout({ children, modal }: LayoutProps) {
  return (
    <div className="flex w-full flex-col">
      {children}
      {modal}
    </div>
  );
}
