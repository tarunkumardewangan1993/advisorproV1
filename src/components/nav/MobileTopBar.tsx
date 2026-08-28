"use client";

import { useState } from "react";
import { SECONDARY_NAV } from "./nav-items";
import { NavLink } from "./NavLink";
import { LogoutButton } from "./LogoutButton";

export function MobileTopBar({
  role,
  userName,
  userUid,
}: {
  role: "ADMIN" | "ADVISOR";
  userName: string;
  userUid: string;
}) {
  const [open, setOpen] = useState(false);
  const secondary = SECONDARY_NAV.filter((item) => !item.adminOnly || role === "ADMIN");

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
        <span className="text-base font-semibold text-blue-600">Advisor Pro</span>
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-600 hover:bg-gray-100"
        >
          ☰
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userUid}</p>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {secondary.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  onNavigate={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50"
                />
              ))}
            </nav>
            <div className="border-t border-gray-200 p-3">
              <LogoutButton className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
