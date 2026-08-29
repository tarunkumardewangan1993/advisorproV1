import "server-only";
import { listExpiringPolicies } from "@/lib/data/policies";
import { listExpiringSips } from "@/lib/data/funds";

export async function getExpiryReport(withinDays: number) {
  const [policies, funds] = await Promise.all([
    listExpiringPolicies(withinDays),
    listExpiringSips(withinDays),
  ]);

  return {
    term: policies.filter((policy) => policy.category === "TERM"),
    health: policies.filter((policy) => policy.category === "HEALTH"),
    mutual: funds,
  };
}
