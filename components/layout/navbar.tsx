"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";
import AvatarDropdown from "../avatarDropdown";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname === "/signin" || pathname === "/signup") return null;

  return (
    <nav className="border-b border-slate-200 bg-white px-6 h-14 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <div className="h-7 w-7 bg-slate-950 rounded-lg flex items-center justify-center">
          <IndianRupee className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold text-slate-900 tracking-tight">Hisaab</span>
      </Link>

      <div className="flex items-center gap-2">
        {!session ? (
          <>
            <Link href="/signin">
              <Button variant="ghost" size="sm" className="text-slate-600">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-slate-950 hover:bg-slate-800">Get started</Button>
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <AvatarDropdown />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs"
            >
              Sign out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
