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
	const timeFrame = searchParams.get("timeFrame");
	const year = searchParams.get("year");
	const month = searchParams.get("month");

	const queryParams = getHistoryQuerySchema.safeParse({
		timeFrame,
		year,
		month,
	});
	if (!queryParams.success) {
		throw new Error(queryParams.error.message);
	}
	const data = await getHistoryData(userId, queryParams.data.timeFrame, {
		year: queryParams.data.year,
		month: queryParams.data.month,
	});

	return Response.json(data);
};

export type GetHistoryDataResponseType = Awaited<
	ReturnType<typeof getHistoryData>
>;

const getHistoryData = async (
	userId: string,
	timeFrame: Timeframe,
	period: Period
) => {
	switch (timeFrame) {
		case "year":
			return await getYearlyHistoryData(userId, period.year);
			break;
		case "month":
			return await getMonthlyHistoryData(userId, period.year, period.month);
			break;
		default:
			break;
	}
};

type HistoryData = {
	expense: number;
	income: number;
	year: number;
	month: number;
	day?: number;
};

const getYearlyHistoryData = async (userId: string, year: number) => {
	const result = await prisma.yearHistory.groupBy({
		by: ["month"],
		where: {
			userId,
			year,
		},
		_sum: {
			expense: true,
			income: true,
		},
		orderBy: {
			month: "asc",
		},
	});

	if (!result || result.length === 0) return [];

	const history: HistoryData[] = [];

	for (let i = 0; i < 12; i++) {
		let expense = 0;
		let income = 0;

		const month = result.find((row) => row.month === i);
		if (month) {
			expense = month._sum.expense || 0;
			income = month._sum.income || 0;
		}

		history.push({
			year,
			month: i,
			expense,
			income,
		});
	}

	return history;
};

const getMonthlyHistoryData = async (
	userId: string,
	year: number,
	month: number
) => {
	const result = await prisma.monthHistory.groupBy({
		by: ["day"],
		where: {
			userId,
			year,
			month,
		},
		_sum: {
			expense: true,
			income: true,
		},
		orderBy: [
			{
				day: "asc",
			},
		],
	});

	if (!result || result.length === 0) return [];

	const history: HistoryData[] = [];
	const daysInMonth = getDaysInMonth(new Date(year, month));

	for (let i = 1; i <= daysInMonth; i++) {
		let expense = 0;
		let income = 0;

		const day = result.find((row) => row.day === i);
		if (day) {
			expense = day._sum.expense || 0;
			income = day._sum.income || 0;
		}

		history.push({
			expense,
			income,
			year,
			month,
			day: i,
		});
	}

	return history;
};
