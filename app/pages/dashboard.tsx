import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, IndianRupee, Package, Users } from "lucide-react";

export default function HisaabDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button className="rounded-2xl px-6 py-2 text-base">Add New Sale</Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="rounded-2xl shadow">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Total Sales</h3>
              <IndianRupee size={24} />
            </div>
            <p className="text-3xl font-bold">₹1,24,500</p>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Orders</h3>
              <TrendingUp size={24} />
            </div>
            <p className="text-3xl font-bold">342</p>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Products</h3>
              <Package size={24} />
            </div>
            <p className="text-3xl font-bold">148</p>
            <p className="text-sm text-gray-500">In inventory</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Customers</h3>
              <Users size={24} />
            </div>
            <p className="text-3xl font-bold">89</p>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        <div className="flex flex-col gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">Invoice #{1000 + i}</p>
                <p className="text-sm text-gray-500">Customer {i}</p>
              </div>
              <p className="font-semibold">₹{2000 + i * 300}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
