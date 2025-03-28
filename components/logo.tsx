import { PiggyBank } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = ({ mobileText = false, hideIcon = false }) => {
	return (
		<Link href="/" className="flex items-center gap-2">
			<PiggyBank
				className={`${
					hideIcon ? "hidden" : "size-11 stroke stroke-[1.5] stroke-amber-500"
				}`}
			/>
			<p
				className={`bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-bold leading-tight tracking-tighter ${
					mobileText ? "text-2xl lg:text-3xl" : "text-3xl"
				}`}
			>
				BudgetWise
			</p>
		</Link>
	);
};

export default Logo;
