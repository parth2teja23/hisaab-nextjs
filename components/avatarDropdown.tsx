"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AvatarDropdown() {
  const { data: session } = useSession();
  const initials = session?.user?.name?.[0]?.toUpperCase() ?? "U";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-full">
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarImage src={session?.user?.image ?? ""} alt="User" />
            <AvatarFallback className="bg-slate-950 text-white text-sm font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-40 p-2">
        <Link
          href="/profile"
          className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100"
        >
          Edit Profile
        </Link>
      </PopoverContent>
    </Popover>
  );
}
