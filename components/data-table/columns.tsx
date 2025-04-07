import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

import { DataTableColumnHeader } from "./column-header";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, TrashIcon } from "lucide-react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import DeleteTransactionDialog from "@/app/(root)/transactions/(components)/delete-transaction";

type TransactionHistoryRow = GetTransactionHistoryResponseType[0];

export const columns: ColumnDef<TransactionHistoryRow>[] = [
	// Category
	{
		accessorKey: "category",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Category" />
		),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
		cell: ({ row }) => (
			<div className="flex gap-2 capitalize">
				{row.original.categoryIcon}
				<p>{row.original.category}</p>
			</div>
		),
	},

	// Description
	{
		accessorKey: "description",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Description" />
		),
		cell: ({ row }) => (
			<div className="capitalize">{row.original.description}</div>
		),
	},

	// Date
	{
		accessorKey: "date",
		header: "Date",
		cell: ({ row }) => {
			const date = new Date(row.original.date);
			const formattedDate = date.toLocaleDateString("default", {
				timeZone: "UTC",
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			});

			return <div className="text-muted-foreground">{formattedDate}</div>;
		},
	},

	// Type
	{
		accessorKey: "type",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Type" className="mx-auto" />
		),
		// filterFn: (row, id, value) => {
		// 	return value.includes(row.getValue(id));
		// },
		cell: ({ row }) => (
			<div
				className={cn(
					"capitalize rounded-lg text-center p-2",
					row.original.type === "income"
						? "bg-emerald-400/10 text-emerald-500"
						: "bg-rose-400/10 text-rose-500"
				)}
			>
				{row.original.type}
			</div>
		),
	},

	// Amount
	{
		accessorKey: "amount",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Amount"
				className="mx-auto"
			/>
		),
		cell: ({ row }) => (
			<p className="rounded-lg bg-gray-400/5 p-2 text-center font-medium">
				{row.original.formattedAmount}
			</p>
		),
	},

	// Actions
	{
		id: "actions",
		enableHiding: true,
		cell: ({ row }) => <RowActions transaction={row.original} />,
	},
];

const RowActions = ({
	transaction,
}: {
	transaction: TransactionHistoryRow;
}) => {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	return (
		<>
			<DeleteTransactionDialog
				open={showDeleteDialog}
				setOpen={setShowDeleteDialog}
				transactionId={transaction.id}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal size={16} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="flex items-center gap-2 cursor-pointer"
						onSelect={() => setShowDeleteDialog((prev) => !prev)}
					>
						<TrashIcon className="size-4 text-muted-foreground" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
