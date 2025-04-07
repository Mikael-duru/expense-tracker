import { redirect } from "next/navigation";

import { getUserId } from "@/app/select-currency/_actions/user-actions";
import { OverviewQuerySchema } from "@/schema/overview";
import { prisma } from "@/lib/prisma";

export const GET = async (request: Request) => {
	const userId = await getUserId();
	if (!userId) redirect("/sign-in");

	const { searchParams } = new URL(request.url);
	const from = searchParams.get("from");
	const to = searchParams.get("to");

	const queryParams = OverviewQuerySchema.safeParse({ from, to });
	if (!queryParams.success) {
		return Response.json(queryParams.error.message, {
			status: 400,
		});
	}

	const totals = await prisma.transaction.groupBy({
		by: ["type"],
		where: {
			userId,
			date: {
				gte: queryParams.data.from,
				lte: queryParams.data.to,
			},
		},
		_sum: {
			amount: true,
		},
	});

	return Response.json({
		expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
		income: totals.find((t) => t.type === "income")?._sum.amount || 0,
	});

	// const stats = await getBalanceStats(
	// 	userId,
	// 	queryParams.data.from,
	// 	queryParams.data.to
	// );

	// return Response.json(stats);
};

// export type GetBalanceStatsResponseType = Awaited<
// 	ReturnType<typeof getBalanceStats>
// >;

// export const getBalanceStats = async (userId: string, from: Date, to: Date) => {
// 	const totals = await prisma.transaction.groupBy({
// 		by: ["type"],
// 		where: {
// 			userId,
// 			date: {
// 				gte: from,
// 				lte: to,
// 			},
// 		},
// 		_sum: {
// 			amount: true,
// 		},
// 	});

// 	return {
// 		expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
// 		income: totals.find((t) => t.type === "income")?._sum.amount || 0,
// 	};
// };
