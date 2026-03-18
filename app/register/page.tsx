import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
export default function registerPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg border p-8 shadow-md w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>

        <form
          action={async (formData: FormData) => {
            "use server";
            const name = formData.get("name") as string;
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) redirect("/register?error=exists");

            const hashed = await bcrypt.hash(password, 10);
            await prisma.user.create({
              data: { name, email, password: hashed },
            });

            redirect("/login");
          }}
          className="space-y-2"
        >
          <input
            name="name"
            type="text"
            placeholder="Name"
            required
            className="w-full rounded border border-gray-300 px-4 py-2 text-sm"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded border border-gray-300 px-4 py-2 text-sm"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="w-full rounded border border-gray-300 px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
