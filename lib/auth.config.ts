import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [Google, Github],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // хэрэглэгч middleware-д дамжиж ирэхэд шалгах

      const isLoggedIn = !!auth?.user;
      const PUBLIC_PATHS = ["/login", "/register", "/api/auth"];
      const isPublic = PUBLIC_PATHS.some((p) => nextUrl.pathname.startsWith(p));

      if (isPublic) return true;
      if (isLoggedIn) return true;

      // Нэвтрээгүй + хамгаалагдсан хуудас → /login руу чиглүүлэх
      return false;
    },
  },
};
