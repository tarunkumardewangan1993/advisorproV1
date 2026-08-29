import "server-only";
import { prisma } from "@/lib/prisma";
import { requireSession, advisorScopeWhere } from "@/lib/authz";

/** Parses a query as a calendar date (e.g. "1993-05-10" or "10 May 1993"), if it looks like one. */
function parseDobQuery(query: string): { gte: Date; lt: Date } | null {
  const parsed = new Date(query);
  if (Number.isNaN(parsed.getTime())) return null;
  // Guard against Date parsing short numeric strings (e.g. "20") as years.
  if (!/\d{4}/.test(query) && !/\d{1,2}[/\-.]\d{1,2}/.test(query)) return null;

  const gte = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  const lt = new Date(gte);
  lt.setDate(lt.getDate() + 1);
  return { gte, lt };
}

export async function searchClientsAndLeads(query: string) {
  const session = await requireSession();
  const scope = advisorScopeWhere(session);
  const q = query.trim();
  if (!q) return { clients: [], leads: [] };

  const dobRange = parseDobQuery(q);

  const clientFilter = [
    { name: { contains: q, mode: "insensitive" as const } },
    { mobile: { contains: q } },
    { email: { contains: q, mode: "insensitive" as const } },
    { clientUid: { contains: q, mode: "insensitive" as const } },
    { policies: { some: { policyNumber: { contains: q, mode: "insensitive" as const }, deletedAt: null } } },
    { policies: { some: { policyUid: { contains: q, mode: "insensitive" as const }, deletedAt: null } } },
    ...(dobRange ? [{ dob: dobRange }] : []),
  ];

  const leadTextFilter = [
    { name: { contains: q, mode: "insensitive" as const } },
    { mobile: { contains: q } },
    { email: { contains: q, mode: "insensitive" as const } },
    { leadUid: { contains: q, mode: "insensitive" as const } },
  ];

  const [clients, leads] = await Promise.all([
    prisma.client.findMany({
      where: { deletedAt: null, ...scope, OR: clientFilter },
      take: 20,
      orderBy: { createdAt: "desc" },
    }),
    prisma.lead.findMany({
      where: { deletedAt: null, ...scope, OR: leadTextFilter },
      take: 20,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { clients, leads };
}
