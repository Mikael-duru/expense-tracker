import Logo from "@/components/logo";

import React, { Suspense } from "react";

const CurrencyLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<Suspense
			fallback={
				<div className="flex justify-center items-center h-screen w-full bg-background">
					<div className="h-20 w-full animate-bounce flex justify-center items-center">
						<Logo mobileText={true} />
					</div>
				</div>
			}
		>
			<div className="relative flex flex-col h-screen w-full items-center justify-center">
				{children}
			</div>
		</Suspense>
	);
};

export default CurrencyLayout;
