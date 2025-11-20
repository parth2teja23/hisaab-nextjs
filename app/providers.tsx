"use client";

// import { SessionProvider } from "next-auth/react";

// export function Providers({ children }) {
//   return <SessionProvider>{children}</SessionProvider>;
// }

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
