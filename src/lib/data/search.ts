import "server-only";
import { prisma } from "@/lib/prisma";
import { requireSession, advisorScopeWhere } from "@/lib/authz";

export async function searchClientsAndLeads(query: string) {
  const session = await requireSession();
  const scope = advisorScopeWhere(session);
  const q = query.trim();
  if (!q) return { clients: [], leads: [] };

  const textFilter = [
    { name: { contains: q, mode: "insensitive" as const } },
    { mobile: { contains: q } },
    { email: { contains: q, mode: "insensitive" as const } },
    { clientUid: { contains: q, mode: "insensitive" as const } },
  ];

  const leadTextFilter = [
    { name: { contains: q, mode: "insensitive" as const } },
    { mobile: { contains: q } },
    { email: { contains: q, mode: "insensitive" as const } },
    { leadUid: { contains: q, mode: "insensitive" as const } },
  ];

  const [clients, leads] = await Promise.all([
    prisma.client.findMany({
      where: { deletedAt: null, ...scope, OR: textFilter },
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
