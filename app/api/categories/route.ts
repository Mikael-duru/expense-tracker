import { getUserId } from "@/app/select-currency/_actions/user-actions";
import { prisma } from "@/lib/prisma";

import { redirect } from "next/navigation";
import { z } from "zod";

export const GET = async (request: Request) => {
	const userId = await getUserId();

	if (!userId) redirect("/sign-in");

	const { searchParams } = new URL(request.url);
	const paramType = searchParams.get("type");

	const validator = z.enum(["expense", "income"]).nullable();

	const queryParams = validator.safeParse(paramType);
	if (!queryParams.success) {
		return Response.json(queryParams.error, {
			status: 400,
		});
	}

	const type = queryParams.data;

	const categories = await prisma.category.findMany({
		where: {
			userId,
			...(type && { type }), // include type in the filter if it is defined
		},
		orderBy: {
			name: "asc",
		},
	});

	return Response.json(categories);
};
