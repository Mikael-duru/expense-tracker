import React from "react";

import SelectCurrency from "./(components)/currency-selector";
import { createUser } from "./_actions/user-actions";
import { redirect } from "next/navigation";

const SelectCurrencyPage = async () => {
	// Check if user has already selected a currency. if yes, redirect to dashboard
	const user = await createUser();

	if (user.currency) {
		return redirect("/");
	}

	return <SelectCurrency />;
};

export default SelectCurrencyPage;
