import { PRIMARY_NAV } from "./nav-items";
import { NavLink } from "./NavLink";

export function BottomTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden">
      {PRIMARY_NAV.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium"
        />
      ))}
    </nav>
  );
}
