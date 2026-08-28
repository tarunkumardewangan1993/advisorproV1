import { z } from "zod";

export const interactionTypeEnum = z.enum(["CALL", "MEETING", "EMAIL", "WHATSAPP", "VISIT", "OTHER"]);

export const interactionSchema = z.object({
  clientId: z.string().uuid(),
  type: interactionTypeEnum,
  notes: z.string().trim().min(1, "Notes are required"),
  interactionDate: z.string().trim().min(1, "Interaction date is required"),
  followUpDate: z.union([z.string().trim().min(1), z.literal("")]).optional(),
});

export type InteractionInput = z.infer<typeof interactionSchema>;
