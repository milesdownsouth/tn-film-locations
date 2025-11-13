import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TN Film Locations | Tennessee Film Location Scouting",
  description: "Discover and manage film locations across Tennessee. Find the perfect setting for your next production with our comprehensive location database.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
