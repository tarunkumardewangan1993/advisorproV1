import "server-only";
import { prisma } from "@/lib/prisma";
import { requireSession, advisorScopeWhere, assertOwnsRecord, ForbiddenError } from "@/lib/authz";
import { daysFromNow } from "@/lib/dates";

export async function listPoliciesForClient(clientId: string) {
  const session = await requireSession();
  return prisma.insurancePolicy.findMany({
    where: { clientId, deletedAt: null, ...advisorScopeWhere(session) },
    orderBy: { dueDate: "asc" },
  });
}

export async function getOwnedPolicyOrThrow(id: string) {
  const session = await requireSession();
  const policy = await prisma.insurancePolicy.findFirst({ where: { id } });
  if (!policy) throw new ForbiddenError("Policy not found");
  assertOwnsRecord(session, policy);
  return policy;
}

export async function listExpiringPolicies(withinDays: number) {
  const session = await requireSession();
  return prisma.insurancePolicy.findMany({
    where: {
      deletedAt: null,
      status: "ACTIVE",
      dueDate: { gte: new Date(), lte: daysFromNow(withinDays) },
      ...advisorScopeWhere(session),
    },
    orderBy: { dueDate: "asc" },
    include: { client: { select: { id: true, name: true, clientUid: true, mobile: true } } },
  });
}
