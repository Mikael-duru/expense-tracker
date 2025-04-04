import { getHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useQuery } from "@tanstack/react-query";
import React from "react";

type HistoryPeriodSelectorProps = {
	period: Period;
	setPeriod: (period: Period) => void;
	timeFrame: Timeframe;
	setTimeFrame: (timeframe: Timeframe) => void;
};

const HistoryPeriodSelector = ({
	period,
	setPeriod,
	timeFrame,
	setTimeFrame,
}: HistoryPeriodSelectorProps) => {
	const historyPeriods = useQuery<getHistoryPeriodsResponseType>({
		queryKey: ["overview", "history", "periods"],
		queryFn: () => fetch("/api/history-periods").then((res) => res.json()),
	});

	return (
		<div className="flex flex-wrap items-start sm:items-center gap-4">
			<SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
				<Tabs
					value={timeFrame}
					onValueChange={(value) => setTimeFrame(value as Timeframe)}
				>
					<TabsList>
						<TabsTrigger value="month">Monthly</TabsTrigger>
						<TabsTrigger value="year">Yearly</TabsTrigger>
					</TabsList>
				</Tabs>
			</SkeletonWrapper>
			<div className="flex-grow flex items-center gap-2">
				<SkeletonWrapper
					isLoading={historyPeriods.isFetching}
					fullWidth={false}
				>
					<YearSelector
						period={period}
						setPeriod={setPeriod}
						years={historyPeriods.data || []}
					/>
				</SkeletonWrapper>
				{timeFrame === "month" && (
					<SkeletonWrapper
						isLoading={historyPeriods.isFetching}
						fullWidth={false}
					>
						<MonthSelector period={period} setPeriod={setPeriod} />
					</SkeletonWrapper>
				)}
			</div>
		</div>
	);
};

export default HistoryPeriodSelector;

const YearSelector = ({
	period,
	setPeriod,
	years,
}: {
	period: Period;
	setPeriod: (period: Period) => void;
	years: getHistoryPeriodsResponseType;
}) => {
	return (
		<Select
			value={period.year.toString()}
			onValueChange={(value) => {
				setPeriod({
					month: period.month,
					year: parseInt(value),
				});
			}}
		>
			<SelectTrigger className="w-full sm:w-[180px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{years.map((year) => (
					<SelectItem key={year} value={year.toString()}>
						{year}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

const MonthSelector = ({
	period,
	setPeriod,
}: {
	period: Period;
	setPeriod: (period: Period) => void;
}) => {
	return (
		<Select
			value={period.month.toString()}
			onValueChange={(value) => {
				setPeriod({
					month: parseInt(value),
					year: period.year,
				});
			}}
		>
			<SelectTrigger className="w-full min-w-[100px] sm:w-[180px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
					const monthString = new Date(period.year, month, 1).toLocaleString(
						"default",
						{ month: "long" }
					);
					return (
						<SelectItem key={month} value={month.toString()}>
							{monthString}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
};
