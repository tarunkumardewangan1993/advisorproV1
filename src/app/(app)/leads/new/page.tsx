import { LeadForm } from "@/components/forms/LeadForm";
import { createLead } from "@/lib/actions/leads";

export default function NewLeadPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">New Lead</h1>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <LeadForm action={createLead} />
      </div>
    </div>
  );
}
