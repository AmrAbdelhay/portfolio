import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creative Portfolio",
  description: "Portfolio of Amr Ahmed Abdelhay — Digital Marketing & Brand Growth Specialist.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
