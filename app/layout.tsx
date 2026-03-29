import type { Metadata } from "next";
import "./globals.css";
import { NavTabs } from "@/components/NavTabs";

export const metadata: Metadata = {
  title: "Chapin Bump In",
  description: "A location-based social game for the Chapin community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="top-nav">
            <p className="eyebrow">Mobile Social Game</p>
            <h1>Chapin Bump In</h1>
            <NavTabs />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
