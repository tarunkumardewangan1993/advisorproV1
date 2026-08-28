import Link from "next/link";
import { listClients } from "@/lib/data/clients";
import { calculateAge } from "@/lib/dates";

export default async function ClientsPage() {
  const clients = await listClients();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Clients</h1>
        <div className="flex gap-2">
          <Link href="/clients/trash" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            Trash
          </Link>
          <Link
            href="/clients/new"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Client
          </Link>
        </div>
      </div>

      {clients.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm ring-1 ring-gray-200">
          No clients yet.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          {clients.map((client) => {
            const age = calculateAge(client.dob);
            return (
              <li key={client.id}>
                <Link href={`/clients/${client.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{client.name}</p>
                    <p className="text-xs text-gray-500">
                      {client.clientUid} · {client.mobile ?? "no mobile"} {age !== null && `· ${age} yrs`}
                    </p>
                  </div>
                  <span className="text-gray-400">›</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
