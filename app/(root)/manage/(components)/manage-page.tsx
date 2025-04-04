"use client";

import { CurrencyComboBox } from "@/components/currency-combo-box";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import React from "react";
import CategoryList from "./category-list";

const ManagePage = () => {
	return (
		<>
			{/* Header */}
			<section className="border-b bg-card px-4 md:px-8">
				<div className="container mx-auto flex flex-wrap items-center justify-between gap-6 py-8">
					<div>
						<h2 className="text-3xl font-bold">Manage</h2>
						<p className="text-muted-foreground">
							Manage your account currency and categories
						</p>
					</div>
				</div>
			</section>
			<section className="px-4 md:px-8">
				<div className="container mx-auto flex flex-col gap-4 py-4">
					<Card>
						<CardHeader>
							<CardTitle>Currency</CardTitle>
							<CardDescription>
								Set your default currency for transactions
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="w-full max-w-52">
								<CurrencyComboBox />
							</div>
						</CardContent>
					</Card>
					<CategoryList type="income" />
					<CategoryList type="expense" />
				</div>
			</section>
		</>
	);
};

export default ManagePage;
