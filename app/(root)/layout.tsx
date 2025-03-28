import Header from "@/components/header";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="relative flex flex-col h-screen w-full">
			{/* Header */}
			<Header />

			<main className="w-full">{children}</main>
		</div>
	);
};

export default MainLayout;
