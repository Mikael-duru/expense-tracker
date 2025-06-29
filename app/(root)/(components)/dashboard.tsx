"use client";

import React from "react";
import { User } from "@prisma/client";

import { useGetUserInfo } from "@/hooks/use-get-user";
import { Button } from "../../../components/ui/button";
import CreateTransactionDialog from "./create-transaction-dialog";
import Overview from "./overview";
import History from "./history";

const Dashboard = ({ user }: { user: User }) => {
	const { userDetails } = useGetUserInfo();

	return (
		<div className="h-full bg-background">
			{/* welcome and create transaction */}
			<div className="border-b bg-card px-4 md:px-8">
				<div className="container mx-auto flex flex-wrap items-center justify-between gap-6 py-8">
					{userDetails?.firstName && (
						<h1 className="text-3xl font-bold capitalize">
							hello, {userDetails?.firstName}! 👋
						</h1>
					)}

					<div className="flex items-center gap-3">
						<CreateTransactionDialog
							trigger={
								<Button
									variant="outline"
									className="max-md:px-[13px] border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
								>
									New income 🤑
								</Button>
							}
							type="income"
						/>

						<CreateTransactionDialog
							trigger={
								<Button
									variant="outline"
									className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white max-md:px-[13px]"
								>
									New expense 😤
								</Button>
							}
							type="expense"
						/>
					</div>
				</div>
			</div>

			{/* overview section */}
			<Overview user={user} />

			{/* history chart section */}
			<History user={user} />
		</div>
	);
};

export default Dashboard;
