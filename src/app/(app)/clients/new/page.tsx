import { ClientForm } from "@/components/forms/ClientForm";
import { createClient } from "@/lib/actions/clients";

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">New Client</h1>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <ClientForm action={createClient} />
      </div>
    </div>
  );
}
