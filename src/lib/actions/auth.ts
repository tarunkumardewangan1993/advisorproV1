"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import type { ActionState } from "@/lib/actions/types";

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const userUid = formData.get("userUid");
  const password = formData.get("password");

  if (!userUid || !password) {
    return { status: "error", message: "User ID and password are required" };
  }

  try {
    await signIn("credentials", {
      userUid,
      password,
      redirectTo: "/dashboard",
    });
    return { status: "success" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { status: "error", message: "Invalid User ID or password" };
    }
    throw error;
  }
}
