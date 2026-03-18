import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  // Guard 1: must be authenticated
  if (!session) {
    redirect("/login");
  }

  // Guard 2: must be an admin
  if (session.user?.role !== "admin") {
    redirect("/dashboard"); // or redirect to a 403 page
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <p className="text-gray-600">
        Logged in as <strong>{session.user?.email}</strong> with role{" "}
        <span className="font-mono bg-gray-100 px-1 rounded">
          {session.user?.role}
        </span>
      </p>
    </div>
  );
}
