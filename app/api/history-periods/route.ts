import { getUserId } from "@/app/select-currency/_actions/user-actions";
import { prisma } from "@/lib/prisma";

import { redirect } from "next/navigation";

export const GET = async (request: Request) => {
	const userId = await getUserId();
	if (!userId) {
		redirect("/sign-in");
	}

	const periods = await getHistoryPeriods(userId);
	return new Response(JSON.stringify(periods));
};

export type getHistoryPeriodsResponseType = Awaited<
	ReturnType<typeof getHistoryPeriods>
>;

const getHistoryPeriods = async (userId: string) => {
	const result = await prisma.monthHistory.findMany({
		where: {
			userId,
		},
		select: {
			year: true,
		},
		distinct: ["year"],
		orderBy: [
			{
				year: "desc",
			},
		],
	});

	const years = result.map((el) => el.year);
	if (years.length === 0) {
		// return the current year
		return [new Date().getFullYear()];
	}

	return years;
};
