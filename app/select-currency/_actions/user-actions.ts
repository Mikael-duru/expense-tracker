"use server";

import { prisma } from "@/lib/prisma";
import { updateUserCurrencySchema } from "@/schema/user-currency";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getUserId = async () => {
	const cookiesStore = await cookies();
	const userId = cookiesStore.get("__session_auth")?.value;
	return userId || null;
};

export const createUser = async () => {
	const userId = await getUserId();

	if (!userId) {
		redirect("/sign-in");
	}

	let user = await prisma.user.findUnique({
		where: {
			userId: userId,
		},
	});

	if (!user) {
		user = await prisma.user.create({
			data: {
				userId: userId,
				currency: "",
			},
		});
	}

	return user;
};

export const deleteUserFromDB = async () => {
	const userId = await getUserId();

	if (!userId) {
		return redirect("/sign-in");
	}

	const existingUser = await prisma.user.findUnique({
		where: { userId },
	});

	if (!existingUser) {
		throw new Error("User not found");
	}

	await prisma.$transaction([
		prisma.category.deleteMany({ where: { userId } }),
		prisma.transaction.deleteMany({ where: { userId } }),
		prisma.monthHistory.deleteMany({ where: { userId } }),
		prisma.yearHistory.deleteMany({ where: { userId } }),
		prisma.user.delete({ where: { userId } }),
	]);

	await prisma.$disconnect();
};

export const updateUserCurrency = async (currency: string) => {
	const parsedBody = updateUserCurrencySchema.safeParse({ currency });
	if (!parsedBody.success) throw Error(parsedBody.error.message);

	const userId = await getUserId();

	if (!userId) redirect("/sign-in");

	const user = await prisma.user.update({
		where: {
			userId: userId,
		},
		data: {
			currency,
		},
	});

	return user;
};
