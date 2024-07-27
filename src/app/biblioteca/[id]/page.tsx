type PageProps = {
  params: { id: string };
};

export default function PageDetails({ params: { id } }: PageProps) {
  return <div>PAGE PURA {id}</div>;
}
