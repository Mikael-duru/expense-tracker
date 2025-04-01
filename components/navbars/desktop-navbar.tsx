import React from "react";

import Logo from "../logo";
import { NavItems } from "@/constants";
import NavItem from "./nav-item";
import UserButton from "../user-button";
import { ThemeSwitcherBtn } from "../theme-toggle-btn";

const DesktopNavbar = () => {
	return (
		<div className="hidden md:block border-separate border-b bg-background shadow-sm dark:shadow-lg px-8">
			<nav className="container mx-auto flex items-center justify-between">
				<div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
					<Logo mobileText={true} />

					<ul className="flex h-full">
						{NavItems.map((item) => (
							<NavItem key={item.label} label={item.label} link={item.link} />
						))}
					</ul>
				</div>

				<div className="flex items-center gap-3">
					<ThemeSwitcherBtn />
					<UserButton />
				</div>
			</nav>
		</div>
	);
};

export default DesktopNavbar;
