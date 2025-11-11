import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // 🛑 If no session, redirect to login
  if (!session) redirect("/api/auth/signin");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">
        Welcome, {session.user?.name || "User"} 👋
      </h1>
      <p className="text-gray-600 mt-2">
        You are signed in with {session.user?.email}
      </p>
      <LogoutButton />
    </div>
  );
}
