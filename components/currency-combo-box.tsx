"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Currencies } from "@/constants";
import { updateUserCurrency } from "@/app/select-currency/_actions/user-actions";

import { useMutation } from "@tanstack/react-query";
import { User } from "@prisma/client";
import { toast } from "sonner";

export function CurrencyComboBox() {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 640px)");
	const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
		null
	);

	const mutation = useMutation({
		mutationFn: updateUserCurrency,
		onSuccess: (data: User) => {
			toast.success("Currency updated successfully 🎉", {
				id: "update-currency",
			});

			setSelectedOption(
				Currencies.find((currency) => currency.value === data.currency) || null
			);
		},
		onError: () => {
			toast.error("Failed to add currency", {
				id: "update-currency",
			});
		},
	});

	const selectOption = React.useCallback(
		(currency: Currency | null) => {
			if (!currency) {
				toast.error("Please select a currency");
				return;
			}

			toast.loading("Updating currency...", {
				id: "update-currency",
			});

			mutation.mutate(currency.value);
		},
		[mutation]
	);

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="w-full justify-start"
						disabled={mutation.isPending}
					>
						{selectedOption ? <>{selectedOption.label}</> : <>+ Set Currency</>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0" align="start">
					<OptionList setOpen={setOpen} setSelectedOption={selectOption} />
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					variant="outline"
					className="w-full justify-start"
					disabled={mutation.isPending}
				>
					{selectedOption ? <>{selectedOption.label}</> : <>+ Set Currency</>}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mt-4 border-t">
					<OptionList setOpen={setOpen} setSelectedOption={selectOption} />
				</div>
			</DrawerContent>
		</Drawer>
	);
}

function OptionList({
	setOpen,
	setSelectedOption,
}: {
	setOpen: (open: boolean) => void;
	setSelectedOption: (status: Currency | null) => void;
}) {
	return (
		<Command>
			<CommandInput placeholder="Filter status..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup>
					{Currencies.map((currency: Currency) => (
						<CommandItem
							key={currency.value}
							value={currency.value}
							onSelect={(value) => {
								setSelectedOption(
									Currencies.find((priority) => priority.value === value) ||
										null
								);
								setOpen(false);
							}}
						>
							{currency.label}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
