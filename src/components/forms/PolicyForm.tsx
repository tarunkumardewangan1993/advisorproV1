"use client";

import { useActionState } from "react";
import { initialActionState } from "@/lib/actions/types";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FieldError } from "@/components/ui/FieldError";
import type { ActionState } from "@/lib/actions/types";
import type { InsurancePolicy } from "@prisma/client";

function toDateInput(value?: Date | string | null) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

export function PolicyForm({
  action,
  clientId,
  defaults,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  clientId: string;
  defaults?: InsurancePolicy;
}) {
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="clientId" value={clientId} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Insurer *</label>
          <input name="insurer" defaultValue={defaults?.insurer} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.insurer} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Plan name *</label>
          <input name="planName" defaultValue={defaults?.planName} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.planName} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Policy number *</label>
        <input name="policyNumber" defaultValue={defaults?.policyNumber} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        <FieldError errors={state.errors?.policyNumber} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sum assured *</label>
          <input name="sumAssured" type="number" step="0.01" defaultValue={defaults?.sumAssured?.toString()} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.sumAssured} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Premium amount *</label>
          <input name="premiumAmount" type="number" step="0.01" defaultValue={defaults?.premiumAmount?.toString()} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.premiumAmount} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Frequency</label>
          <select name="premiumFrequency" defaultValue={defaults?.premiumFrequency ?? "YEARLY"} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm">
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="HALF_YEARLY">Half-yearly</option>
            <option value="YEARLY">Yearly</option>
            <option value="SINGLE">Single</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" defaultValue={defaults?.status ?? "ACTIVE"} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm">
            <option value="ACTIVE">Active</option>
            <option value="LAPSED">Lapsed</option>
            <option value="MATURED">Matured</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start date *</label>
          <input name="startDate" type="date" defaultValue={toDateInput(defaults?.startDate)} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.startDate} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Due date *</label>
          <input name="dueDate" type="date" defaultValue={toDateInput(defaults?.dueDate)} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.dueDate} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Maturity date</label>
          <input name="maturityDate" type="date" defaultValue={toDateInput(defaults?.maturityDate)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea name="notes" defaultValue={defaults?.notes ?? ""} rows={2} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
      </div>

      {state.status === "error" && state.message && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.message}</p>}
      {state.status === "success" && state.message && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.message}</p>}

      <SubmitButton>Save policy</SubmitButton>
    </form>
  );
}
