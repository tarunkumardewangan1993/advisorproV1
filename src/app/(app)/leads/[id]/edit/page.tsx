import { notFound } from "next/navigation";
import { LeadForm } from "@/components/forms/LeadForm";
import { updateLead } from "@/lib/actions/leads";
import { getLeadById } from "@/lib/data/leads";

export default async function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadById(id);
  if (!lead) notFound();

  const action = updateLead.bind(null, id);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Edit Lead</h1>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <LeadForm action={action} defaults={lead} />
      </div>
    </div>
  );
}
