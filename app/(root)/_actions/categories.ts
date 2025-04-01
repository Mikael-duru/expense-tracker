"use server";

import { getUserId } from "@/app/select-currency/_actions/user-actions";
import { prisma } from "@/lib/prisma";
import {
	CreateCategorySchema,
	CreateCategorySchemaType,
} from "@/schema/categories";

import { redirect } from "next/navigation";

export const createCategory = async (form: CreateCategorySchemaType) => {
	// zod validation
	const parsedBody = CreateCategorySchema.safeParse(form);
	if (!parsedBody.success) throw new Error("bad request");

	const userId = await getUserId();
	if (!userId) {
		redirect("/sign-in");
	}

	const { name, icon, type } = parsedBody.data;
	return await prisma.category.create({
		data: {
			userId,
			name,
			icon,
			type,
		},
	});
};
