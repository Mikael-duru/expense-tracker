import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-providers";

const inter = Inter({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "BudgetWise | Budget Tracker",
	description:
		"Take control of your spending with Expense Tracker Pro. Monitor your financial habits, set budgets, and visualize your expenses. MikaelCodes - 2025",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					{children} <Toaster richColors={true} />
				</ThemeProvider>
			</body>
		</html>
	);
}
