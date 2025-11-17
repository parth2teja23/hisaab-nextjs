"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Home, Store, Boxes, Users, Receipt, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <aside className="w-64 min-h-screen border-r bg-gray-50 p-5">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      <nav className="space-y-2">
        <SidebarItem href="/dashboard" icon={<Home size={18} />} label="Overview" />
        <SidebarItem href="/dashboard/stores" icon={<Store size={18} />} label="Stores" />
        <SidebarItem href="/dashboard/products" icon={<Boxes size={18} />} label="Products" />
        <SidebarItem href="/dashboard/customers" icon={<Users size={18} />} label="All Customers" />
        <SidebarItem href="/dashboard/invoices" icon={<Receipt size={18} />} label="Invoices" />
        <SidebarItem href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
      </nav>

      {session && (
        <Button
          variant="destructive"
          className="mt-10 w-full flex items-center gap-2"
          onClick={() => signOut()}
        >
          <LogOut size={16} />
          Logout
        </Button>
      )}
    </aside>
  );
}

function SidebarItem({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200 transition text-gray-700"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
