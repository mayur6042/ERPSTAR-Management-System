import { useState, type ReactNode } from "react";
import { Pencil, Search } from "lucide-react";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  onEdit,
  onDelete,
}: {
  rows: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}) {
  const [filter, setFilter] = useState("");
  const shown = rows.filter((row) =>
    columns.some((column) =>
      String(row[column.key] ?? "").toLowerCase().includes(filter.toLowerCase()),
    ),
  );

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div className="table-heading"><strong>All records</strong><span className="count-pill">{shown.length}</span></div>
        <label className="table-search"><Search size={15} /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Filter records..." /></label>
      </div>
      <div className="table-scroll">
        <table>
          <thead><tr>{columns.map((column) => <th key={String(column.key)}>{column.label}</th>)}{(onEdit || onDelete) && <th aria-label="Actions" />}</tr></thead>
          <tbody>
            {shown.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => <td key={String(column.key)}>{column.render ? column.render(row[column.key], row) : String(row[column.key] ?? "—")}</td>)}
                {(onEdit || onDelete) && <td className="action-cell">{onEdit && <button className="text-action" onClick={() => onEdit(row)} aria-label="Edit record"><Pencil size={14} /></button>}{onDelete && <button className="text-action danger" onClick={() => onDelete(row)}>Delete</button>}</td>}
              </tr>
            ))}
            {shown.length === 0 && <tr><td className="empty-cell" colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}>No records found. Try a different search or add a record.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="table-pagination"><span>Showing <strong>{shown.length}</strong> of <strong>{rows.length}</strong> records</span></div>
    </div>
  );
}
