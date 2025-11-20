import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, IndianRupee, Package, Users } from "lucide-react";

// components/hisaab/StoreDashboard.tsx
export default function StoreDashboard({ store }: { store: any }) {
  const monthlySales = store.monthlySales;
  const inventory = store.inventory;
  const recentTransactions = store.recentTransactions;
  const totalSales = store.totalSales;
  const orders = store.orders;
  const customers = store.customers;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">{store.name} Dashboard</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="rounded-2xl shadow">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Total Sales</h3>
            </div>
            <p className="text-3xl font-bold">₹{totalSales}</p>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Orders</h3>
            </div>
            <p className="text-3xl font-bold">{orders}</p>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Products</h3>
            </div>
            <p className="text-3xl font-bold">{inventory}</p>
            <p className="text-sm text-gray-500">In inventory</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Customers</h3>
            </div>
            <p className="text-3xl font-bold">{customers}</p>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow max-w-5xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Monthly Sales</h2>
        {/* Chart placeholder */}
        <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
          <p className="text-gray-500">Monthly Sales Chart</p>
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        <div className="flex flex-col gap-4">
          {recentTransactions.map((t: any, i: number) => (
            <div key={i} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">Invoice #{t.number}</p>
                <p className="text-sm text-gray-500">{t.customerName}</p>
              </div>
              <p className="font-semibold">₹{t.total}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
