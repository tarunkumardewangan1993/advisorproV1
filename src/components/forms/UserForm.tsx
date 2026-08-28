"use client";

import { useActionState } from "react";
import { initialActionState } from "@/lib/actions/types";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FieldError } from "@/components/ui/FieldError";
import type { ActionState } from "@/lib/actions/types";

export function UserForm({ action }: { action: (prevState: ActionState, formData: FormData) => Promise<ActionState> }) {
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name *</label>
        <input name="name" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        <FieldError errors={state.errors?.name} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile</label>
          <input name="mobile" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.mobile} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input name="email" type="email" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.email} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select name="role" defaultValue="ADVISOR" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm">
            <option value="ADVISOR">Advisor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password *</label>
          <input name="password" type="password" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.password} />
        </div>
      </div>

      {state.status === "error" && state.message && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.message}</p>}
      {state.status === "success" && state.message && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.message}</p>}

      <SubmitButton>Create user</SubmitButton>
    </form>
  );
}
