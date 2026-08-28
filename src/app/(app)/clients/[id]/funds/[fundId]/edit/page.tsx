import { notFound } from "next/navigation";
import { FundForm } from "@/components/forms/FundForm";
import { updateFund } from "@/lib/actions/funds";
import { getOwnedFundOrThrow } from "@/lib/data/funds";

export default async function EditFundPage({ params }: { params: Promise<{ id: string; fundId: string }> }) {
  const { id, fundId } = await params;
  const fund = await getOwnedFundOrThrow(fundId).catch(() => null);
  if (!fund || fund.clientId !== id) notFound();

  const action = updateFund.bind(null, fundId);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Edit Mutual Fund</h1>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <FundForm action={action} clientId={id} defaults={fund} />
      </div>
    </div>
  );
}
