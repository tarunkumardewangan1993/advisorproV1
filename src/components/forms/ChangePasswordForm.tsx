"use client";

import { useActionState } from "react";
import { initialActionState } from "@/lib/actions/types";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FieldError } from "@/components/ui/FieldError";
import { changeOwnPassword } from "@/lib/actions/profile";

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changeOwnPassword, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Current password *</label>
        <input name="currentPassword" type="password" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        <FieldError errors={state.errors?.currentPassword} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">New password *</label>
        <input name="newPassword" type="password" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        <FieldError errors={state.errors?.newPassword} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm new password *</label>
        <input name="confirmPassword" type="password" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        <FieldError errors={state.errors?.confirmPassword} />
      </div>
      {state.status === "error" && state.message && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.message}</p>}
      {state.status === "success" && state.message && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.message}</p>}
      <SubmitButton>Change password</SubmitButton>
    </form>
  );
}
