import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeadById } from "@/lib/data/leads";
import { deleteLead, convertLeadToClient } from "@/lib/actions/leads";
import { formatDate } from "@/lib/dates";
import { ConfirmForm } from "@/components/ui/ConfirmForm";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadById(id);
  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{lead.name}</h1>
          <p className="text-sm text-gray-500">
            {lead.leadUid} · {lead.mobile ?? "no mobile"} {lead.email ? `· ${lead.email}` : ""}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Status: {lead.status} {lead.source ? `· Source: ${lead.source}` : ""}
          </p>
        </div>
        <Link href={`/leads/${lead.id}/edit`} className="text-sm font-medium text-blue-600">
          Edit
        </Link>
      </div>

      {lead.followUpDate && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <p className="text-xs font-medium uppercase text-gray-400">Follow-up date</p>
          <p className="mt-1 text-sm text-gray-700">{formatDate(lead.followUpDate)}</p>
        </div>
      )}

      {lead.notes && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <p className="text-xs font-medium uppercase text-gray-400">Notes</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{lead.notes}</p>
        </div>
      )}

      {lead.convertedToClient ? (
        <div className="rounded-2xl bg-green-50 p-4 text-sm text-green-700 ring-1 ring-green-200">
          Converted to client{" "}
          <Link href={`/clients/${lead.convertedToClient.id}`} className="font-medium underline">
            {lead.convertedToClient.clientUid}
          </Link>
        </div>
      ) : (
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Lead actions</h2>
          <div className="flex flex-wrap gap-3 text-sm font-medium">
            <ConfirmForm
              action={convertLeadToClient.bind(null, lead.id)}
              confirmMessage="Convert this lead into a client?"
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
            >
              Convert to Client
            </ConfirmForm>
            <ConfirmForm
              action={deleteLead.bind(null, lead.id)}
              confirmMessage="Delete this lead?"
              className="rounded-lg border border-red-300 px-3 py-1.5 text-red-600 hover:bg-red-50"
            >
              Delete Lead
            </ConfirmForm>
          </div>
        </section>
      )}
    </div>
  );
}
