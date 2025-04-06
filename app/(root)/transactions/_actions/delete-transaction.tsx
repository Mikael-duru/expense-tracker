"use server";

import { getUserId } from "@/app/select-currency/_actions/user-actions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const deleteTransaction = async (id: string) => {
	const userId = await getUserId();
	if (!userId) {
		redirect("/sign-in");
	}

	const transaction = await prisma.transaction.findUnique({
		where: {
			userId,
			id,
		},
	});

	if (!transaction) throw new Error("bad request");

	// Delete transaction and update the monthHistory and yearHistory aggregate table.
	await prisma.$transaction([
		prisma.transaction.delete({ where: { id, userId } }),

		// Update the monthHistory aggregate table
		prisma.monthHistory.update({
			where: {
				day_month_year_userId: {
					userId,
					day: transaction.date.getUTCDate(),
					month: transaction.date.getUTCMonth(),
					year: transaction.date.getUTCFullYear(),
				},
			},
			data: {
				...(transaction.type === "expense"
					? { expense: { decrement: transaction.amount } }
					: { income: { decrement: transaction.amount } }),
			},
		}),

		// Update the yearHistory aggregate table
		prisma.yearHistory.update({
			where: {
				month_year_userId: {
					userId,
					month: transaction.date.getUTCMonth(),
					year: transaction.date.getUTCFullYear(),
				},
			},
			data: {
				...(transaction.type === "expense"
					? { expense: { decrement: transaction.amount } }
					: { income: { decrement: transaction.amount } }),
			},
		}),
	]);
};
