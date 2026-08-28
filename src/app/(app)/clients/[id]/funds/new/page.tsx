import { FundForm } from "@/components/forms/FundForm";
import { createFund } from "@/lib/actions/funds";

export default async function NewFundPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">New Mutual Fund</h1>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <FundForm action={createFund} clientId={id} />
      </div>
    </div>
  );
}
