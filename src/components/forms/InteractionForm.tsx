"use client";

import { useActionState } from "react";
import { initialActionState } from "@/lib/actions/types";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FieldError } from "@/components/ui/FieldError";
import type { ActionState } from "@/lib/actions/types";
import type { Interaction } from "@prisma/client";

function toDateInput(value?: Date | string | null) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

export function InteractionForm({
  action,
  clientId,
  defaults,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  clientId: string;
  defaults?: Interaction;
}) {
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="clientId" value={clientId} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select name="type" defaultValue={defaults?.type ?? "CALL"} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm">
            <option value="CALL">Call</option>
            <option value="MEETING">Meeting</option>
            <option value="EMAIL">Email</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="VISIT">Visit</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Interaction date *</label>
          <input name="interactionDate" type="date" defaultValue={toDateInput(defaults?.interactionDate) || toDateInput(new Date())} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.interactionDate} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes *</label>
        <textarea name="notes" defaultValue={defaults?.notes} required rows={3} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        <FieldError errors={state.errors?.notes} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Follow-up date</label>
        <input name="followUpDate" type="date" defaultValue={toDateInput(defaults?.followUpDate)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
      </div>

      {state.status === "error" && state.message && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.message}</p>}
      {state.status === "success" && state.message && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.message}</p>}

      <SubmitButton>Save interaction</SubmitButton>
    </form>
  );
}
