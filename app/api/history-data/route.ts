import { getUserId } from "@/app/select-currency/_actions/user-actions";
import { prisma } from "@/lib/prisma";

import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";

const getHistoryQuerySchema = z.object({
	timeFrame: z.enum(["month", "year"]),
	year: z.coerce.number().min(2000).max(3000),
	month: z.coerce.number().min(0).max(11).default(0),
});

export const GET = async (request: Request) => {
	const userId = await getUserId();
	if (!userId) redirect("/sign-in");

	const { searchParams } = new URL(request.url);
	const queryParams = getHistoryQuerySchema.safeParse({
		timeFrame: searchParams.get("timeFrame"),
		year: searchParams.get("year"),
		month: searchParams.get("month"),
	});
	if (!queryParams.success) {
		throw new Error(queryParams.error.message);
	}

	const { timeFrame, year, month } = queryParams.data;
	const history: HistoryData[] = [];

	// group transaction history by year
	if (timeFrame === "year") {
		const result = await prisma.yearHistory.groupBy({
			by: ["month"],
			where: { userId, year },
			_sum: { expense: true, income: true },
			orderBy: { month: "asc" },
		});

		if (!result || result.length === 0) return Response.json([]);

		for (let i = 0; i < 12; i++) {
			const monthData = result.find((row) => row.month === i);
			history.push({
				year,
				month: i,
				expense: monthData?._sum.expense || 0,
				income: monthData?._sum.income || 0,
			});
		}
	}

	// group transaction history by month
	if (timeFrame === "month") {
		const result = await prisma.monthHistory.groupBy({
			by: ["day"],
			where: { userId, year, month },
			_sum: { expense: true, income: true },
			orderBy: { day: "asc" },
		});

		if (!result || result.length === 0) return Response.json([]);

		const daysInMonth = getDaysInMonth(new Date(year, month));

		for (let i = 1; i <= daysInMonth; i++) {
			const dayData = result.find((row) => row.day === i);
			history.push({
				year,
				month,
				day: i,
				expense: dayData?._sum.expense || 0,
				income: dayData?._sum.income || 0,
			});
		}
	}

	return Response.json(history);
};
