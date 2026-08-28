"use client";

import { useActionState } from "react";
import { initialActionState } from "@/lib/actions/types";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FieldError } from "@/components/ui/FieldError";
import { updateProfile } from "@/lib/actions/profile";
import type { User } from "@prisma/client";

export function ProfileForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(updateProfile, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name *</label>
        <input name="name" defaultValue={user.name} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        <FieldError errors={state.errors?.name} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile</label>
          <input name="mobile" defaultValue={user.mobile ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.mobile} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input name="email" type="email" defaultValue={user.email ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.email} />
        </div>
      </div>
      {state.status === "error" && state.message && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.message}</p>}
      {state.status === "success" && state.message && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.message}</p>}
      <SubmitButton>Save profile</SubmitButton>
    </form>
  );
}
