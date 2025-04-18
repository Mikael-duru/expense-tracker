import React from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteTransaction } from "../_actions/delete-transaction";

type DeleteTransactionDialogProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	transactionId: string;
};

const DeleteTransactionDialog = ({
	open,
	setOpen,
	transactionId,
}: DeleteTransactionDialogProps) => {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: deleteTransaction,
		onSuccess: async () => {
			toast.success("Transaction deleted successfully", {
				id: transactionId,
			});

			await queryClient.invalidateQueries({
				queryKey: ["transactions"],
			});
		},
		onError: () => {
			toast.success("Something went wrong", {
				id: transactionId,
			});
		},
	});

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the
						transaction.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							toast.loading("Deleting transaction...", {
								id: transactionId,
							});
							deleteMutation.mutate(transactionId);
						}}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteTransactionDialog;
