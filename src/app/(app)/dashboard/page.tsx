import Link from "next/link";
import { getDashboardData } from "@/lib/data/dashboard";
import { formatDate } from "@/lib/dates";

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md"
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </Link>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Clients" value={data.clientCount} href="/clients" />
        <StatCard label="Open Leads" value={data.leadCount} href="/leads" />
        <StatCard label="Active Policies" value={data.activePolicyCount} href="/reports/expiry" />
        <StatCard label="Active Funds" value={data.activeFundCount} href="/reports/expiry" />
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Upcoming follow-ups (next 7 days)</h2>
          <Link href="/follow-ups" className="text-xs font-medium text-blue-600">
            View all
          </Link>
        </div>
        {data.upcomingFollowUps.length === 0 ? (
          <p className="text-sm text-gray-500">No follow-ups scheduled this week.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {data.upcomingFollowUps.map((interaction) => (
              <li key={interaction.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <Link href={`/clients/${interaction.client.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                    {interaction.client.name}
                  </Link>
                  <p className="text-xs text-gray-500">{interaction.client.clientUid}</p>
                </div>
                <span className="text-xs text-gray-500">{formatDate(interaction.followUpDate)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
