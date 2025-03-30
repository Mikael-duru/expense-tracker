import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const authCookie = req.cookies.get("__session_auth")?.value;

	// Public routes that don't require authentication
	const publicRoutes = ["/sign-in", "/sign-up"];

	// Allow access to public routes
	if (publicRoutes.some((path) => pathname.startsWith(path))) {
		return NextResponse.next();
	}

	// If user is not authenticated, redirect to the sign-in page
	if (!authCookie) {
		return NextResponse.redirect(new URL("/sign-in", req.url));
	}

	return NextResponse.next();
}

// Middleware applies to all routes except static assets, API routes, and Next.js internal routes
export const config = {
	matcher: "/((?!api|_next/static|_next/image|assets|favicon.ico).*)",
};
