"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/dates";

type PolicyRow = {
  id: string;
  policyUid: string;
  insurer: string;
  dueDate: Date | string;
  client: { id: string; name: string; clientUid: string; mobile: string | null };
};

type FundRow = {
  id: string;
  fundUid: string;
  schemeName: string;
  sipDueDate: Date | string | null;
  client: { id: string; name: string; clientUid: string; mobile: string | null };
};

function matchesQuery(query: string, ...fields: (string | null | undefined)[]) {
  if (!query) return true;
  const needle = query.trim().toLowerCase();
  return fields.some((field) => field?.toLowerCase().includes(needle));
}

export function ExpiryReportView({
  days,
  term,
  health,
  mutual,
}: {
  days: number;
  term: PolicyRow[];
  health: PolicyRow[];
  mutual: FundRow[];
}) {
  const [query, setQuery] = useState("");

  const filteredTerm = useMemo(
    () => term.filter((p) => matchesQuery(query, p.client.name, p.client.mobile, p.client.clientUid, p.policyUid)),
    [term, query]
  );
  const filteredHealth = useMemo(
    () => health.filter((p) => matchesQuery(query, p.client.name, p.client.mobile, p.client.clientUid, p.policyUid)),
    [health, query]
  );
  const filteredMutual = useMemo(
    () => mutual.filter((f) => matchesQuery(query, f.client.name, f.client.mobile, f.client.clientUid, f.fundUid)),
    [mutual, query]
  );

  return (
    <div className="space-y-4">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name, mobile, or UID…"
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <ReportSection
        title={`Term Insurance due within ${days} days`}
        emptyText="No term policies due in this range."
        rows={filteredTerm.map((policy) => ({
          id: policy.id,
          href: `/clients/${policy.client.id}`,
          primary: policy.client.name,
          secondary: `${policy.policyUid} · ${policy.insurer} · ${policy.client.mobile ?? "no mobile"}`,
          due: policy.dueDate,
        }))}
      />

      <ReportSection
        title={`Health Insurance (INC) due within ${days} days`}
        emptyText="No health policies due in this range."
        rows={filteredHealth.map((policy) => ({
          id: policy.id,
          href: `/clients/${policy.client.id}`,
          primary: policy.client.name,
          secondary: `${policy.policyUid} · ${policy.insurer} · ${policy.client.mobile ?? "no mobile"}`,
          due: policy.dueDate,
        }))}
      />

      <ReportSection
        title={`Mutual Fund SIPs due within ${days} days`}
        emptyText="No SIPs due in this range."
        rows={filteredMutual.map((fund) => ({
          id: fund.id,
          href: `/clients/${fund.client.id}`,
          primary: fund.client.name,
          secondary: `${fund.fundUid} · ${fund.schemeName} · ${fund.client.mobile ?? "no mobile"}`,
          due: fund.sipDueDate,
        }))}
      />
    </div>
  );
}

function ReportSection({
  title,
  emptyText,
  rows,
}: {
  title: string;
  emptyText: string;
  rows: { id: string; href: string; primary: string; secondary: string; due: Date | string | null }[];
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">
        {title} ({rows.length})
      </h2>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between py-2.5">
              <div>
                <Link href={row.href} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                  {row.primary}
                </Link>
                <p className="text-xs text-gray-500">{row.secondary}</p>
              </div>
              <span className="text-xs font-medium text-amber-600">{formatDate(row.due)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
