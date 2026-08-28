import "server-only";
import { prisma } from "@/lib/prisma";
import { requireSession, advisorScopeWhere, assertOwnsRecord, ForbiddenError } from "@/lib/authz";
import { daysFromNow } from "@/lib/dates";

export async function listFundsForClient(clientId: string) {
  const session = await requireSession();
  return prisma.mutualFund.findMany({
    where: { clientId, deletedAt: null, ...advisorScopeWhere(session) },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOwnedFundOrThrow(id: string) {
  const session = await requireSession();
  const fund = await prisma.mutualFund.findFirst({ where: { id } });
  if (!fund) throw new ForbiddenError("Fund not found");
  assertOwnsRecord(session, fund);
  return fund;
}

export async function listExpiringSips(withinDays: number) {
  const session = await requireSession();
  return prisma.mutualFund.findMany({
    where: {
      deletedAt: null,
      status: "ACTIVE",
      investmentType: "SIP",
      sipDueDate: { gte: new Date(), lte: daysFromNow(withinDays) },
      ...advisorScopeWhere(session),
    },
    orderBy: { sipDueDate: "asc" },
    include: { client: { select: { id: true, name: true, clientUid: true, mobile: true } } },
  });
}
