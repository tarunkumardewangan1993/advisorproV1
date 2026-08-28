import Link from "next/link";
import { getExpiryReport } from "@/lib/data/reports";
import { formatDate } from "@/lib/dates";

const RANGE_OPTIONS = [7, 15, 30, 60, 90];

export default async function ExpiryReportPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const { days: daysParam } = await searchParams;
  const days = RANGE_OPTIONS.includes(Number(daysParam)) ? Number(daysParam) : 30;
  const { policies, funds } = await getExpiryReport(days);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Expiry Report</h1>

      <div className="flex flex-wrap gap-2">
        {RANGE_OPTIONS.map((option) => (
          <Link
            key={option}
            href={`/reports/expiry?days=${option}`}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              option === days ? "bg-blue-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-200"
            }`}
          >
            {option} days
          </Link>
        ))}
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Policies due within {days} days ({policies.length})</h2>
        {policies.length === 0 ? (
          <p className="text-sm text-gray-500">No policies due in this range.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {policies.map((policy) => (
              <li key={policy.id} className="flex items-center justify-between py-2.5">
                <div>
                  <Link href={`/clients/${policy.client.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                    {policy.client.name}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {policy.policyUid} · {policy.insurer} · {policy.client.mobile ?? "no mobile"}
                  </p>
                </div>
                <span className="text-xs font-medium text-amber-600">{formatDate(policy.dueDate)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">SIPs due within {days} days ({funds.length})</h2>
        {funds.length === 0 ? (
          <p className="text-sm text-gray-500">No SIPs due in this range.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {funds.map((fund) => (
              <li key={fund.id} className="flex items-center justify-between py-2.5">
                <div>
                  <Link href={`/clients/${fund.client.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                    {fund.client.name}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {fund.fundUid} · {fund.schemeName} · {fund.client.mobile ?? "no mobile"}
                  </p>
                </div>
                <span className="text-xs font-medium text-amber-600">{formatDate(fund.sipDueDate)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
