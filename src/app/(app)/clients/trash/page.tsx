import Link from "next/link";
import { listTrashedClients } from "@/lib/data/clients";
import { restoreClient, permanentlyDeleteClient } from "@/lib/actions/clients";
import { requireSession } from "@/lib/authz";
import { formatDate } from "@/lib/dates";
import { ConfirmForm } from "@/components/ui/ConfirmForm";

export default async function ClientTrashPage() {
  const session = await requireSession();
  const clients = await listTrashedClients();
  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Trashed Clients</h1>
        <Link href="/clients" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          Back to Clients
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm ring-1 ring-gray-200">
          Trash is empty.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          {clients.map((client) => (
            <li key={client.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{client.name}</p>
                <p className="text-xs text-gray-500">
                  {client.clientUid} · deleted {formatDate(client.deletedAt)}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                <ConfirmForm
                  action={restoreClient.bind(null, client.id)}
                  confirmMessage="Restore this client and its records?"
                  className="text-blue-600"
                >
                  Restore
                </ConfirmForm>
                {isAdmin && (
                  <ConfirmForm
                    action={permanentlyDeleteClient.bind(null, client.id)}
                    confirmMessage="Permanently delete this client? This cannot be undone."
                    className="text-red-600"
                  >
                    Delete forever
                  </ConfirmForm>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
