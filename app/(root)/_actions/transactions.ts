"use server";

import { getUserId } from "@/app/select-currency/_actions/user-actions";
import { prisma } from "@/lib/prisma";
import {
	createTransactionSchema,
	createTransactionSchemaType,
} from "@/schema/transaction";
import { redirect } from "next/navigation";

export const createTransaction = async (form: createTransactionSchemaType) => {
	const parsedBody = createTransactionSchema.safeParse(form);
	if (!parsedBody.success) throw new Error("bad request");

	const userId = await getUserId();
	if (!userId) {
		redirect("/sign-in");
	}

	const { amount, description, date, type, category } = parsedBody.data;

	const categoryRow = await prisma.category.findFirst({
		where: {
			userId: userId,
			name: category,
		},
	});

	if (!categoryRow) {
		throw new Error("Category not found");
	}

	// simultaneously create transaction and update the monthHistory and yearHistory aggregate table using prisma.$transaction (a database transaction).
	await prisma.$transaction([
		// create user transaction
		prisma.transaction.create({
			data: {
				userId: userId,
				amount,
				description: description || "",
				date,
				type,
				category: categoryRow.name,
				categoryIcon: categoryRow.icon,
			},
		}),

		// update monthHistory aggregate tables
		prisma.monthHistory.upsert({
			where: {
				day_month_year_userId: {
					userId: userId,
					day: date.getUTCDate(),
					month: date.getUTCMonth(),
					year: date.getUTCFullYear(),
				},
			},
			create: {
				userId: userId,
				day: date.getUTCDate(),
				month: date.getUTCMonth(),
				year: date.getUTCFullYear(),
				expense: type === "expense" ? amount : 0,
				income: type === "income" ? amount : 0,
			},
			update: {
				expense: {
					increment: type === "expense" ? amount : 0,
				},
				income: {
					increment: type === "income" ? amount : 0,
				},
			},
		}),

		// update yearHistory aggregate tables
		prisma.yearHistory.upsert({
			where: {
				month_year_userId: {
					userId: userId,
					month: date.getUTCMonth(),
					year: date.getUTCFullYear(),
				},
			},
			create: {
				userId: userId,
				month: date.getUTCMonth(),
				year: date.getUTCFullYear(),
				expense: type === "expense" ? amount : 0,
				income: type === "income" ? amount : 0,
			},
			update: {
				expense: {
					increment: type === "expense" ? amount : 0,
				},
				income: {
					increment: type === "income" ? amount : 0,
				},
			},
		}),
	]);
};
