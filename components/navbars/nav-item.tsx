"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { LucideIcon } from "lucide-react";

import { buttonVariants } from "../ui/button";

type NavItemProps = {
	label: string;
	link: string;
	icon?: LucideIcon;
	showIcon?: boolean;
	clickCallback?: () => void;
};

const NavItem = ({
	label,
	link,
	icon: Icon,
	showIcon = false,
	clickCallback,
}: NavItemProps) => {
	const pathname = usePathname();
	const isActive = pathname === link;

	return (
		<li className="relative flex items-center">
			<Link
				href={link}
				className={cn(
					buttonVariants({ variant: "ghost" }),
					"w-full justify-start text-lg md:text-base lg:text-lg text-muted-foreground hover:text-foreground",
					isActive && "text-foreground"
				)}
				onClick={() => {
					if (clickCallback) clickCallback();
				}}
			>
				{showIcon && Icon && <Icon className="mr-2 !size-[18px]" />}
				<span className="capitalize">{label}</span>
			</Link>
			{isActive && (
				<div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 rounded-xl h-0.5 w-[80%] bg-foreground hidden md:block " />
			)}
		</li>
	);
};

export default NavItem;
