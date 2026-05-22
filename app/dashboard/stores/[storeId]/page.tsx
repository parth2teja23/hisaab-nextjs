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
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

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
