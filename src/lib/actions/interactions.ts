"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { interactionSchema } from "@/lib/validations/interaction";
import { requireSession } from "@/lib/authz";
import { getOwnedClientOrThrow } from "@/lib/data/clients";
import { getOwnedInteractionOrThrow } from "@/lib/data/interactions";
import { toDate, toDateOrNull } from "@/lib/dates";
import type { ActionState } from "@/lib/actions/types";

export async function createInteraction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireSession();

  const parsed = interactionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;
  const client = await getOwnedClientOrThrow(data.clientId);

  await prisma.interaction.create({
    data: {
      clientId: client.id,
      advisorId: session.user.id,
      type: data.type,
      notes: data.notes,
      interactionDate: toDate(data.interactionDate),
      followUpDate: toDateOrNull(data.followUpDate),
    },
  });

  revalidatePath(`/clients/${client.id}`);
  revalidatePath("/follow-ups");
  redirect(`/clients/${client.id}`);
}

export async function updateInteraction(id: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  const existing = await getOwnedInteractionOrThrow(id);

  const parsed = interactionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors, message: "Please fix the errors below" };
  }
  const data = parsed.data;

  await prisma.interaction.update({
    where: { id },
    data: {
      type: data.type,
      notes: data.notes,
      interactionDate: toDate(data.interactionDate),
      followUpDate: toDateOrNull(data.followUpDate),
    },
  });

  revalidatePath(`/clients/${existing.clientId}`);
  revalidatePath("/follow-ups");
  redirect(`/clients/${existing.clientId}`);
}

export async function deleteInteraction(id: string): Promise<void> {
  const existing = await getOwnedInteractionOrThrow(id);
  await prisma.interaction.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath(`/clients/${existing.clientId}`);
  revalidatePath("/follow-ups");
}
