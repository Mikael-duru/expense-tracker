"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/constants";
import TransactionsTable from "./transactions-table";

import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";

const TransactionsComponent = () => {
	const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
		from: startOfMonth(new Date()),
		to: new Date(),
	});

	return (
		<>
			<div className="border-b bg-card px-4 md:px-8">
				<div className="container mx-auto flex flex-wrap items-center justify-between gap-6 py-8">
					<h2 className="text-3xl font-bold">Transactions history</h2>

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
			</div>
			<div className="px-4 md:px-8">
				<div className="container mx-auto">
					<TransactionsTable from={dateRange.from} to={dateRange.to} />
				</div>
			</div>
		</>
	);
};

export default TransactionsComponent;
