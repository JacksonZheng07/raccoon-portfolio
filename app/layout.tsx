import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jackson Zheng — Field Notes",
  description:
    "Field notes from a raccoon naturalist: software, systems, and math by Jackson Zheng.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
