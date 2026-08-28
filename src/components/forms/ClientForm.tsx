"use client";

import { useActionState } from "react";
import { initialActionState } from "@/lib/actions/types";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FieldError } from "@/components/ui/FieldError";
import type { ActionState } from "@/lib/actions/types";

type ClientDefaults = {
  name?: string;
  email?: string | null;
  mobile?: string | null;
  dob?: Date | string | null;
  address?: string | null;
  notes?: string | null;
};

export function ClientForm({
  action,
  defaults,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaults?: ClientDefaults;
}) {
  const [state, formAction] = useActionState(action, initialActionState);
  const dobValue = defaults?.dob ? new Date(defaults.dob).toISOString().slice(0, 10) : "";

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name *</label>
        <input
          name="name"
          defaultValue={defaults?.name}
          required
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <FieldError errors={state.errors?.name} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile</label>
          <input
            name="mobile"
            defaultValue={defaults?.mobile ?? ""}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <FieldError errors={state.errors?.mobile} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={defaults?.email ?? ""}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <FieldError errors={state.errors?.email} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date of birth</label>
        <input
          name="dob"
          type="date"
          defaultValue={dobValue}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          name="address"
          defaultValue={defaults?.address ?? ""}
          rows={2}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          defaultValue={defaults?.notes ?? ""}
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.message}</p>
      )}
      {state.status === "success" && state.message && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.message}</p>
      )}

      <SubmitButton>Save client</SubmitButton>
    </form>
  );
}
