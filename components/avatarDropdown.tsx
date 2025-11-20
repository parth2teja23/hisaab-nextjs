"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";

export default function AvatarDropdown() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-full">
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
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
