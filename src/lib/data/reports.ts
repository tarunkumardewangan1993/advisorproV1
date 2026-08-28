import "server-only";
import { listExpiringPolicies } from "@/lib/data/policies";
import { listExpiringSips } from "@/lib/data/funds";

export async function getExpiryReport(withinDays: number) {
  const [policies, funds] = await Promise.all([
    listExpiringPolicies(withinDays),
    listExpiringSips(withinDays),
  ]);
  return { policies, funds };
}
