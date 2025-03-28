import { PiggyBank } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
	return (
		<Link href="/" className="flex items-center gap-2">
			<PiggyBank className="size-11 stroke stroke-[1.5] stroke-amber-500" />
			<p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent text-3xl font-bold leading-tight tracking-tighter">
				BudgetWise
			</p>
		</Link>
	);
};

export default Logo;
