import { z } from "zod";

export const createTransactionSchema = z.object({
	amount: z.coerce.number().positive().multipleOf(0.01),
	description: z.string().optional(),
	date: z.coerce.date(),
	category: z.string({
		message: "Category is required",
	}),
	type: z.union([z.literal("expense"), z.literal("income")]),
});

// for server-side use
export type createTransactionSchemaType = z.infer<
	typeof createTransactionSchema
>;
