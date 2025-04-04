"use client";

import { Button } from "@/components/ui/button";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CreateCategorySchema } from "@/schema/categories";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../_actions/categories";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

type CreateCategoryDialogProps = {
	type: TransactionType;
	successCallback: (category: Category) => void;
	trigger?: React.ReactNode;
};

const CreateCategoryDialog = ({
	type,
	successCallback,
	trigger,
}: CreateCategoryDialogProps) => {
	const [open, setOpen] = useState(false);
	const [openPopover, setOpenPopover] = useState(false);

	const form = useForm<z.infer<typeof CreateCategorySchema>>({
		resolver: zodResolver(CreateCategorySchema),
		defaultValues: {
			type,
			name: "",
		},
	});

	const Icon = form.watch("icon");

	useEffect(() => {
		if (Icon) setOpenPopover((prev) => !prev);
	}, [Icon]);

	const queryClient = useQueryClient();
	const theme = useTheme();

	const { mutate, isPending } = useMutation({
		mutationFn: createCategory,
		onSuccess: async (data: Category) => {
			form.reset({
				name: "",
				icon: "",
				type,
			});

			toast.success(`Category "${data.name}" created successfully! 🎉`, {
				id: "create-category",
			});

			successCallback(data);

			await queryClient.invalidateQueries({
				queryKey: ["categories"],
			});

			setOpen((prev) => !prev);
		},
		onError: () => {
			toast.error("Something went wrong", {
				id: "create-category",
			});
		},
	});

	// always use "useCallback" when calling functions with mutations to avoid rendering errors.
	const onSubmit = useCallback(
		(value: z.infer<typeof CreateCategorySchema>) => {
			toast.loading("Creating category...", { id: "create-category" });
			mutate(value);
		},
		[mutate]
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger ? (
					trigger
				) : (
					<Button
						variant="ghost"
						className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
					>
						<PlusSquare className="mr-2 size-4" /> Create new
					</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Create{" "}
						<span
							className={cn(
								"inline-block font-semibold",
								type === "expense" ? "text-red-500" : "text-emerald-500"
							)}
						>
							{type}
						</span>{" "}
						category
					</DialogTitle>
					<DialogDescription>
						Categories are used to group your transactions.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Name <span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input placeholder="Enter a category name" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Icon <span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Popover open={openPopover} onOpenChange={setOpenPopover}>
											<PopoverTrigger asChild>
												<Button
													variant={"outline"}
													className="h-[100px] w-full flex items-center flex-col gap-2"
												>
													{Icon ? (
														<>
															<span className="text-5xl" role="img">
																{field.value}
															</span>
															<p className="text-xs text-muted-foreground">
																Click to Change
															</p>
														</>
													) : (
														<>
															<CircleOff className="!w-12 !h-12" />
															<p className="text-xs text-muted-foreground">
																Click to select
															</p>
														</>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-full h-full relative">
												<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
													<Picker
														data={data}
														onEmojiSelect={(emoji: { native: string }) =>
															field.onChange(emoji.native)
														}
														theme={theme.resolvedTheme}
													/>
												</div>
											</PopoverContent>
										</Popover>
									</FormControl>
									<FormDescription>
										This is how your category will be displayed.
									</FormDescription>
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<DialogFooter className="flex max-sm:gap-4 gap-1">
					<DialogClose asChild>
						<Button
							type="button"
							variant={"secondary"}
							onClick={() => form.reset()}
						>
							Cancel
						</Button>
					</DialogClose>
					<Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
						{isPending ? <Loader2 className="animate-spin" /> : "Create"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateCategoryDialog;
