// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import LogoutButton from "@/components/LogoutButton";

// export default async function Dashboard() {
//   const session = await getServerSession(authOptions);

//   // 🛑 If no session, redirect to login
//   if (!session) redirect("/api/auth/signin");

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold">
//         Welcome, {session.user?.name || "User"} 👋
//       </h1>
//       <p className="text-gray-600 mt-2">
//         You are signed in with {session.user?.email}
//       </p>
//       <LogoutButton />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface Store {
  id: string;
  name: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch stores
  useEffect(() => {
    fetch("/api/stores")
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error("Error loading stores", err));
  }, []);

  async function handleCreateStore(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        const newStore = await res.json();
        setStores((prev) => [...prev, newStore]);
        setName("");
        setOpen(false); // 👈 closes the dialog automatically
      }
    } catch (err) {
      console.error("Error creating store:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Your Stores</h1>

        {/* Controlled Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Create Store</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Store</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateStore} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Pakeeza Women Wear"
                  required
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Store"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Store List */}
      {stores.length === 0 ? (
        <p className="text-gray-500">No stores created yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stores.map((store) => (
            <Card
              key={store.id}
              className="p-4 hover:shadow-md transition cursor-pointer"
              onClick={() =>
                (window.location.href = `/dashboard/stores/${store.id}`)
              }
            >
              <h2 className="font-medium text-lg">{store.name}</h2>
              <p className="text-sm text-gray-500 mt-1">ID: {store.id}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
