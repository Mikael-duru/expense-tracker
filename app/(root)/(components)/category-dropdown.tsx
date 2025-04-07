"use-client";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import CreateCategoryDialog from "./create-category-dialog";

import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryDropdownProps = {
	type: TransactionType;
	onChange: (value: string) => void;
};

const CategoryDropdown = ({ type, onChange }: CategoryDropdownProps) => {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");

	useEffect(() => {
		if (!value) return;
		onChange(value);
	}, [value, onChange]);

	const categoriesQuery = useQuery({
		queryKey: ["categories", type],
		queryFn: () =>
			fetch(`/api/categories?type=${type}`).then((res) => res.json()),
	});

	const selectedCategory = categoriesQuery.data?.find(
		(category: Category) => category.name === value
	);

	// set newly created category as selected category
	const successCallback = useCallback(
		(category: Category) => {
			setValue(category.name);
			setOpen((prev) => !prev);
		},
		[setValue, setOpen]
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="sm:w-[200px] justify-between"
				>
					{selectedCategory ? (
						<CategoryRow category={selectedCategory} />
					) : (
						"Select category"
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command onSubmit={(e) => e.preventDefault()}>
					<CommandInput placeholder="Search category..." />
					<CreateCategoryDialog type={type} successCallback={successCallback} />
					<CommandEmpty>
						<p>Category not found</p>
						<p className="text-xs text-muted-foreground">
							Tip: Create a new category.
						</p>
					</CommandEmpty>
					<CommandGroup>
						<CommandList>
							{categoriesQuery.data &&
								categoriesQuery.data?.map((category: Category) => (
									<CommandItem
										key={category.name}
										onSelect={() => {
											setValue(category?.name);
											setOpen((prev) => !prev);
										}}
										className="cursor-pointer"
									>
										<CategoryRow category={category} />
										<Check
											className={cn(
												"mr-2 h-4 w-4 opacity-0",
												value === category.name && "opacity-100"
											)}
										/>
									</CommandItem>
								))}
						</CommandList>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default CategoryDropdown;

const CategoryRow = ({ category }: { category: Category }) => {
	return (
		<div className="flex items-center gap-2">
			<span role="img">{category.icon}</span>
			<span className="lowercase">{category.name}</span>
		</div>
	);
};
