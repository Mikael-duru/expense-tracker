import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "BudgetWise | Budget Tracker",
	description:
		"Take control of your spending with Expense Tracker Pro. Monitor your financial habits, set budgets, and visualize your expenses.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				{children} <Toaster richColors={true} />
			</body>
		</html>
	);
}
