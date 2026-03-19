import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

// Суурилагдсан төрлүүдийг `role` талбараар өргөтгөх
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
  interface User {
    role?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  ...authConfig,

  // JWT cookie strategy — Edge middleware-тай нийцтэй.
  // Adapter байгаа тул User + Account MongoDB-д хадгалагдана.
  session: { strategy: "jwt" },

  callbacks: {
    ...authConfig.callbacks,

    // Анх нэвтрэх үед id + role-ийг JWT token-д хадгалах
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "user";
      }
      return token;
    },

    // Token-оос id + role-ийг session объект дээр гаргах
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = (token.role as string) ?? "user";
      return session;
    },
  },
});
