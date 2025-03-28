"use client";

import React, { useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import Logo from "../logo";
import NavItem from "./nav-item";
import { NavItems } from "@/constants";
import { ThemeSwitcherBtn } from "../theme-toggle-btn";
import UserButton from "../user-button";

const MobileNavbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="border-separate bg-background shadow-sm dark:shadow-lg md:hidden">
			<nav className="container mx-auto flex items-center justify-between px-[5%] h-[70px] min-h-[50px]">
				<div className="flex items-center gap-x-2">
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button variant={"ghost"} size={"icon"}>
								<Menu />
							</Button>
						</SheetTrigger>
						<SheetContent className="" side={"left"}>
							<SheetTitle className="pt-4">
								<Logo mobileText={true} />
							</SheetTitle>
							<SheetDescription></SheetDescription>
							<ul className="flex flex-col gap-2 pt-4">
								{NavItems.map((item) => (
									<NavItem
										key={item.label}
										label={item.label}
										link={item.link}
										icon={item.icon}
										showIcon={true}
										clickCallback={() => setIsOpen((prev) => !prev)}
									/>
								))}
							</ul>
						</SheetContent>
					</Sheet>
					<Logo mobileText={true} hideIcon={true} />
				</div>

				<div className="flex items-center gap-3">
					<ThemeSwitcherBtn />
					<UserButton />
				</div>
			</nav>
		</div>
	);
};

export default MobileNavbar;
