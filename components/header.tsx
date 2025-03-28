import React from "react";

import DesktopNavbar from "./navbars/desktop-navbar";
import MobileNavbar from "./navbars/mobile-navbar";

const Header = () => {
	return (
		<>
			<DesktopNavbar />
			<MobileNavbar />
		</>
	);
};

export default Header;
