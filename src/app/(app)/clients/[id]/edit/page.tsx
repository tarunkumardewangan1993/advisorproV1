import { notFound } from "next/navigation";
import { ClientForm } from "@/components/forms/ClientForm";
import { updateClient } from "@/lib/actions/clients";
import { getClientById } from "@/lib/data/clients";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) notFound();

  const action = updateClient.bind(null, id);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Edit Client</h1>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <ClientForm action={action} defaults={client} />
      </div>
    </div>
  );
}
