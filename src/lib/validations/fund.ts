import { z } from "zod";

export const investmentTypeEnum = z.enum(["SIP", "LUMPSUM"]);
export const fundStatusEnum = z.enum(["ACTIVE", "CLOSED"]);

export const fundSchema = z
  .object({
    clientId: z.string().uuid(),
    folioNumber: z.string().trim().min(1, "Folio number is required"),
    amcName: z.string().trim().min(1, "AMC name is required"),
    schemeName: z.string().trim().min(1, "Scheme name is required"),
    investmentType: investmentTypeEnum,
    sipAmount: z.union([z.coerce.number().positive(), z.literal("")]).optional(),
    sipDueDate: z.union([z.string().trim().min(1), z.literal("")]).optional(),
    investedAmount: z.coerce.number().positive("Must be a positive amount"),
    currentValue: z.union([z.coerce.number().nonnegative(), z.literal("")]).optional(),
    startDate: z.string().trim().min(1, "Start date is required"),
    status: fundStatusEnum.optional(),
    notes: z.string().trim().optional(),
  })
  .refine((data) => data.investmentType !== "SIP" || !!data.sipAmount, {
    message: "SIP amount is required for SIP investments",
    path: ["sipAmount"],
  });

export type FundInput = z.infer<typeof fundSchema>;
