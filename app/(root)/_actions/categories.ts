"use server";

import { getUserId } from "@/app/select-currency/_actions/user-actions";
import { prisma } from "@/lib/prisma";
import {
	CreateCategorySchema,
	CreateCategorySchemaType,
	DeleteCategorySchema,
	DeleteCategorySchemaType,
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

	// Normalize category name to lowercase
	const categoryName = name.toLowerCase();

	// Check if category already exists
	const existingCategory = await prisma.category.findFirst({
		where: {
			userId,
			name: categoryName,
		},
	});

	if (existingCategory) {
		throw new Error("Category name already exists.");
	}

	// Create the new category
	return await prisma.category.create({
		data: {
			userId,
			name: categoryName,
			icon,
			type,
		},
	});
};

export const deleteCategory = async (form: DeleteCategorySchemaType) => {
	// zod validation
	const parsedBody = DeleteCategorySchema.safeParse(form);
	if (!parsedBody.success) throw new Error("bad request");

	const userId = await getUserId();
	if (!userId) {
		redirect("/sign-in");
	}

	const { name, type } = parsedBody.data;
	return await prisma.category.delete({
		where: {
			name_userId_type: {
				userId,
				name,
				type,
			},
		},
	});
};
