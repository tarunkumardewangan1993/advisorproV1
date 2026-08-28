import "server-only";
import { auth } from "@/auth";
import type { Session } from "next-auth";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Resolves and requires an authenticated, active session. Throws for every
 * server action / route handler / server component that needs a signed-in
 * user — call this first, always.
 */
export async function requireSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  return session;
}

/** Throws unless the session belongs to an ADMIN. */
export async function requireAdmin(): Promise<Session> {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") throw new ForbiddenError("Admin access required");
  return session;
}

/**
 * The single ownership rule for the whole app: ADMIN can access anything,
 * ADVISOR can only access rows where `advisorId` equals their own user id.
 *
 * Every resource query/mutation (clients, leads, policies, funds,
 * interactions, search, follow-ups, reports) MUST go through this helper —
 * never hand-roll a `where` clause for advisor scoping elsewhere.
 */
export function advisorScopeWhere(session: Session): { advisorId?: string } {
  if (session.user.role === "ADMIN") return {};
  return { advisorId: session.user.id };
}

/**
 * Asserts a specific record's advisorId is accessible to the current
 * session (ADMIN always passes; ADVISOR must own it). Use after fetching a
 * single record by id, before returning/mutating it.
 */
export function assertOwnsRecord(session: Session, record: { advisorId: string }): void {
  if (session.user.role === "ADMIN") return;
  if (record.advisorId !== session.user.id) {
    throw new ForbiddenError("You do not have access to this record");
  }
}
