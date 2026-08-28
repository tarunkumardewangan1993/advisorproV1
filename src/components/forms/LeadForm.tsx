"use client";

import { useActionState } from "react";
import { initialActionState } from "@/lib/actions/types";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FieldError } from "@/components/ui/FieldError";
import type { ActionState } from "@/lib/actions/types";
import type { Lead } from "@prisma/client";

function toDateInput(value?: Date | string | null) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

export function LeadForm({
  action,
  defaults,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaults?: Lead;
}) {
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name *</label>
        <input name="name" defaultValue={defaults?.name} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        <FieldError errors={state.errors?.name} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile</label>
          <input name="mobile" defaultValue={defaults?.mobile ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.mobile} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input name="email" type="email" defaultValue={defaults?.email ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.email} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Source</label>
          <input name="source" defaultValue={defaults?.source ?? ""} placeholder="Referral, walk-in, etc." className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" defaultValue={defaults?.status ?? "NEW"} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm">
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="LOST">Lost</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Follow-up date</label>
        <input name="followUpDate" type="date" defaultValue={toDateInput(defaults?.followUpDate)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea name="notes" defaultValue={defaults?.notes ?? ""} rows={3} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
      </div>

      {state.status === "error" && state.message && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.message}</p>}
      {state.status === "success" && state.message && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.message}</p>}

      <SubmitButton>Save lead</SubmitButton>
    </form>
  );
}
