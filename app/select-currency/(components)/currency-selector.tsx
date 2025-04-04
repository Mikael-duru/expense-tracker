"use client";

import { CurrencyComboBox } from "@/components/currency-combo-box";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetUserInfo } from "@/hooks/use-get-user";

import Link from "next/link";
import React from "react";

const SelectCurrency = () => {
	const { userDetails } = useGetUserInfo();

	return (
		<div className="container mx-auto flex flex-col items-center justify-between gap-4 max-w-2xl px-[5%]">
			<hgroup className="text-center">
				{userDetails?.firstName && (
					<h1 className="text-[28px] leading-[1] sm:text-3xl">
						Welcome,{" "}
						<span className="font-bold dark:text-amber-400 capitalize">
							{userDetails?.firstName}!
						</span>{" "}
						👋
					</h1>
				)}

				<h2 className="mt-4 text-base text-muted-foreground">
					Let&apos;s get started by setting up your currency.
				</h2>
				<h3 className="mt-2 text-sm text-muted-foreground">
					You can change this settings at any time.
				</h3>
			</hgroup>
			<Separator />

			<Card className="w-full">
				<CardHeader>
					<CardTitle>Currency</CardTitle>
					<CardDescription>
						Please select your preferred currency to proceed.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CurrencyComboBox />
				</CardContent>
			</Card>
			<Separator />
			<Button className="w-full" asChild>
				<Link href="/">I&apos;m done! Take me to the dashboard</Link>
			</Button>
			<div className="mt-8">
				<Logo mobileText={true} />
			</div>
		</div>
	);
};

export default SelectCurrency;
