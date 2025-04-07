"use client";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";

import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

type CategoriesStatsProps = {
	from: Date;
	to: Date;
	user: User;
};

const CategoriesStats = ({ from, to, user }: CategoriesStatsProps) => {
	const categoriesQuery = useQuery<GetCategoriesStatsResponseType>({
		queryKey: ["overview", "stats", "categories", from, to],
		queryFn: () =>
			fetch(
				`/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
					to
				)}`
			).then((res) => res.json()),
	});

	const formatter = useMemo(() => {
		return GetFormatterForCurrency(user.currency);
	}, [user.currency]);

	return (
		<div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
			<SkeletonWrapper isLoading={categoriesQuery.isLoading} fullWidth>
				<CategoriesCard
					formatter={formatter}
					data={categoriesQuery.data || []}
					type="income"
				/>
			</SkeletonWrapper>
			<SkeletonWrapper isLoading={categoriesQuery.isLoading} fullWidth>
				<CategoriesCard
					formatter={formatter}
					data={categoriesQuery.data || []}
					type="expense"
				/>
			</SkeletonWrapper>
		</div>
	);
};

export default CategoriesStats;

const CategoriesCard = ({
	data,
	formatter,
	type,
}: {
	data: GetCategoriesStatsResponseType;
	formatter: Intl.NumberFormat;
	type: TransactionType;
}) => {
	const filteredData = data.filter((cat) => cat.type === type);
	const total = filteredData.reduce(
		(acc, cat) => acc + (cat._sum?.amount || 0),
		0
	);

	return (
		<Card className="h-80 w-full col-span-6">
			<CardHeader>
				<CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
					{type === "income" ? "Income" : "Expenses"} by category
				</CardTitle>
			</CardHeader>

			<div className="flex items-center justify-between gap-2">
				{filteredData.length <= 0 ? (
					<div className="flex h-60 w-full items-center justify-center flex-col px-4">
						<h4>No data for the selected period</h4>
						<p className="text-sm text-muted-foreground text-center">
							Try selecting a different period or adding new{" "}
							{type === "expense" ? "expense" : "income"}
						</p>
					</div>
				) : (
					<ScrollArea className="h-60 w-full px-4">
						<div className="flex flex-col gap-4 w-full px-4">
							{filteredData.map((cat) => {
								const amount = cat._sum?.amount || 0;
								const percentage = (amount * 100) / (total || amount);

								return (
									<div className="flex flex-col gap-2" key={cat.category}>
										<div className="flex items-center justify-between">
											<span className="flex items-center text-gray-400">
												{cat.categoryIcon} {cat.category}
												<span className="ml-2 text-xs text-muted-foreground">
													({percentage.toFixed(0)}%)
												</span>
											</span>
											<span className="text-sm text-muted-foreground">
												{formatter.format(amount)}
											</span>
										</div>

										<Progress
											value={percentage}
											indicator={
												type === "income" ? "bg-emerald-500" : "bg-rose-500"
											}
										/>
									</div>
								);
							})}
						</div>
					</ScrollArea>
				)}
			</div>
		</Card>
	);
};
