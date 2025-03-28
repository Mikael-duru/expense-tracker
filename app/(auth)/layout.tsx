import Logo from "@/components/logo";

import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center p-6 space-y-8">
			<Logo />
			{children}
		</div>
	);
};

export default AuthLayout;
