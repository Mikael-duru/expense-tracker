"use server";

import { cookies } from "next/headers";

export const storeUserId = async (userId: string) => {
	try {
		// Set the cookie on the server
		const cookieStore = await cookies();
		cookieStore.set("__session_auth", userId, {
			httpOnly: true, // keeps it safe from client-side JS
			secure: true,
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 24, // 1 day
		});
	} catch (error) {
		console.error("Error storing user ID:", error);
	}
};
