import { notFound } from "next/navigation";
import { PolicyForm } from "@/components/forms/PolicyForm";
import { updatePolicy } from "@/lib/actions/policies";
import { getOwnedPolicyOrThrow } from "@/lib/data/policies";

export default async function EditPolicyPage({ params }: { params: Promise<{ id: string; policyId: string }> }) {
  const { id, policyId } = await params;
  const policy = await getOwnedPolicyOrThrow(policyId).catch(() => null);
  if (!policy || policy.clientId !== id) notFound();

  const action = updatePolicy.bind(null, policyId);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Edit Insurance Policy</h1>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <PolicyForm action={action} clientId={id} defaults={policy} />
      </div>
    </div>
  );
}
