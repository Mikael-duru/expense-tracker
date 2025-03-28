"use client";

import AvatarDropdown from "@/components/avatar-dropdown";
import { auth } from "@/firebase/firebase";
import { useGetUserInfo } from "@/lib/use-get-user";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const Home = () => {
	const { user, userDetails } = useGetUserInfo();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await signOut(auth);
			router.push("/");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
			{user && (
				<AvatarDropdown
					handleLogout={handleLogout}
					user={user}
					firstName={userDetails?.firstName || ""}
					photoURL={userDetails?.photoURL || ""}
				/>
			)}
			Home
		</div>
	);
};

export default Home;
