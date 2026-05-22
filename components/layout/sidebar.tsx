"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Package, FileText, Users, LayoutDashboard, ChevronLeft, Store } from "lucide-react";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { storeId } = useParams();
  const [storeName, setStoreName] = useState<string | null>(null);

  const base = `/dashboard/stores/${storeId}`;

  const links = [
    { href: base, label: "Overview", icon: LayoutDashboard, exact: true },
    { href: `${base}/products`, label: "Inventory", icon: Package, exact: false },
    { href: `${base}/invoices`, label: "Invoices", icon: FileText, exact: false },
    { href: `${base}/customers`, label: "Customers", icon: Users, exact: false },
  ];

  useEffect(() => {
    if (!storeId) return;
    fetch("/api/stores")
      .then((r) => r.json())
      .then((stores: { id: string; name: string }[]) => {
        const store = stores.find((s) => s.id === storeId);
        if (store) setStoreName(store.name);
      })
      .catch(() => {});
  }, [storeId]);

  return (
    <aside className="h-[calc(100vh-56px)] w-56 border-r border-slate-200 bg-white flex flex-col shrink-0 sticky top-14">
      {/* Store context header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors mb-3 group w-fit"
        >
          <ChevronLeft
            size={12}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          All Stores
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-slate-950 rounded-lg flex items-center justify-center flex-shrink-0">
            <Store size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-900 truncate leading-tight">
            {storeName ?? "Store"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100">
        <p className="text-xs text-slate-400">Hisaab v1.0</p>
      </div>
    </aside>
  );
}
