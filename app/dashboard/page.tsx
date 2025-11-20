import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IndianRupee, Package } from "lucide-react";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  // Fetch all stores of this user
  const stores = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stores`, {
    cache: "no-store",
  }).then(r => r.json());

  // Build extended store stats
  const storesWithStats = await Promise.all(
    stores.map(async (store: any) => {
      const products = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?storeId=${store.id}`,
        { cache: "no-store" }
      ).then(r => r.json());

      const inventoryCount = products.length;

      const monthlySales = products.reduce(
        (acc: number, p: any) => acc + p.price * p.quantity,
        0
      );

      return {
        ...store,
        monthlySales,
        inventoryCount,
      };
    })
  );

  return (
    <div className="p-10 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Your Stores</h1>

        <Link
          href="/stores"
          className="px-4 py-2 rounded-md bg-gray-200 text-black font-medium"
        >
          Manage Stores
        </Link>
      </div>

      {/* STORE LIST */}
      <div className="space-y-4 mb-12">
        {storesWithStats.map((store: any) => (
          <Link
            key={store.id}
            href={`/dashboard/${store.id}`}
            className="block border rounded-xl p-5 hover:bg-gray-100 transition"
          >
            <div className="flex justify-between items-center">
              <div className="text-xl font-medium">{store.name}</div>

              <div className="flex items-center gap-6">
                {/* Sales */}
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5" />
                  <span className="font-semibold">
                    Rs. {store.monthlySales.toLocaleString()}
                  </span>
                </div>

                {/* Inventory */}
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span className="font-semibold">{store.inventoryCount}</span>
                </div>

                <span className="text-xl">{">"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* SALES + CUSTOMERS SECTION */}
      <div className="grid grid-cols-2 gap-8 mt-10">
        <div className="border p-6 rounded-xl">
          <div className="text-2xl font-semibold">Sales</div>
          <div className="text-sm text-gray-500 mb-4">in last 30 days</div>
          <div className="h-32 border rounded-lg"></div>
        </div>

        <div className="border p-6 rounded-xl">
          <div className="text-2xl font-semibold">Customers</div>
          <div className="text-sm text-gray-500 mb-4">
            added in last 30 days
          </div>
          <div className="h-32 border rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
