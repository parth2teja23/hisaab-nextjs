"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AvatarDropdown from "../avatarDropdown";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Hisaab
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline">Dashboard</Button>
        </Link>

        {!session ? (
          <Button onClick={() => signIn()}>Login</Button>
        ) : (
          <div className="flex items-center gap-3">
            {/* <Avatar className="h-8 w-8">
              <AvatarFallback>
                {session.user?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar> */}

            <AvatarDropdown />

            <Button variant="destructive" onClick={() => signOut()}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
