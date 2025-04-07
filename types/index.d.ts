declare type AuthFormType = "sign-in" | "sign-up" | "forgot-password";
declare type UserProps = {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	displayName: string;
	photoURL: string;
	imgPublicId: string;
};

declare type Currency = {
	label: string;
	value: string;
	locale: string;
};

declare type TransactionType = "income" | "expense";

declare type Timeframe = "month" | "year";

declare type Period = { month: number; year: number };

// Overview
declare type GetBalanceStatsResponseType = {
	expense: number;
	income: number;
};

declare type GetCategoriesStatsResponseType = (Prisma.PickEnumerable<
	Prisma.TransactionGroupByOutputType,
	("type" | "category" | "categoryIcon")[]
> & {
	_sum: {
		amount: number | null;
	};
})[];

// History chart
declare type HistoryData = {
	expense: number;
	income: number;
	year: number;
	month: number;
	day?: number;
};

declare type GetHistoryDataResponseType = HistoryData[] | undefined;

// year history period selector
declare type getHistoryPeriodsResponseType = number[];

// Transaction page
declare type GetTransactionHistoryResponseType = {
	formattedAmount: string;
	amount: number;
	description: string;
	date: Date;
	category: string;
	type: string;
	userId: string;
	createdAt: Date;
	id: string;
	categoryIcon: string;
	updatedAt: Date;
}[];
