"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/constants";
import StatsCards from "./stats-cards";
import CategoriesStats from "./categories-stats";

import { User } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";

const Overview = ({ user }: { user: User }) => {
	const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
		from: startOfMonth(new Date()),
		to: new Date(),
	});

	return (
		<section className="px-4 md:px-8">
			<div className="container mx-auto flex flex-wrap items-end justify-between gap-2 py-6">
				<h2 className="text-3xl font-bold">Overview</h2>
				<DateRangePicker
					initialDateFrom={dateRange.from}
					initialDateTo={dateRange.to}
					showCompare={false}
					onUpdate={(values) => {
						const { from, to } = values.range;

						// update the date range only if both dates are set
						if (!from || !to) return;
						if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
							toast.error(
								`The selected date range is too big. Max allowed allowed range is ${MAX_DATE_RANGE_DAYS} days!`
							);
							return;
						}

						setDateRange({ from, to });
					}}
				/>
			</div>
			<div className="container mx-auto flex flex-col gap-3 w-full">
				<StatsCards user={user} from={dateRange.from} to={dateRange.to} />

				<CategoriesStats user={user} from={dateRange.from} to={dateRange.to} />
			</div>
		</section>
	);
};

export default Overview;
