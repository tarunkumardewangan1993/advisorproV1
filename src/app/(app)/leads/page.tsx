import Link from "next/link";
import { listLeads } from "@/lib/data/leads";

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700",
  CONTACTED: "bg-amber-50 text-amber-700",
  QUALIFIED: "bg-purple-50 text-purple-700",
  CONVERTED: "bg-green-50 text-green-700",
  LOST: "bg-gray-100 text-gray-500",
};

export default async function LeadsPage() {
  const leads = await listLeads();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Leads</h1>
        <Link href="/leads/new" className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
          + New Lead
        </Link>
      </div>

      {leads.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm ring-1 ring-gray-200">
          No leads yet.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          {leads.map((lead) => (
            <li key={lead.id}>
              <Link href={`/leads/${lead.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-500">
                    {lead.leadUid} · {lead.mobile ?? "no mobile"}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[lead.status]}`}>
                  {lead.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
