import { logoutAction } from "@/lib/actions/logout";

export function LogoutButton({ className = "" }: { className?: string }) {
  return (
    <form action={logoutAction}>
      <button type="submit" className={className}>
        <span aria-hidden>🚪</span>
        <span>Logout</span>
      </button>
    </form>
  );
}
