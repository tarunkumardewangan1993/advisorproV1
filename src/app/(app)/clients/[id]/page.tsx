import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientById } from "@/lib/data/clients";
import { softDeleteClient, revertClientToLead } from "@/lib/actions/clients";
import { deletePolicy } from "@/lib/actions/policies";
import { deleteFund } from "@/lib/actions/funds";
import { deleteInteraction } from "@/lib/actions/interactions";
import { formatDate } from "@/lib/dates";
import { ConfirmForm } from "@/components/ui/ConfirmForm";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{client.name}</h1>
          <p className="text-sm text-gray-500">
            {client.clientUid} · {client.mobile ?? "no mobile"} {client.email ? `· ${client.email}` : ""}
          </p>
          {client.convertedFromLead && (
            <p className="mt-1 text-xs text-gray-400">Converted from lead {client.convertedFromLead.leadUid}</p>
          )}
        </div>
        <Link href={`/clients/${client.id}/edit`} className="text-sm font-medium text-blue-600">
          Edit
        </Link>
      </div>

      {client.address && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <p className="text-xs font-medium uppercase text-gray-400">Address</p>
          <p className="mt-1 text-sm text-gray-700">{client.address}</p>
        </div>
      )}
      {client.notes && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <p className="text-xs font-medium uppercase text-gray-400">Notes</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{client.notes}</p>
        </div>
      )}

      {/* Policies */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Insurance Policies</h2>
          <Link href={`/clients/${client.id}/policies/new`} className="text-xs font-medium text-blue-600">
            + Add
          </Link>
        </div>
        {client.policies.length === 0 ? (
          <p className="text-sm text-gray-500">No policies yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {client.policies.map((policy) => (
              <li key={policy.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {policy.insurer} · {policy.planName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {policy.policyUid} · Due {formatDate(policy.dueDate)} · {currency.format(Number(policy.premiumAmount))} · {policy.status}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium">
                  <Link href={`/clients/${client.id}/policies/${policy.id}/edit`} className="text-blue-600">
                    Edit
                  </Link>
                  <ConfirmForm
                    action={deletePolicy.bind(null, policy.id)}
                    confirmMessage="Delete this policy?"
                    className="text-red-600"
                  >
                    Delete
                  </ConfirmForm>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Mutual Funds */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Mutual Funds</h2>
          <Link href={`/clients/${client.id}/funds/new`} className="text-xs font-medium text-blue-600">
            + Add
          </Link>
        </div>
        {client.mutualFunds.length === 0 ? (
          <p className="text-sm text-gray-500">No mutual funds yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {client.mutualFunds.map((fund) => (
              <li key={fund.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {fund.amcName} · {fund.schemeName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {fund.fundUid} · {fund.investmentType} · Invested {currency.format(Number(fund.investedAmount))} · {fund.status}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium">
                  <Link href={`/clients/${client.id}/funds/${fund.id}/edit`} className="text-blue-600">
                    Edit
                  </Link>
                  <ConfirmForm
                    action={deleteFund.bind(null, fund.id)}
                    confirmMessage="Delete this fund?"
                    className="text-red-600"
                  >
                    Delete
                  </ConfirmForm>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Interactions */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Interactions</h2>
          <Link href={`/clients/${client.id}/interactions/new`} className="text-xs font-medium text-blue-600">
            + Log
          </Link>
        </div>
        {client.interactions.length === 0 ? (
          <p className="text-sm text-gray-500">No interactions logged yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {client.interactions.map((interaction) => (
              <li key={interaction.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {interaction.type} · {formatDate(interaction.interactionDate)}
                  </p>
                  <p className="text-xs text-gray-500">{interaction.notes}</p>
                  {interaction.followUpDate && (
                    <p className="text-xs text-amber-600">Follow-up: {formatDate(interaction.followUpDate)}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs font-medium">
                  <Link href={`/clients/${client.id}/interactions/${interaction.id}/edit`} className="text-blue-600">
                    Edit
                  </Link>
                  <ConfirmForm
                    action={deleteInteraction.bind(null, interaction.id)}
                    confirmMessage="Delete this interaction?"
                    className="text-red-600"
                  >
                    Delete
                  </ConfirmForm>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Client actions</h2>
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <ConfirmForm
            action={revertClientToLead.bind(null, client.id)}
            confirmMessage="Revert this client back to a lead? This will archive the client and its records."
            className="rounded-lg border border-amber-300 px-3 py-1.5 text-amber-700 hover:bg-amber-50"
          >
            Revert to Lead
          </ConfirmForm>
          <ConfirmForm
            action={softDeleteClient.bind(null, client.id)}
            confirmMessage="Delete this client? This will also archive their policies, funds, and interactions. You can restore it from Trash."
            className="rounded-lg border border-red-300 px-3 py-1.5 text-red-600 hover:bg-red-50"
          >
            Delete Client
          </ConfirmForm>
        </div>
      </section>
    </div>
  );
}
