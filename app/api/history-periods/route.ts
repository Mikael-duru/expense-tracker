// import { getHistoryPeriods } from "@/app/(root)/_actions/history";
import { getUserId } from "@/app/select-currency/_actions/user-actions";
import { prisma } from "@/lib/prisma";

import { redirect } from "next/navigation";

export const GET = async (request: Request) => {
	const userId = await getUserId();
	if (!userId) {
		redirect("/sign-in");
	}

	// get all the years that have transactions for calender (year period selector)
	const periods = await prisma.monthHistory.findMany({
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

	const years = periods.map((p) => p.year);
	if (years.length === 0) {
		// return the current year
		return new Response(JSON.stringify([new Date().getFullYear()]));
	}

	return new Response(JSON.stringify(years));
};
