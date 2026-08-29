import { z } from "zod";

export const premiumFrequencyEnum = z.enum(["MONTHLY", "QUARTERLY", "HALF_YEARLY", "YEARLY", "SINGLE"]);
export const policyStatusEnum = z.enum(["ACTIVE", "LAPSED", "MATURED", "CANCELLED"]);
export const policyCategoryEnum = z.enum(["TERM", "HEALTH"]);

export const policySchema = z.object({
  clientId: z.string().uuid(),
  category: policyCategoryEnum,
  policyNumber: z.string().trim().min(1, "Policy number is required"),
  insurer: z.string().trim().min(1, "Insurer is required"),
  planName: z.string().trim().min(1, "Plan name is required"),
  sumAssured: z.coerce.number().positive("Must be a positive amount"),
  premiumAmount: z.coerce.number().positive("Must be a positive amount"),
  premiumFrequency: premiumFrequencyEnum,
  startDate: z.string().trim().min(1, "Start date is required"),
  dueDate: z.string().trim().min(1, "Due date is required"),
  maturityDate: z.union([z.string().trim().min(1), z.literal("")]).optional(),
  status: policyStatusEnum.optional(),
  notes: z.string().trim().optional(),
});

export type PolicyInput = z.infer<typeof policySchema>;
