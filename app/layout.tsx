import type { Metadata } from "next";
import { Frame } from "@/components/ui/Frame";
import { TopNav } from "@/components/ui/TopNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jackson Zheng — Field Notes",
  description:
    "Field notes from a raccoon naturalist: software, systems, and math by Jackson Zheng.",
};

const FOOTER_LINKS = [
  { href: "https://github.com/JacksonZheng07", label: "github" },
  { href: "mailto:jacksonzheng425@gmail.com", label: "email" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Frame>
          <TopNav />
          {children}
          <footer className="flex justify-between border-t-2 border-line px-[65px] py-[22px] font-mono text-[11px] uppercase max-[740px]:block max-[740px]:px-[23px] max-[740px]:py-5">
            <span className="max-[740px]:my-1 max-[740px]:block">
              © 2026 Jackson Zheng
            </span>
            <span className="max-[740px]:my-1 max-[740px]:block">
              {FOOTER_LINKS.map((link, index) => (
                <span key={link.href}>
                  {index > 0 ? <span aria-hidden="true"> · </span> : null}
                  <a
                    href={link.href}
                    className="text-ink underline decoration-1 underline-offset-2"
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </span>
          </footer>
        </Frame>
      </body>
    </html>
  );
}
