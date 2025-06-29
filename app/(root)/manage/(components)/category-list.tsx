import React from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, TrendingDown, TrendingUp } from "lucide-react";
import { Category } from "@prisma/client";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CreateCategoryDialog from "../../(components)/create-category-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CategoryCard from "./category-card";

const CategoryList = ({ type }: { type: TransactionType }) => {
	const categoriesQuery = useQuery({
		queryKey: ["categories", type],
		queryFn: () =>
			fetch(`/api/categories?type=${type}`).then((res) => res.json()),
	});

	const dataAvailable =
		categoriesQuery.data && categoriesQuery.data?.length > 0;

	return (
		<SkeletonWrapper isLoading={categoriesQuery.isLoading}>
			<Card>
				<CardHeader className="border-b">
					<CardTitle className="flex items-center justify-between flex-wrap gap-5">
						<div className="flex items-center gap-2">
							{type === "income" ? (
								<>
									<TrendingUp className="size-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
								</>
							) : (
								<>
									<TrendingDown className="size-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
								</>
							)}
							<div>
								{type === "income" ? "Income" : "Expense"} Categories
								<p className="text-sm text-muted-foreground">
									Sorted by name ({categoriesQuery.data?.length})
								</p>
							</div>
						</div>

						<CreateCategoryDialog
							type={type}
							successCallback={() => categoriesQuery.refetch()}
							trigger={
								<Button className="gap-2 text-sm">
									<PlusSquare size={16} />
									Create Category
								</Button>
							}
						/>
					</CardTitle>
				</CardHeader>

				{!dataAvailable ? (
					<div className="h-40 w-full flex flex-col items-center justify-center">
						<p>
							No
							<span
								className={cn(
									"m-1",
									type === "income" ? "text-emerald-500" : "text-red-500"
								)}
							>
								{type}
							</span>
							categories yet.
						</p>
						<p className="text-sm text-muted-foreground">
							Click the button above to create one.
						</p>
					</div>
				) : (
					<div className="grid grid-flow-col gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{categoriesQuery.data?.map((category: Category) => (
							<CategoryCard key={category.name} category={category} />
						))}
					</div>
				)}
			</Card>
		</SkeletonWrapper>
	);
};

export default CategoryList;
