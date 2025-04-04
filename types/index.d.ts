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
