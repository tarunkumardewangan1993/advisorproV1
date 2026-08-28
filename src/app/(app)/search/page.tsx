import Link from "next/link";
import { searchClientsAndLeads } from "@/lib/data/search";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = q ? await searchClientsAndLeads(q) : { clients: [], leads: [] };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Search</h1>

      <form method="GET" className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name, mobile, email, or UID"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
          Search
        </button>
      </form>

      {q && (
        <>
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Clients ({results.clients.length})</h2>
            {results.clients.length === 0 ? (
              <p className="text-sm text-gray-500">No matching clients.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {results.clients.map((client) => (
                  <li key={client.id}>
                    <Link href={`/clients/${client.id}`} className="block py-2.5 text-sm hover:text-blue-600">
                      <span className="font-medium text-gray-900">{client.name}</span>{" "}
                      <span className="text-xs text-gray-500">
                        {client.clientUid} · {client.mobile ?? "no mobile"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Leads ({results.leads.length})</h2>
            {results.leads.length === 0 ? (
              <p className="text-sm text-gray-500">No matching leads.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {results.leads.map((lead) => (
                  <li key={lead.id}>
                    <Link href={`/leads/${lead.id}`} className="block py-2.5 text-sm hover:text-blue-600">
                      <span className="font-medium text-gray-900">{lead.name}</span>{" "}
                      <span className="text-xs text-gray-500">
                        {lead.leadUid} · {lead.mobile ?? "no mobile"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
