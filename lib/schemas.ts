import { Currencies } from "@/constants";
import { z } from "zod";

export const formSchema = (type: string) =>
	z.object({
		// sign up only
		firstName:
			type !== "sign-up"
				? z.string().optional()
				: z.string().min(3, {
						message: "First name is required.",
				  }),
		lastName:
			type !== "sign-up"
				? z.string().optional()
				: z.string().min(3, {
						message: "Last name is required.",
				  }),

		// for sign up, sign in, and forgot password
		email:
			type === "change-password" ? z.string().optional() : z.string().email(),

		// both sign up and sign in
		password:
			type === "forgot-password" || type === "change-password"
				? z.string().optional()
				: z.string().min(6, {
						message:
							type === "sign-in"
								? "Please enter your password (must contain at least 6 characters)."
								: "Password is required (must contain at least 6 characters).",
				  }),

		// change password only
		currentPassword:
			type !== "change-password"
				? z.string().optional()
				: z.string().min(6, {
						message:
							"Please enter your password (must contain at least 6 characters).",
				  }),
		newPassword:
			type !== "change-password"
				? z.string().optional()
				: z.string().min(6, {
						message:
							"Please enter a new password (must contain at least 6 characters).",
				  }),
	});

export const updateUserCurrencySchema = z.object({
	currency: z.custom((value) => {
		const found = Currencies.find((currency) => currency.value === value);
		if (!found) throw new Error(`Invalid currency: ${value}`);
		return value;
	}),
});
