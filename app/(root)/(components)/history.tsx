"use client";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { GetFormatterForCurrency } from "@/lib/helpers";
import HistoryPeriodSelector from "./history-period-selector";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { cn } from "@/lib/utils";

import { User } from "@prisma/client";
import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import CountUp from "react-countup";
import numeral from "numeral";

const History = ({ user }: { user: User }) => {
	const [timeFrame, setTimeFrame] = useState<Timeframe>("month");
	const [period, setPeriod] = useState<Period>({
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	});

	const formatter = useMemo(() => {
		return GetFormatterForCurrency(user.currency);
	}, [user.currency]);

	const historyDataQuery = useQuery<GetHistoryDataResponseType>({
		queryKey: ["overview", "history", timeFrame, period],
		queryFn: () =>
			fetch(
				`/api/history-data?timeFrame=${timeFrame}&year=${period.year}&month=${period.month}`
			).then((res) => res.json()),
	});

	const dataAvailable =
		historyDataQuery.data && historyDataQuery.data.length > 0;

	return (
		<section className="px-4 md:px-8">
			<div className="container mx-auto">
				<h2 className="text-3xl font-bold mt-12">History</h2>
				<Card className="col-span-12 mt-2 w-full">
					<CardHeader className="gap-2">
						<CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
							<HistoryPeriodSelector
								timeFrame={timeFrame}
								setTimeFrame={setTimeFrame}
								period={period}
								setPeriod={setPeriod}
							/>

							<div className="flex h-10 gap-2 max-sm:pt-2">
								<Badge
									variant="outline"
									className="flex items-center gap-2 text-sm"
								>
									<div className="h-4 w-4 rounded-full bg-emerald-500" />
									Income
								</Badge>
								<Badge
									variant="outline"
									className="flex items-center gap-2 text-sm"
								>
									<div className="h-4 w-4 rounded-full bg-rose-500" />
									Expenses
								</Badge>
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<SkeletonWrapper isLoading={historyDataQuery.isFetching}>
							{dataAvailable ? (
								<ResponsiveContainer width={"100%"} height={300}>
									<BarChart
										height={300}
										data={historyDataQuery.data}
										barCategoryGap={5}
										margin={{
											top: 5,
											right: 0,
											left: -20,
											bottom: 0,
										}}
									>
										<defs>
											<linearGradient
												id="incomeBar"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop offset="0" stopColor="#10b981" stopOpacity={1} />
												<stop offset="1" stopColor="#10b981" stopOpacity={0} />
											</linearGradient>
											<linearGradient
												id="expenseBar"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop offset="0" stopColor="#ef4444" stopOpacity={1} />
												<stop offset="1" stopColor="#ef4444" stopOpacity={0} />
											</linearGradient>
										</defs>
										<CartesianGrid
											strokeDasharray="5 5"
											strokeOpacity={"0.2"}
											vertical={false}
										/>
										<XAxis
											stroke="#888888"
											fontSize={12}
											tickLine={false}
											axisLine={false}
											padding={{ left: 5, right: 5 }}
											dataKey={(data) => {
												const { year, month, day } = data;
												const date = new Date(year, month, day || 1);

												if (timeFrame === "year") {
													return date.toLocaleDateString("default", {
														month: "short",
													});
												}

												return date.toLocaleDateString("default", {
													day: "2-digit",
												});
											}}
										/>
										<YAxis
											stroke="#888888"
											fontSize={12}
											tickLine={false}
											axisLine={false}
											tickFormatter={(value) => {
												return numeral(value).format("0.0a").toUpperCase();
											}}
										/>
										<Bar
											dataKey={"income"}
											label="Income"
											fill="url(#incomeBar)"
											radius={4}
											className="cursor-pointer"
										/>
										<Bar
											dataKey={"expense"}
											label="Expenses"
											fill="url(#expenseBar)"
											radius={4}
											className="cursor-pointer"
										/>
										<Tooltip
											cursor={{ opacity: 0.1 }}
											content={(props) => (
												<CustomTooltip formatter={formatter} {...props} />
											)}
										/>
									</BarChart>
								</ResponsiveContainer>
							) : (
								<Card className="flex h-[300px] items-center justify-center flex-col bg-background">
									<CardHeader className="text-center">
										<CardTitle>No data found for this month</CardTitle>
										<CardDescription>
											Try selecting a different month or adding new transactions
										</CardDescription>
									</CardHeader>
								</Card>
							)}
						</SkeletonWrapper>
					</CardContent>
				</Card>
			</div>
		</section>
	);
};

export default History;

const CustomTooltip = ({ formatter, active, payload }: any) => {
	if (!active || !payload || payload.length === 0) return null;

	const data = payload[0].payload;
	const { income, expense } = data;

	return (
		<div className="bg-background border rounded-lg p-3 shadow-md">
			<TooltipRow
				formatter={formatter}
				label="Income"
				value={income}
				bgColor="bg-emerald-500"
				textColor="text-emerald-500"
			/>
			<TooltipRow
				formatter={formatter}
				label="Expenses"
				value={expense}
				bgColor="bg-red-500"
				textColor="text-red-500"
			/>
			<TooltipRow
				formatter={formatter}
				label="Balance"
				value={income - expense}
				bgColor="bg-gray-100"
				textColor="text-foreground"
			/>
		</div>
	);
};

const TooltipRow = ({
	formatter,
	label,
	value,
	bgColor,
	textColor,
}: {
	formatter: Intl.NumberFormat;
	label: string;
	value: number;
	bgColor: string;
	textColor: string;
}) => {
	const formattingFn = useCallback(
		(value: number) => formatter.format(value),
		[formatter]
	);

	return (
		<div className="flex items-center gap-2">
			<div className={cn("size-4 rounded-full shrink-0", bgColor)} />
			<div className="flex w-full justify-between gap-8">
				<p className="text-sm text-muted-foreground">{label}</p>
				<div className={cn("text-sm font-bold", textColor)}>
					<CountUp
						duration={0.5}
						preserveValue
						end={value}
						decimals={0}
						formattingFn={formattingFn}
						className="text-sm"
					/>
				</div>
			</div>
		</div>
	);
};
