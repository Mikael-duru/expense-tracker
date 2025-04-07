import { getUserId } from "@/app/select-currency/_actions/user-actions";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";

import { redirect } from "next/navigation";

export const GET = async (request: Request) => {
	const userId = await getUserId();
	if (!userId) redirect("/sign-in");

	const { searchParams } = new URL(request.url);
	const from = searchParams.get("from");
	const to = searchParams.get("to");

	const queryParams = OverviewQuerySchema.safeParse({
		from,
		to,
	});
	if (!queryParams.success) {
		return Response.json(queryParams.error.message, {
			status: 400,
		});
	}

	const user = await prisma.user.findUnique({
		where: { userId },
	});

	if (!user) throw new Error("User not found");

	const formatter = GetFormatterForCurrency(user.currency);

	const transactions = await prisma.transaction.findMany({
		where: {
			userId,
			date: {
				gte: queryParams.data.from,
				lte: queryParams.data.to,
			},
		},
		orderBy: {
			date: "desc",
		},
	});

	const userTransactions = transactions.map((transaction) => ({
		...transaction,
		formattedAmount: formatter.format(transaction.amount),
	}));

	return Response.json(userTransactions);
};
