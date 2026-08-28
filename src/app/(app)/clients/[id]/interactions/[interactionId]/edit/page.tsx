import { notFound } from "next/navigation";
import { InteractionForm } from "@/components/forms/InteractionForm";
import { updateInteraction } from "@/lib/actions/interactions";
import { getOwnedInteractionOrThrow } from "@/lib/data/interactions";

export default async function EditInteractionPage({ params }: { params: Promise<{ id: string; interactionId: string }> }) {
  const { id, interactionId } = await params;
  const interaction = await getOwnedInteractionOrThrow(interactionId).catch(() => null);
  if (!interaction || interaction.clientId !== id) notFound();

  const action = updateInteraction.bind(null, interactionId);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Edit Interaction</h1>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <InteractionForm action={action} clientId={id} defaults={interaction} />
      </div>
    </div>
  );
}
