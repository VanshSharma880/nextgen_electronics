import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow webhook endpoint
        if (pathname.startsWith("/api/webhook")) {
          return true;
        }

        // Allow auth-related routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/sign-in" ||
          pathname === "/sign-up"
        ) {
          return true;
        }

        // Public routes
        if (
          pathname === "/" ||
          pathname.startsWith("/api/products") ||
          pathname.startsWith("/products") ||
          pathname.startsWith("/search") ||
          pathname.startsWith("/about") ||
          pathname.startsWith("/contact") ||
          pathname.startsWith("/cart") ||
          pathname.startsWith("/orders")
        ) {
          return true;
        }

        // Admin routes require admin role
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }

        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
