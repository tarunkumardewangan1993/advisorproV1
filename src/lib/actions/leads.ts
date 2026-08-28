"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { nextUid } from "@/lib/uid";
import { leadSchema, leadStatusEnum } from "@/lib/validations/lead";
import { requireSession } from "@/lib/authz";
import { getOwnedLeadOrThrow } from "@/lib/data/leads";
import { toDateOrNull } from "@/lib/dates";
import type { ActionState } from "@/lib/actions/types";

export async function createLead(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSession();

  const parsed = leadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;

  const lead = await prisma.$transaction(async (tx) => {
    const leadUid = await nextUid(tx, "LEAD");
    return tx.lead.create({
      data: {
        leadUid,
        advisorId: session.user.id,
        name: data.name,
        email: data.email || null,
        mobile: data.mobile || null,
        source: data.source || null,
        status: data.status ?? "NEW",
        notes: data.notes || null,
        followUpDate: toDateOrNull(data.followUpDate),
      },
    });
  });

  revalidatePath("/leads");
  redirect(`/leads/${lead.id}`);
}

export async function updateLead(id: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await getOwnedLeadOrThrow(id);

  const parsed = leadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;

  await prisma.lead.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email || null,
      mobile: data.mobile || null,
      source: data.source || null,
      status: data.status ?? undefined,
      notes: data.notes || null,
      followUpDate: toDateOrNull(data.followUpDate),
    },
  });

  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  return { status: "success", message: "Lead updated" };
}

export async function updateLeadStatus(id: string, status: string): Promise<void> {
  await getOwnedLeadOrThrow(id);
  const parsedStatus = leadStatusEnum.parse(status);

  await prisma.lead.update({ where: { id }, data: { status: parsedStatus } });
  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
}

export async function deleteLead(id: string): Promise<never> {
  await getOwnedLeadOrThrow(id);
  await prisma.lead.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath("/leads");
  redirect("/leads");
}

/**
 * Converts a lead into a client: creates a new Client row carrying the
 * contact details, links it back via Lead.convertedToClientId, and marks
 * the lead CONVERTED (the lead row is kept, not deleted, for funnel history).
 */
export async function convertLeadToClient(id: string): Promise<never> {
  const lead = await getOwnedLeadOrThrow(id);
  if (lead.convertedToClientId) {
    redirect(`/clients/${lead.convertedToClientId}`);
  }

  const client = await prisma.$transaction(async (tx) => {
    const clientUid = await nextUid(tx, "CLIENT");
    const newClient = await tx.client.create({
      data: {
        clientUid,
        advisorId: lead.advisorId,
        name: lead.name,
        email: lead.email,
        mobile: lead.mobile,
        notes: lead.notes,
      },
    });

    await tx.lead.update({
      where: { id: lead.id },
      data: { status: "CONVERTED", convertedToClientId: newClient.id },
    });

    return newClient;
  });

  revalidatePath("/leads");
  revalidatePath("/clients");
  redirect(`/clients/${client.id}`);
}
