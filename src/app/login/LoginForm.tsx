"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { initialActionState } from "@/lib/actions/types";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="userUid" className="block text-sm font-medium text-gray-700">
          User ID
        </label>
        <input
          id="userUid"
          name="userUid"
          type="text"
          autoComplete="username"
          placeholder="ADV001"
          required
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.message}</p>
      )}
      <SubmitButton className="w-full">Sign in</SubmitButton>
    </form>
  );
}
