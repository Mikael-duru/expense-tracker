import { Currencies } from "@/constants";

import { z } from "zod";

export const updateUserCurrencySchema = z.object({
	currency: z.custom((value) => {
		const found = Currencies.find((currency) => currency.value === value);
		if (!found) throw new Error(`Invalid currency: ${value}`);
		return value;
	}),
});
