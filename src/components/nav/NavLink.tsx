"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./nav-items";

export function NavLink({ item, onNavigate, className = "" }: { item: NavItem; onNavigate?: () => void; className?: string }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`${className} ${isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"}`}
    >
      <span aria-hidden>{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
}
