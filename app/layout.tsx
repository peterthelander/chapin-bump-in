import type { Metadata } from "next";
import "./globals.css";
import { NavTabs } from "@/components/NavTabs";
import { UserProvider } from "@/components/UserProvider";

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
        <UserProvider>
          <div className="app-shell">
            <header className="top-nav">
              <p className="eyebrow">Mobile Social Game</p>
              <h1>Chapin Bump In</h1>
              <NavTabs />
            </header>
            <main className="main-content">{children}</main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
