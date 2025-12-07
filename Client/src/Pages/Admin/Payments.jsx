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
import { Search, ChevronLeft, ChevronRight, Download, Receipt } from "lucide-react";

const Payments = () => {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await axios.get("https://founders-sangam.onrender.com/admin/payments", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    setData(res.data.payments);
                }
            } catch (err) {
                console.error("Failed to fetch payments");
            }
        };
        fetchPayments();
    }, []);

    const columns = useMemo(
        () => [
            {
                header: "Source",
                accessorKey: "source",
                cell: (info) => {
                    const isCommunity = info.getValue() === "Community";
                    return (
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${isCommunity
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                            }`}>
                            {info.getValue()}
                        </span>
                    );
                },
            },
            {
                header: "Transaction ID",
                accessorKey: "paymentId",
                cell: (info) => (
                    <span className="font-mono text-[10px] text-neutral-500">{info.getValue()}</span>
                ),
            },
            {
                header: "User",
                accessorKey: "name",
                cell: (info) => (
                    <div className="flex flex-col">
                        <span className="text-neutral-900 dark:text-neutral-200 text-xs font-semibold">{info.getValue()}</span>
                        <span className="text-[10px] text-neutral-400">{info.row.original.email}</span>
                    </div>
                ),
            },
            {
                header: "Amount",
                accessorKey: "amount",
                cell: (info) => <span className="text-neutral-900 dark:text-white text-sm font-bold font-mono">₹{info.getValue()}</span>,
            },
            {
                header: "Date",
                accessorKey: "date",
                cell: (info) => (
                    <span className="text-neutral-500 text-[10px]">
                        {new Date(info.getValue()).toLocaleString()}
                    </span>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const exportToCSV = () => {
        const headers = ["Source,Transaction ID,Name,Email,Contact,Amount,Date"];
        const rows = data.map(row =>
            `"${row.source}","${row.paymentId}","${row.name}","${row.email}","${row.contact}","${row.amount}","${new Date(row.date).toLocaleString()}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Payments & Transactions</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
                        Unified view of all platform revenue
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-1 sm:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-amber-500 transition-colors" size={14} />
                        <input
                            type="text"
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search transactions..."
                            className="w-full pl-8 pr-4 py-2 rounded-lg bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
                        />
                    </div>
                    {/* <button
                        onClick={exportToCSV}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg font-bold text-xs hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                    >
                        <Download size={14} />
                        Export Data
                    </button> */}
                </div>
            </div>

            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-5 py-2.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-800 dark:hover:text-white transition-colors"
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
                                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-5 py-3 text-xs text-neutral-600 dark:text-neutral-300">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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

export default Payments;