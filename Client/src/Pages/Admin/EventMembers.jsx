import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Ticket,
} from "lucide-react";

// ⭐ Excel Libraries
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const EventMembers = () => {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("All");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          "https://founders-sangam.onrender.com/admin/registrations",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setData(res.data.registrations);
        }
      } catch (err) {
        console.error("Failed to fetch registrations");
      }
    };
    fetchRegistrations();
  }, []);

  const uniqueEvents = useMemo(() => {
    const events = data.map((item) => item.eventId?.title || "Unknown Event");
    return [...new Set(events)].sort();
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedEvent === "All") return data;
    return data.filter(
      (item) => (item.eventId?.title || "Unknown Event") === selectedEvent
    );
  }, [data, selectedEvent]);

  const columns = useMemo(
    () => [
      {
        header: "Event",
        accessorKey: "eventId",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-bold text-neutral-900 dark:text-white text-xs">
              {info.getValue()?.title || "Unknown Event"}
            </span>
            <span className="text-[10px] text-neutral-500">
              {info.getValue()?.date
                ? new Date(info.getValue().date).toLocaleDateString()
                : ""}
            </span>
          </div>
        ),
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => (
          <span className="text-neutral-900 dark:text-neutral-200 text-xs font-semibold">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Type",
        accessorKey: "ticketType",
        cell: (info) => (
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
              info.getValue() === "Platinum"
                ? "bg-slate-100 text-slate-700 border-slate-200"
                : info.getValue() === "Gold"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Seats",
        accessorKey: "quantity",
        cell: (info) => (
          <span className="text-center block text-xs font-medium">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: (info) => (
          <span className="text-neutral-600 dark:text-neutral-400 text-xs font-mono">
            ₹{info.getValue()}
          </span>
        ),
      },
      {
        header: "Contact",
        accessorKey: "contact",
        cell: (info) => (
          <span className="text-[10px] text-neutral-500 font-mono">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Date",
        accessorKey: "createdAt",
        cell: (info) => (
          <span className="text-neutral-400 dark:text-neutral-500 text-[10px] uppercase">
            {new Date(info.getValue()).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // ⭐ NEW: EXCEL EXPORT (same button UI)
  const exportToExcel = () => {
    const rows = filteredData.map((row) => ({
      Event: row.eventId?.title || "-",
      Name: row.name,
      Ticket_Type: row.ticketType,
      Quantity: row.quantity,
      Amount: row.amount,
      Contact: row.contact,
      Date: new Date(row.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Event Members");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName =
      `event_members_${
        selectedEvent === "All"
          ? "all"
          : selectedEvent.replace(/\s+/g, "_").toLowerCase()
      }` + ".xlsx";

    saveAs(blob, fileName);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Event Members
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
            Manage all event participants
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Event Filter */}
          <div className="relative">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full sm:w-48 pl-3 pr-8 py-2 rounded-lg bg-white 
                                dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 
                                text-neutral-900 dark:text-white text-xs font-medium focus:outline-none 
                                focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
            >
              <option value="All">All Events</option>
              {uniqueEvents.map((event, idx) => (
                <option key={idx} value={event}>
                  {event}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
              <ChevronRight size={12} className="rotate-90" />
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:w-64 group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 
                            group-focus-within:text-amber-500"
              size={14}
            />
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-8 pr-4 py-2 rounded-lg bg-white dark:bg-[#111] 
                                border border-neutral-200 dark:border-neutral-800 text-neutral-900 
                                dark:text-white placeholder:text-neutral-400 text-xs focus:outline-none 
                                focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
            />
          </div>

          {/* Export Excel Button */}
          <button
            onClick={exportToExcel}
            className="flex items-center justify-center gap-2 px-4 py-2 
                        bg-neutral-900 dark:bg-white text-white dark:text-black 
                        rounded-lg font-bold text-xs hover:shadow-lg hover:-translate-y-0.5 
                        active:scale-95 transition-all duration-200"
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div
        className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-neutral-200 
                dark:border-neutral-800 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-neutral-100 dark:border-neutral-800 
                                        bg-neutral-50/50 dark:bg-neutral-900/30"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-5 py-2.5 text-[10px] font-bold text-neutral-500 
                                                uppercase tracking-wider cursor-pointer hover:text-neutral-800 
                                                dark:hover:text-white"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="text-neutral-400">
                          {{
                            asc: " ↑",
                            desc: " ↓",
                          }[header.column.getIsSorted()] ?? ""}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-5 py-3 text-xs text-neutral-600 dark:text-neutral-300"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between px-5 py-2.5 border-t 
                        border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/20"
        >
          <div className="text-[10px] font-medium text-neutral-500">
            Page{" "}
            <span className="text-neutral-900 dark:text-white font-bold">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="text-neutral-900 dark:text-white font-bold">
              {table.getPageCount()}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 rounded-md bg-white dark:bg-neutral-800 border 
                                border-neutral-200 dark:border-neutral-700 text-neutral-600 
                                dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 
                                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1 rounded-md bg-white dark:bg-neutral-800 border 
                                border-neutral-200 dark:border-neutral-700 text-neutral-600 
                                dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 
                                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventMembers;
