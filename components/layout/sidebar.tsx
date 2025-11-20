"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Package, FileText, Users } from "lucide-react";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();
  const { storeId } = useParams(); // <-- important

  const base = `/dashboard/stores/${storeId}`;

  const links = [
    { href: `${base}/products`, label: "Products", icon: Package },
    { href: `${base}/invoices`, label: "Invoices", icon: FileText },
    { href: `${base}/customers`, label: "Customers", icon: Users },
  ];

  return (
    <aside className="h-screen w-60 border-r bg-white p-4">
      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
