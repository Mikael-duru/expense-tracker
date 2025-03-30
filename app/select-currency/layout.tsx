import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";

const CurrencyLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<Suspense
			fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
		>
			<div className="relative flex flex-col h-screen w-full items-center justify-center">
				{children}
			</div>
		</Suspense>
	);
};

export default CurrencyLayout;
