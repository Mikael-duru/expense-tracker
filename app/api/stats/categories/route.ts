import { getUserId } from "@/app/select-currency/_actions/user-actions";
import { prisma } from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";

import { redirect } from "next/navigation";

export const GET = async (request: Request) => {
	const userId = await getUserId();
	if (!userId) redirect("/sign-in");

	const { searchParams } = new URL(request.url);
	const from = searchParams.get("from");
	const to = searchParams.get("to");

	const queryParams = OverviewQuerySchema.safeParse({ from, to });
	if (!queryParams.success) {
		throw new Error(queryParams.error.message);
	}

	// const stats = await getCategoriesStats(
	// 	userId,
	// 	queryParams.data.from,
	// 	queryParams.data.to
	// );

	const stats = await prisma.transaction.groupBy({
		by: ["type", "category", "categoryIcon"],
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
		orderBy: {
			_sum: {
				amount: "desc",
			},
		},
	});

	return Response.json(stats);
};

// export type GetCategoriesStatsResponseType = Awaited<
// 	ReturnType<typeof getCategoriesStats>
// >;

// const getCategoriesStats = async (userId: string, from: Date, to: Date) => {
// 	const stats = await prisma.transaction.groupBy({
// 		by: ["type", "category", "categoryIcon"],
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
// 		orderBy: {
// 			_sum: {
// 				amount: "desc",
// 			},
// 		},
// 	});

// 	return stats;
// };
