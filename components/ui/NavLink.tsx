"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
};

/**
 * Whether `href` names the route currently being viewed.
 *
 * Exported for the unit test. Hash destinations like `/#about` are sections
 * of the home page rather than routes of their own, so they are never marked
 * current: `aria-current="page"` would then be on two items at once when the
 * home page is open. `trailingSlash` is on, so both sides are normalised
 * before comparing, and a case study counts as being inside `/work`.
 */
export function isCurrentRoute(href: string, pathname: string): boolean {
  if (href.includes("#")) {
    return false;
  }
  const normalise = (value: string) =>
    value.endsWith("/") ? value : `${value}/`;
  const target = normalise(href);
  const here = normalise(pathname);
  return target === "/" ? here === "/" : here.startsWith(target);
}

/**
 * A nav destination that knows whether it is the page you are on. The only
 * client component in the site chrome: the layout is a Server Component and
 * the active route is the one thing it cannot know at build time.
 */
export function NavLink({
  href,
  children,
  className,
  onNavigate,
}: NavLinkProps) {
  const pathname = usePathname();
  const current = isCurrentRoute(href, pathname);

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      onClick={onNavigate}
      className={className}
    >
      {children}
    </Link>
  );
}
