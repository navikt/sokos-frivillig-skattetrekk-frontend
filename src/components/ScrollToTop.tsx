import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export const ScrollToTop = () => {
	const { pathname } = useLocation();
	// biome-ignore lint/correctness/useExhaustiveDependencies: false positive
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	return <Outlet />;
};
