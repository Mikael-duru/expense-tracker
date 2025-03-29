"use client";

import React from "react";
import { LogOut, Settings, UserRound, UserRoundCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUserInfo } from "@/lib/use-get-user";
import { auth } from "@/firebase/firebase";
import Link from "next/link";

const UserButton = () => {
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

	return !user ? (
		<Link
			href={"/sign-in"}
			className="hover:bg-muted p-2 rounded-full border border-muted"
		>
			<UserRound size={20} />
		</Link>
	) : (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage
						src={userDetails?.photoURL || (user?.photoURL as string)}
						alt="user profile pic"
					/>
					<AvatarFallback>
						<UserRoundCheck size={20} />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="mr-5 mt-1">
				<DropdownMenuLabel>
					<div className="flex items-center justify-center gap-4">
						<Avatar className="w-12 h-12 shrink-0">
							<AvatarImage
								src={userDetails?.photoURL || (user?.photoURL as string)}
								alt="user profile pic"
							/>
							<AvatarFallback>
								<UserRoundCheck size={24} />
							</AvatarFallback>
						</Avatar>
						<div>
							<h1 className="capitalize pb-1">
								Hi! {userDetails?.firstName} 👋
							</h1>
							<p className="text-xs lowercase">{userDetails?.email}</p>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => router.push("/account")}
				>
					<div className="flex items-center justify-center gap-4">
						<div className="flex items-center justify-center w-12 h-12 shrink-0">
							<Settings />
						</div>
						<p>Manage account</p>
					</div>
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer hover:text-red-500 dark:hover:text-red-500"
					onClick={handleLogout}
				>
					<div className="flex items-center justify-center gap-4">
						<div className="flex items-center justify-center w-12 h-12 shrink-0">
							<LogOut />
						</div>
						<p>Sign out</p>
					</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserButton;
