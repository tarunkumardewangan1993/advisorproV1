"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { nextUid } from "@/lib/uid";
import { clientSchema } from "@/lib/validations/client";
import { requireSession, requireAdmin } from "@/lib/authz";
import { getOwnedClientOrThrow } from "@/lib/data/clients";
import { toDateOrNull } from "@/lib/dates";
import type { ActionState } from "@/lib/actions/types";

export async function createClient(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSession();

  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;

  const client = await prisma.$transaction(async (tx) => {
    const clientUid = await nextUid(tx, "CLIENT");
    return tx.client.create({
      data: {
        clientUid,
        advisorId: session.user.id,
        name: data.name,
        email: data.email || null,
        mobile: data.mobile || null,
        dob: toDateOrNull(data.dob),
        address: data.address || null,
        notes: data.notes || null,
      },
    });
  });

  revalidatePath("/clients");
  redirect(`/clients/${client.id}`);
}

export async function updateClient(id: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await getOwnedClientOrThrow(id);

  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;

  await prisma.client.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email || null,
      mobile: data.mobile || null,
      dob: toDateOrNull(data.dob),
      address: data.address || null,
      notes: data.notes || null,
    },
  });

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  return { status: "success", message: "Client updated" };
}

/** Soft-deletes a client and cascades to its policies, funds, and interactions. */
export async function softDeleteClient(id: string): Promise<never> {
  await getOwnedClientOrThrow(id);
  const now = new Date();

  await prisma.$transaction([
    prisma.client.update({ where: { id }, data: { deletedAt: now } }),
    prisma.insurancePolicy.updateMany({ where: { clientId: id, deletedAt: null }, data: { deletedAt: now } }),
    prisma.mutualFund.updateMany({ where: { clientId: id, deletedAt: null }, data: { deletedAt: now } }),
    prisma.interaction.updateMany({ where: { clientId: id, deletedAt: null }, data: { deletedAt: now } }),
  ]);

  revalidatePath("/clients");
  revalidatePath("/clients/trash");
  redirect("/clients");
}

export async function restoreClient(id: string): Promise<void> {
  const session = await requireSession();
  const client = await prisma.client.findFirst({ where: { id } });
  if (!client) return;
  if (session.user.role !== "ADMIN" && client.advisorId !== session.user.id) return;

  await prisma.$transaction([
    prisma.client.update({ where: { id }, data: { deletedAt: null } }),
    prisma.insurancePolicy.updateMany({ where: { clientId: id }, data: { deletedAt: null } }),
    prisma.mutualFund.updateMany({ where: { clientId: id }, data: { deletedAt: null } }),
    prisma.interaction.updateMany({ where: { clientId: id }, data: { deletedAt: null } }),
  ]);

  revalidatePath("/clients");
  revalidatePath("/clients/trash");
}

/** Admin-only: irreversibly deletes a client and all child records. */
export async function permanentlyDeleteClient(id: string): Promise<void> {
  await requireAdmin();

  await prisma.$transaction([
    prisma.interaction.deleteMany({ where: { clientId: id } }),
    prisma.insurancePolicy.deleteMany({ where: { clientId: id } }),
    prisma.mutualFund.deleteMany({ where: { clientId: id } }),
    prisma.lead.updateMany({ where: { convertedToClientId: id }, data: { convertedToClientId: null } }),
    prisma.lead.updateMany({ where: { revertedFromClientId: id }, data: { revertedFromClientId: null } }),
    prisma.client.delete({ where: { id } }),
  ]);

  revalidatePath("/clients");
  revalidatePath("/clients/trash");
}

/**
 * Reverts a client back to a lead: soft-deletes the client (cascading to its
 * children) and creates a new Lead row carrying the contact details, linked
 * back to the client via the revertedFromClientId FK.
 */
export async function revertClientToLead(id: string): Promise<never> {
  const client = await getOwnedClientOrThrow(id);
  const now = new Date();

  const lead = await prisma.$transaction(async (tx) => {
    const leadUid = await nextUid(tx, "LEAD");
    const newLead = await tx.lead.create({
      data: {
        leadUid,
        advisorId: client.advisorId,
        name: client.name,
        email: client.email,
        mobile: client.mobile,
        status: "QUALIFIED",
        notes: client.notes,
        revertedFromClientId: client.id,
      },
    });

    await tx.client.update({ where: { id: client.id }, data: { deletedAt: now } });
    await tx.insurancePolicy.updateMany({ where: { clientId: client.id, deletedAt: null }, data: { deletedAt: now } });
    await tx.mutualFund.updateMany({ where: { clientId: client.id, deletedAt: null }, data: { deletedAt: now } });
    await tx.interaction.updateMany({ where: { clientId: client.id, deletedAt: null }, data: { deletedAt: now } });

    return newLead;
  });

  revalidatePath("/clients");
  revalidatePath("/leads");
  redirect(`/leads/${lead.id}`);
}
