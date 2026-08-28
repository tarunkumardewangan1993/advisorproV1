import { InteractionForm } from "@/components/forms/InteractionForm";
import { createInteraction } from "@/lib/actions/interactions";

export default async function NewInteractionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Log Interaction</h1>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <InteractionForm action={createInteraction} clientId={id} />
      </div>
    </div>
  );
}
