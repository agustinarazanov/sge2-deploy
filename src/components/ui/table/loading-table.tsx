import { Skeleton } from "../skeleton";

type LoadingTableProps = {
  caption?: React.ReactNode;
  columns: string[];
  rowsLength: number;
};

export default function LoadingTable({ caption, columns, rowsLength }: LoadingTableProps) {
  const registers = Array.from({ length: rowsLength });

  return (
    <table className="w-full caption-bottom text-sm">
      {caption && <caption className="caption-bottom pt-2">{caption}</caption>}
      <thead>
        <tr className="sticky top-0 border-b border-gray-400 hover:bg-muted/10">
          {columns.map((value) => (
            <th key={value} className="h-14 bg-gray-500 px-4 text-left align-middle font-medium text-muted-foreground">
              <div className="inline-flex h-8 items-center gap-2 px-2 hover:bg-gray-400">{value}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {registers.map((_, rowIndex) => (
          <tr key={rowIndex} className="border-b border-gray-400 hover:bg-muted/10">
            {columns.map((column, colIndex) => (
              <td key={colIndex} className="p-4 text-left align-middle">
                <Skeleton className="h-4 w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
