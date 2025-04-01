"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";

import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";
import React, { ReactNode, useCallback, useMemo } from "react";
import CountUp from "react-countup";

type StatsCardsProps = {
	from: Date;
	to: Date;
	user: User;
};

const StatsCards = ({ from, to, user }: StatsCardsProps) => {
	const statsQuery = useQuery<GetBalanceStatsResponseType>({
		queryKey: ["overview", "stats", from, to],
		queryFn: () =>
			fetch(
				`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
			).then((res) => res.json()),
	});

	const formatter = useMemo(() => {
		return GetFormatterForCurrency(user.currency);
	}, [user.currency]);

	const income = statsQuery.data?.income || 0;
	const expense = statsQuery.data?.expense || 0;
	const balance = income - expense;

	return (
		<SkeletonWrapper isLoading={statsQuery.isLoading} fullWidth>
			<div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				<StatsCard
					formatter={formatter}
					value={income}
					title="Income"
					Icon={
						<ArrowUp className="size-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
					}
				/>
				<StatsCard
					formatter={formatter}
					value={expense}
					title="Expense"
					Icon={
						<ArrowDown className="size-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
					}
				/>
				<StatsCard
					formatter={formatter}
					value={balance}
					title="Balance"
					Icon={
						<Wallet className="size-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
					}
				/>
			</div>
		</SkeletonWrapper>
	);
};

export default StatsCards;

const StatsCard = ({
	value,
	title,
	formatter,
	Icon,
}: {
	value: number;
	title: string;
	formatter: Intl.NumberFormat;
	Icon: ReactNode;
}) => {
	const formatFn = useCallback(
		(value: number) => formatter.format(value),
		[formatter]
	);

	return (
		<Card className="flex items-center gap-2 p-4 h-24 w-full">
			{Icon}
			<div className="flex flex-col items-start gap-0">
				<h3 className="text-muted-foreground">{title}</h3>
				<CountUp
					preserveValue
					redraw={false}
					end={value}
					decimals={2}
					formattingFn={formatFn}
					className="text-2xl"
				/>
			</div>
		</Card>
	);
};
