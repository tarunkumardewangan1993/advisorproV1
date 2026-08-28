import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "ADMIN" | "ADVISOR";
    userUid: string;
    status: "ACTIVE" | "INACTIVE";
  }

  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "ADVISOR";
      userUid: string;
      status: "ACTIVE" | "INACTIVE";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "ADVISOR";
    userUid: string;
    status: "ACTIVE" | "INACTIVE";
  }
}
