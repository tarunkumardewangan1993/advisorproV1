"use client";

import { useActionState } from "react";
import { initialActionState } from "@/lib/actions/types";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FieldError } from "@/components/ui/FieldError";
import type { ActionState } from "@/lib/actions/types";
import type { MutualFund } from "@prisma/client";

function toDateInput(value?: Date | string | null) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

export function FundForm({
  action,
  clientId,
  defaults,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  clientId: string;
  defaults?: MutualFund;
}) {
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="clientId" value={clientId} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">AMC name *</label>
          <input name="amcName" defaultValue={defaults?.amcName} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.amcName} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Scheme name *</label>
          <input name="schemeName" defaultValue={defaults?.schemeName} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.schemeName} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Folio number *</label>
        <input name="folioNumber" defaultValue={defaults?.folioNumber} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        <FieldError errors={state.errors?.folioNumber} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Investment type</label>
          <select name="investmentType" defaultValue={defaults?.investmentType ?? "SIP"} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm">
            <option value="SIP">SIP</option>
            <option value="LUMPSUM">Lumpsum</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" defaultValue={defaults?.status ?? "ACTIVE"} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm">
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">SIP amount</label>
          <input name="sipAmount" type="number" step="0.01" defaultValue={defaults?.sipAmount?.toString() ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.sipAmount} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">SIP due date</label>
          <input name="sipDueDate" type="date" defaultValue={toDateInput(defaults?.sipDueDate)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Invested amount *</label>
          <input name="investedAmount" type="number" step="0.01" defaultValue={defaults?.investedAmount?.toString()} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
          <FieldError errors={state.errors?.investedAmount} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Current value</label>
          <input name="currentValue" type="number" step="0.01" defaultValue={defaults?.currentValue?.toString() ?? ""} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Start date *</label>
        <input name="startDate" type="date" defaultValue={toDateInput(defaults?.startDate)} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
        <FieldError errors={state.errors?.startDate} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea name="notes" defaultValue={defaults?.notes ?? ""} rows={2} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
      </div>

      {state.status === "error" && state.message && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.message}</p>}
      {state.status === "success" && state.message && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.message}</p>}

      <SubmitButton>Save fund</SubmitButton>
    </form>
  );
}
