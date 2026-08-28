import "server-only";
import { prisma } from "@/lib/prisma";
import { requireSession, advisorScopeWhere } from "@/lib/authz";
import { daysFromNow } from "@/lib/dates";

export async function getDashboardData() {
  const session = await requireSession();
  const scope = advisorScopeWhere(session);

  const [clientCount, leadCount, activePolicyCount, activeFundCount, upcomingFollowUps] = await Promise.all([
    prisma.client.count({ where: { deletedAt: null, ...scope } }),
    prisma.lead.count({ where: { deletedAt: null, status: { not: "CONVERTED" }, ...scope } }),
    prisma.insurancePolicy.count({ where: { deletedAt: null, status: "ACTIVE", ...scope } }),
    prisma.mutualFund.count({ where: { deletedAt: null, status: "ACTIVE", ...scope } }),
    prisma.interaction.findMany({
      where: {
        deletedAt: null,
        followUpDate: { gte: new Date(), lte: daysFromNow(7) },
        ...scope,
      },
      orderBy: { followUpDate: "asc" },
      take: 5,
      include: { client: { select: { id: true, name: true, clientUid: true } } },
    }),
  ]);

  return { clientCount, leadCount, activePolicyCount, activeFundCount, upcomingFollowUps };
}
