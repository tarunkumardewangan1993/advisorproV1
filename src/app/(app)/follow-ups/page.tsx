import Link from "next/link";
import { listUpcomingFollowUps } from "@/lib/data/interactions";
import { formatDate } from "@/lib/dates";

export default async function FollowUpsPage() {
  const { clientFollowUps, leadFollowUps } = await listUpcomingFollowUps();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Follow-ups</h1>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Client follow-ups</h2>
        {clientFollowUps.length === 0 ? (
          <p className="text-sm text-gray-500">No client follow-ups scheduled.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {clientFollowUps.map((interaction) => (
              <li key={interaction.id} className="flex items-center justify-between py-2.5">
                <div>
                  <Link href={`/clients/${interaction.client.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                    {interaction.client.name}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {interaction.client.clientUid} · {interaction.type}
                  </p>
                </div>
                <span className="text-xs font-medium text-amber-600">{formatDate(interaction.followUpDate)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Lead follow-ups</h2>
        {leadFollowUps.length === 0 ? (
          <p className="text-sm text-gray-500">No lead follow-ups scheduled.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {leadFollowUps.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between py-2.5">
                <div>
                  <Link href={`/leads/${lead.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                    {lead.name}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {lead.leadUid} · {lead.status}
                  </p>
                </div>
                <span className="text-xs font-medium text-amber-600">{formatDate(lead.followUpDate)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
