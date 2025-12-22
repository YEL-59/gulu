import { NextResponse } from "next/server";

// Define route configurations
const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/auth/forgot-password"];
const authRoutes = ["/auth/signin", "/auth/signup", "/auth/forgot-password"];

// Routes that require specific roles (and verification)
const roleRoutes = {
  wholesaler: ["/wholesaler"],
  reseller: ["/reseller"],
  admin: ["/admin"],
};

// Routes that don't require verification (like terms pages, onboarding)
const noVerificationRequired = [
  "/wholesaler/terms",
  "/wholesaler/onboarding",
  "/reseller/terms",
  "/reseller/onboarding",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get token and user from cookies
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;
  
  let user = null;
  try {
    user = userCookie ? JSON.parse(userCookie) : null;
  } catch {
    user = null;
  }

  const isAuthenticated = !!token && !!user;
  const userRole = user?.role?.toLowerCase();

  // Helper function to create redirect
  const redirect = (path) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  // 1. If user is authenticated and trying to access auth pages, redirect to appropriate dashboard
  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    switch (userRole) {
      case "wholesaler":
        return redirect("/wholesaler/dashboard");
      case "reseller":
        return redirect("/reseller/dashboard");
      case "admin":
        return redirect("/admin/dashboard");
      default:
        return redirect("/");
    }
  }

  // 2. Check role-based routes
  for (const [role, routes] of Object.entries(roleRoutes)) {
    const isRoleRoute = routes.some(route => pathname.startsWith(route));
    
    if (isRoleRoute) {
      // Check if this route requires verification
      const requiresVerification = !noVerificationRequired.some(route => pathname.startsWith(route));
      
      // If not authenticated, redirect to login with return URL
      if (!isAuthenticated) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/signin";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }

      // If authenticated but wrong role, redirect to their dashboard or home
      if (userRole !== role) {
        switch (userRole) {
          case "wholesaler":
            return redirect("/wholesaler/dashboard");
          case "reseller":
            return redirect("/reseller/dashboard");
          case "admin":
            return redirect("/admin/dashboard");
          default:
            return redirect("/");
        }
      }

      // For routes that require verification, we can't check verify status from cookie
      // The verify check is done in the login hook already
      // But we can add an additional check if you store verify status in user cookie
    }
  }

  // 3. Allow all other requests
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};




