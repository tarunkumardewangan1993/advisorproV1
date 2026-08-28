export type NavItem = {
  href: string;
  label: string;
  icon: string; // single emoji glyph, kept dependency-free
  adminOnly?: boolean;
};

/** Shown in the mobile bottom tab bar and mirrored at the top of the desktop sidebar. */
export const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/clients", label: "Clients", icon: "👥" },
  { href: "/leads", label: "Leads", icon: "🧭" },
  { href: "/follow-ups", label: "Follow-ups", icon: "🔔" },
  { href: "/search", label: "Search", icon: "🔍" },
];

/** Shown only in the hamburger drawer (mobile) and lower sidebar (desktop). */
export const SECONDARY_NAV: NavItem[] = [
  { href: "/reports/expiry", label: "Expiry Report", icon: "📅" },
  { href: "/users", label: "Users", icon: "🛡️", adminOnly: true },
  { href: "/profile", label: "Profile", icon: "⚙️" },
];
