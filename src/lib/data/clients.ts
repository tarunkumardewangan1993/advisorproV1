import "server-only";
import { prisma } from "@/lib/prisma";
import { requireSession, advisorScopeWhere, assertOwnsRecord, ForbiddenError } from "@/lib/authz";

export async function listClients() {
  const session = await requireSession();
  return prisma.client.findMany({
    where: { deletedAt: null, ...advisorScopeWhere(session) },
    orderBy: { createdAt: "desc" },
    include: { advisor: { select: { id: true, name: true, userUid: true } } },
  });
}

export async function listTrashedClients() {
  const session = await requireSession();
  return prisma.client.findMany({
    where: { deletedAt: { not: null }, ...advisorScopeWhere(session) },
    orderBy: { deletedAt: "desc" },
  });
}

export async function getClientById(id: string) {
  const session = await requireSession();
  const client = await prisma.client.findFirst({
    where: { id },
    include: {
      policies: { where: { deletedAt: null }, orderBy: { dueDate: "asc" } },
      mutualFunds: { where: { deletedAt: null }, orderBy: { createdAt: "desc" } },
      interactions: { where: { deletedAt: null }, orderBy: { interactionDate: "desc" } },
      advisor: { select: { id: true, name: true, userUid: true } },
      convertedFromLead: true,
    },
  });
  if (!client) return null;
  assertOwnsRecord(session, client);
  return client;
}

/** Throws ForbiddenError/UnauthorizedError; use in server actions before mutating. */
export async function getOwnedClientOrThrow(id: string) {
  const session = await requireSession();
  const client = await prisma.client.findFirst({ where: { id } });
  if (!client) throw new ForbiddenError("Client not found");
  assertOwnsRecord(session, client);
  return client;
}
