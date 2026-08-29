import Link from "next/link";
import { getExpiryReport } from "@/lib/data/reports";
import { ExpiryReportView } from "@/components/reports/ExpiryReportView";

const RANGE_OPTIONS = [7, 15, 30, 60, 90];

export default async function ExpiryReportPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const { days: daysParam } = await searchParams;
  const days = RANGE_OPTIONS.includes(Number(daysParam)) ? Number(daysParam) : 30;
  const { term, health, mutual } = await getExpiryReport(days);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Reports</h1>

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

      <ExpiryReportView days={days} term={term} health={health} mutual={mutual} />
    </div>
  );
}
