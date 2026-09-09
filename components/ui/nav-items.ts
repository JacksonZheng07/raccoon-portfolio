export type NavItem = {
  href: string;
  label: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/notes", label: "Notes" },
  { href: "/#contact", label: "Contact" },
];
