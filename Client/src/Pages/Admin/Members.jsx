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
import { Search, ChevronLeft, ChevronRight, Download, Users } from "lucide-react";

const Members = () => {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await axios.get("https://founders-sangam.onrender.com/members", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setData(res.data.members);
                }
            } catch (err) {
                console.error("Failed to fetch members");
            }
        };
        fetchMembers();
    }, []);

    const columns = useMemo(
        () => [
            {
                header: "Name",
                accessorKey: "name",
                cell: (info) => (
                    // Reduced to text-xs
                    <span className="font-bold text-neutral-900 dark:text-white text-xs">
                        {info.getValue()}
                    </span>
                ),
            },
            {
                header: "Brand",
                accessorKey: "brandName",
                cell: (info) => <span className="text-neutral-600 dark:text-neutral-400 text-xs">{info.getValue()}</span>,
            },
            {
                header: "Email",
                accessorKey: "email",
                cell: (info) => <span className="text-neutral-500 font-medium text-xs">{info.getValue()}</span>,
            },
            {
                header: "Contact",
                accessorKey: "contact",
                cell: (info) => <span className="font-mono text-[10px] tracking-wide text-neutral-600 dark:text-neutral-400">{info.getValue()}</span>,
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: (info) => (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 uppercase tracking-wide border border-emerald-100 dark:border-emerald-500/20">
                        {info.getValue()}
                    </span>
                ),
            },
            {
                header: "Date",
                accessorKey: "createdAt",
                cell: (info) => (
                    <span className="text-neutral-400 dark:text-neutral-500 text-[10px] font-medium uppercase">
                        {new Date(info.getValue()).toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}
                    </span>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const exportToCSV = () => {
        const headers = ["Name,Brand,Email,Contact,Status,Date"];
        const rows = data.map(row =>
            `"${row.name}","${row.brandName}","${row.email}","${row.contact}","${row.status}","${new Date(row.createdAt).toLocaleDateString()}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "members_list.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Members</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1 flex items-center gap-2">
                        Manage community access
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-1 sm:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-amber-500 transition-colors" size={14} />
                        <input
                            type="text"
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search members..."
                            className="w-full pl-8 pr-4 py-2 rounded-lg bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
                        />
                    </div>
                    {/* <button
                        onClick={exportToCSV}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg font-bold text-xs hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-neutral-200 dark:shadow-none"
                    >
                        <Download size={14} />
                        Export
                    </button> */}
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-5 py-2.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-800 dark:hover:text-white transition-colors select-none"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-1">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
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
                                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors group"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        // Applied text-xs to the cell wrapper
                                        <td key={cell.id} className="px-5 py-3 text-xs text-neutral-600 dark:text-neutral-300">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between px-5 py-2.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/20">
                    <div className="text-[10px] font-medium text-neutral-500">
                        Page <span className="text-neutral-900 dark:text-white font-bold">{table.getState().pagination.pageIndex + 1}</span> of <span className="text-neutral-900 dark:text-white font-bold">{table.getPageCount()}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-1 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-1 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Members;