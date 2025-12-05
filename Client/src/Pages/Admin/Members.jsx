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
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";

const Members = () => {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await axios.get("http://localhost:5000/members", {
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
                cell: (info) => <span className="font-bold text-slate-900 dark:text-white">{info.getValue()}</span>,
            },
            {
                header: "Brand",
                accessorKey: "brandName",
            },
            {
                header: "Email",
                accessorKey: "email",
            },
            {
                header: "Contact",
                accessorKey: "contact",
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: (info) => (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase">
                        {info.getValue()}
                    </span>
                ),
            },
            {
                header: "Date",
                accessorKey: "createdAt",
                cell: (info) => new Date(info.getValue()).toLocaleDateString(),
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
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Members</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage community members</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search members..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        />
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-all"
                    >
                        <Download size={20} />
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: " 🔼",
                                                desc: " 🔽",
                                            }[header.column.getIsSorted()] ?? null}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-sm text-slate-500">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Members;
