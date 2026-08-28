import { PRIMARY_NAV, SECONDARY_NAV } from "./nav-items";
import { NavLink } from "./NavLink";
import { LogoutButton } from "./LogoutButton";

export function Sidebar({ role, userName, userUid }: { role: "ADMIN" | "ADVISOR"; userName: string; userUid: string }) {
  const secondary = SECONDARY_NAV.filter((item) => !item.adminOnly || role === "ADMIN");

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-gray-200 bg-white md:flex">
      <div className="flex h-16 items-center border-b border-gray-200 px-5">
        <span className="text-lg font-semibold text-blue-600">Advisor Pro</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {PRIMARY_NAV.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50"
          />
        ))}

        <div className="my-2 border-t border-gray-100" />

        {secondary.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50"
          />
        ))}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <div className="mb-2 px-3 text-xs text-gray-500">
          <p className="font-medium text-gray-700">{userName}</p>
          <p>{userUid}</p>
        </div>
        <LogoutButton className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900" />
      </div>
    </aside>
  );
}
