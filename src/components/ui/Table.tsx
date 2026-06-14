import { Card } from './Card';

export interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
}

export function DataTable<T>({ columns, rows, empty = 'Sin registros por ahora' }: { columns: Column<T>[]; rows: T[]; empty?: string }) {
  if (!rows.length) {
    return (
      <Card className="p-6 text-center text-sm font-semibold text-chocolate/70 dark:text-crema/70">
        {empty}
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-lavanda/70 bg-lavanda/25 text-left text-xs uppercase text-chocolate/70 dark:border-white/10 dark:bg-white/5 dark:text-crema/60">
            {columns.map((column) => (
              <th key={column.header} className="px-4 py-3 font-extrabold">{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-lavanda/40 last:border-0 hover:bg-lavanda/20 dark:border-white/10 dark:hover:bg-white/5">
              {columns.map((column) => (
                <td key={column.header} className="px-4 py-3 align-top">{column.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
