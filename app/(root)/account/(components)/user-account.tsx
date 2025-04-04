"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import UserProfile from "./user-profile";
import { useGetUserInfo } from "@/hooks/use-get-user";
import ChangePassword from "./change-password";
import { User } from "firebase/auth";

const UserAccount = () => {
	const { user, userDetails } = useGetUserInfo();
	const [activeTab, setActiveTab] = useState("account");

	useEffect(() => {
		const savedTab = localStorage.getItem("activeTab");
		if (savedTab) setActiveTab(savedTab);

		return () => {
			localStorage.removeItem("activeTab");
		};
	}, []);

	// Update localStorage when the tab changes
	const handleTabChange = (value: string) => {
		setActiveTab(value);
		localStorage.setItem("activeTab", value);
	};

	return (
		<div className="px-4 md:px-8">
			<div className="container mx-auto flex flex-col items-center justify-center py-8 gap-6 max-w-3xl">
				<Tabs
					value={activeTab}
					onValueChange={handleTabChange}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="account" className="flex justify-center gap-2">
							Account
						</TabsTrigger>
						<TabsTrigger value="password" className="flex justify-center gap-2">
							Password
						</TabsTrigger>
					</TabsList>
					{/* profile update */}
					<TabsContent value="account">
						<UserProfile
							user={user as User}
							userDetails={userDetails as UserProps}
						/>
					</TabsContent>
					{/* change password */}
					<TabsContent value="password">
						<ChangePassword />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default UserAccount;
