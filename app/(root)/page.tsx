import { redirect } from "next/navigation";

import { createUser } from "../select-currency/_actions/user-actions";
import Dashboard from "@/app/(root)/(components)/dashboard";

const Home = async () => {
	// Check if user has already selected a currency. if no, redirect to select currency
	const user = await createUser();

	if (!user.currency) {
		return redirect("/select-currency");
	}

	return <Dashboard user={user} />;
};

export default Home;
