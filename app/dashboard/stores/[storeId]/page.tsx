"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  TrendingUp,
  IndianRupee,
  Package,
  Users,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import type { Invoice } from "@/lib/types";

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div
          className={`h-9 w-9 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center`}
        >
          <Icon size={17} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="h-9 w-9 bg-slate-200 rounded-lg" />
      </div>
      <div className="h-8 w-28 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-16 bg-slate-100 rounded" />
    </div>
  );
}

export default function StoreDashboard() {
  const { storeId } = useParams();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;
    Promise.all([
      fetch(`/api/invoices?storeId=${storeId}`).then((r) => r.json()),
      fetch(`/api/customers/store?storeId=${storeId}`).then((r) => r.json()),
      fetch(`/api/products?storeId=${storeId}`).then((r) => r.json()),
    ])
      .then(([inv, cust, prod]) => {
        setInvoices(Array.isArray(inv) ? inv : []);
        setCustomers(Array.isArray(cust) ? cust : []);
        setProducts(Array.isArray(prod) ? prod : []);
      })
      .finally(() => setLoading(false));
  }, [storeId]);

  const totalRevenue = invoices.reduce(
    (sum, inv) => sum + Number(inv.totalAmount),
    0
  );
  const recentTransactions = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // Build last-7-day revenue bars
  const revenueBars = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const total = invoices
      .filter((inv) => new Date(inv.createdAt).toDateString() === dayStr)
      .reduce((s, inv) => s + Number(inv.totalAmount), 0);
    return { label: d.toLocaleDateString("en-IN", { weekday: "short" }), total };
  });
  const maxBar = Math.max(...revenueBars.map((b) => b.total), 1);

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      sub: `From ${invoices.length} invoice${invoices.length !== 1 ? "s" : ""}`,
      icon: IndianRupee,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Orders",
      value: invoices.length.toString(),
      sub: "All time",
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Products",
      value: products.length.toString(),
      sub: "In inventory",
      icon: Package,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Customers",
      value: customers.length.toString(),
      sub: "Active",
      icon: Users,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Store performance at a glance
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading
            ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
            : stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Revenue Chart */}
        {!loading && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-slate-900">Revenue — Last 7 Days</h2>
                <p className="text-xs text-slate-400 mt-0.5">Daily invoice totals</p>
              </div>
              <span className="text-sm font-bold text-slate-900">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-end gap-2 h-28">
              {revenueBars.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full relative group" style={{ height: "88px" }}>
                    <div
                      className="absolute bottom-0 w-full rounded-t-md transition-all duration-500 bg-slate-900 hover:bg-blue-600"
                      style={{ height: `${Math.max((bar.total / maxBar) * 100, bar.total > 0 ? 8 : 2)}%` }}
                    >
                      {bar.total > 0 && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          ₹{bar.total.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 text-base">
              Recent Transactions
            </h2>
            <Link
              href={`/dashboard/stores/${storeId}/invoices`}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5 transition-colors"
            >
              View all
              <ArrowUpRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-slate-600 text-sm font-medium">
                No transactions yet
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Create an invoice to see transactions here.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      #{inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {inv.customer?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 hidden sm:table-cell">
                      {inv.createdAt
                        ? new Date(inv.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">
                      ₹{Number(inv.totalAmount).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
