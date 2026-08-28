import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe config: session/pages/callbacks ONLY, no providers.
 * middleware.ts (runs on the Edge runtime) imports this file, never `auth.ts`
 * — pulling bcrypt/Prisma into the Edge Function bundle can push it over
 * Vercel's 1MB Hobby-plan limit and silently break every route.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = request.nextUrl.pathname.startsWith("/login");

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", request.nextUrl));
        }
        return true;
      }

      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.userUid = user.userUid;
        token.status = user.status;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "ADVISOR";
        session.user.userUid = token.userUid as string;
        session.user.status = token.status as "ACTIVE" | "INACTIVE";
      }
      return session;
    },
  },
};
