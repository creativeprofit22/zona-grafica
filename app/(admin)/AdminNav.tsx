"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/analytics", label: "Analytics", exact: false },
  { href: "/admin/content", label: "Content", exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
