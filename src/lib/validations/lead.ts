import { z } from "zod";

export const leadStatusEnum = z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"]);

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.union([z.string().trim().email("Invalid email"), z.literal("")]).optional(),
  mobile: z
    .union([z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, "Invalid mobile number"), z.literal("")])
    .optional(),
  source: z.string().trim().optional(),
  status: leadStatusEnum.optional(),
  notes: z.string().trim().optional(),
  followUpDate: z.union([z.string().trim().min(1), z.literal("")]).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
