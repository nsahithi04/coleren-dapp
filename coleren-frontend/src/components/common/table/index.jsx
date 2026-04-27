import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";

import SortIcon from "../icons/SortIcon";
import FeedbackRow from "../feedbackRow";

export default function Table({
  data = [],
  columns,
  selectedRow,
  onRowSelect,
}) {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table className="w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border-b border-gray-100">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                style={{ width: header.getSize() }}
                onClick={header.column.getToggleSortingHandler()}
                className="cursor-pointer text-left p-3"
              >
                <div className="flex items-center gap-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  <SortIcon />
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row) => (
          <FeedbackRow
            key={row.original._id}
            row={row.original}
            isActive={selectedRow?._id === row.original._id}
            onClick={() => onRowSelect(row.original)}
          />
        ))}
      </tbody>
    </table>
  );
}
