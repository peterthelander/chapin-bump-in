"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="nav-tabs" aria-label="Main navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link key={item.href} href={item.href} className={`nav-pill ${isActive ? "active" : ""}`.trim()}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
