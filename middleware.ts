import { withAuth } from "next-auth/middleware";

export default withAuth(
  // No need to define a handler, this wrapper adds auth checks automatically
  {
    pages: {
      signIn: "/signin", // Redirect unauthenticated users here
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/store/:path*",
    "/billing/:path*",
    "/customers/:path*",
    "/invoices/:path*",
  ],
};
