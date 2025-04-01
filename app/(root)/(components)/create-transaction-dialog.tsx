"use client";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createTransactionSchema } from "@/schema/transaction";
import { z } from "zod";
import CategoryDropdown from "./category-dropdown";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "../_actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";

interface CreateTransactionDialogProps {
	trigger: ReactNode;
	type: TransactionType;
}

const CreateTransactionDialog = ({
	trigger,
	type,
}: CreateTransactionDialogProps) => {
	const [open, setOpen] = useState(false);

	const transactionForm = useForm<z.infer<typeof createTransactionSchema>>({
		resolver: zodResolver(createTransactionSchema),
		defaultValues: {
			type,
			date: new Date(),
			amount: 0,
		},
	});

	const handleCategoryChange = useCallback(
		(value: string) => {
			transactionForm.setValue("category", value);
			transactionForm.clearErrors("category"); // clears error when user selects a category
		},
		[transactionForm]
	);

	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: createTransaction,
		onSuccess: () => {
			toast.success("Transaction created successfully 🎉", {
				id: "create-transaction",
			});

			transactionForm.reset({
				type,
				date: new Date(),
				amount: 0,
				category: undefined,
				description: "",
			});

			// after creating a new transaction, invalidate the overview query to update the data
			queryClient.invalidateQueries({
				queryKey: ["overview"],
			});

			setOpen((prev) => !prev);
		},
		onError: () => {
			toast.error("Something went wrong", {
				id: "create-transaction",
			});
		},
	});

	const onSubmit = useCallback(
		(value: z.infer<typeof createTransactionSchema>) => {
			toast.loading("Creating transaction...", {
				id: "create-transaction",
			});

			mutate({ ...value, date: DateToUTCDate(value.date) });
		},
		[mutate]
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Create a new{" "}
						<span
							className={cn(
								"inline-block font-semibold",
								type === "expense" ? "text-red-500" : "text-emerald-500"
							)}
						>
							{type}
						</span>{" "}
						transaction
					</DialogTitle>
					<DialogDescription>
						Fields marked with <span className="text-red-500">*</span> are
						required
					</DialogDescription>
				</DialogHeader>
				<Form {...transactionForm}>
					<form
						onSubmit={transactionForm.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Description */}
						<FormField
							control={transactionForm.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input
											placeholder="Write transaction description here..."
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						{/* Amount */}
						<FormField
							control={transactionForm.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Amount <span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input type="number" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<div className="max-sm:space-y-6 sm:flex items-center justify-between gap-2">
							{/* Category selection */}
							<FormField
								control={transactionForm.control}
								name="category"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>
											Category <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<CategoryDropdown
												type={type}
												onChange={handleCategoryChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							{/* Date */}
							<FormField
								control={transactionForm.control}
								name="date"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>
											Transaction Date <span className="text-red-500">*</span>
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant={"outline"}
													className={cn(
														"sm:w-[200px] pl-3 text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date </span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={(value) => {
														if (!value) return;
														field.onChange(value);
													}}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</FormItem>
								)}
							/>
						</div>
					</form>
				</Form>
				<DialogFooter className="flex max-sm:gap-4 gap-1">
					<DialogClose asChild>
						<Button
							type="button"
							variant={"secondary"}
							onClick={() => transactionForm.reset()}
						>
							Cancel
						</Button>
					</DialogClose>
					<Button
						onClick={transactionForm.handleSubmit(onSubmit)}
						disabled={isPending}
					>
						{isPending ? <Loader2 className="animate-spin" /> : "Create"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateTransactionDialog;
