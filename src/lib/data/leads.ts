import "server-only";
import { prisma } from "@/lib/prisma";
import { requireSession, advisorScopeWhere, assertOwnsRecord, ForbiddenError } from "@/lib/authz";

export async function listLeads() {
  const session = await requireSession();
  return prisma.lead.findMany({
    where: { deletedAt: null, ...advisorScopeWhere(session) },
    orderBy: { createdAt: "desc" },
    include: { advisor: { select: { id: true, name: true, userUid: true } } },
  });
}

export async function getLeadById(id: string) {
  const session = await requireSession();
  const lead = await prisma.lead.findFirst({
    where: { id },
    include: {
      advisor: { select: { id: true, name: true, userUid: true } },
      convertedToClient: true,
    },
  });
  if (!lead) return null;
  assertOwnsRecord(session, lead);
  return lead;
}

export async function getOwnedLeadOrThrow(id: string) {
  const session = await requireSession();
  const lead = await prisma.lead.findFirst({ where: { id } });
  if (!lead) throw new ForbiddenError("Lead not found");
  assertOwnsRecord(session, lead);
  return lead;
}
