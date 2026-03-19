import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Nodemailer from "nodemailer";

const transporter = Nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg border p-8 shadow-md w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in</h1>
        <div className="rounded-lg border p-4 shadow-2xs w-fit max-w-sm space-y-3">
          <form
            action={async (formData: FormData) => {
              "use server";
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;

              const user = await prisma.user.findFirst({
                where: { email },
              });

              if (!user) {
                throw new Error("Email not found");
              }

              const isValid = await bcrypt.compare(password, user.password);

              if (!isValid) {
                throw new Error("Incorrect password");
              }

              await signIn("credentials", {
                email,
                password,
                redirectTo: "/dashboard",
              });
            }}
            className="space-y-4"
          >
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full border px-3 py-2 rounded"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full border px-3 py-2 rounded"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded"
            >
              Sign in
            </button>
          </form>
        </div>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded bg-white border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Sign in with Google
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded bg-white border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Sign in with Github
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          No account? Register here! == {""}
          <a href="/register" className="text-blue-200 hover:underline">
            {" "}
            Register{" "}
          </a>
        </p>
      </div>
    </div>
  );
}
