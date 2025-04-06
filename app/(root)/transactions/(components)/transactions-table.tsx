"use client";

import { DateToUTCDate } from "@/lib/helpers";
import { GetTransactionHistoryResponseType } from "@/app/api/transactions-history/route";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { columns } from "@/components/data-table/columns";
import { DataTableFacetedFilter } from "@/components/data-table/faceted-filter";
import { DataTableViewOptions } from "@/components/data-table/column-toggle";
import { Button } from "@/components/ui/button";

import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { DownloadIcon } from "lucide-react";

interface TransactionsTableProps {
	from: Date;
	to: Date;
}

const emptyData: any[] = [];

const csvConfig = mkConfig({
	fieldSeparator: ",",
	decimalSeparator: ".",
	useKeysAsHeaders: true,
});

const TransactionsTable = ({ from, to }: TransactionsTableProps) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const transactionsHistoryQuery = useQuery<GetTransactionHistoryResponseType>({
		queryKey: ["transactions", "history", from, to],
		queryFn: () =>
			fetch(
				`api/transactions-history?from=${DateToUTCDate(
					from
				)}&to=${DateToUTCDate(to)}`
			).then((res) => res.json()),
	});

	const handleExportCsv = (data: any[]) => {
		const csv = generateCsv(csvConfig)(data);
		download(csvConfig)(csv);
	};

	const table = useReactTable({
		data: transactionsHistoryQuery.data || emptyData,
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			sorting,
			columnFilters,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	// Extract the categories from the transactions
	const categoriesOptions = useMemo(() => {
		const categoriesMap = new Map();
		transactionsHistoryQuery.data?.forEach((transaction) => {
			categoriesMap.set(transaction.category, {
				value: transaction.category,
				label: `${transaction.categoryIcon} ${transaction.category}`,
			});
		});
		const uniqueCategories = new Set(categoriesMap.values());
		return Array.from(uniqueCategories);
	}, [transactionsHistoryQuery.data]);

	return (
		<div className="w-full">
			<div className="flex flex-wrap items-end justify-between gap-2 py-4">
				<div className="flex gap-2">
					{table.getColumn("category") && (
						<DataTableFacetedFilter
							title="Category"
							column={table.getColumn("category")}
							options={categoriesOptions}
						/>
					)}

					{table.getColumn("type") && (
						<DataTableFacetedFilter
							title="Type"
							column={table.getColumn("type")}
							options={[
								{ label: "Income", value: "income" },
								{ label: "Expense", value: "expense" },
							]}
						/>
					)}
				</div>

				<div className="flex flex-wrap gap-2">
					<Button
						variant={"outline"}
						size={"sm"}
						className="ml-auto h-8 lg:flex"
						onClick={() => {
							const data = table.getFilteredRowModel().rows.map((row) => ({
								category: row.original.category,
								categoryIcon: row.original.categoryIcon,
								description: row.original.description,
								date: row.original.date,
								type: row.original.type,
								amount: row.original.amount,
								formattedAmount: row.original.formattedAmount,
							}));
							handleExportCsv(data);
						}}
					>
						<DownloadIcon className="size-4" />{" "}
						<span className="max-sm:sr-only">Export</span> CSV
					</Button>
					<DataTableViewOptions table={table} />
				</div>
			</div>

			<SkeletonWrapper isLoading={transactionsHistoryQuery.isLoading}>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</SkeletonWrapper>
		</div>
	);
};

export default TransactionsTable;
