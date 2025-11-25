import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { checkAuth } from "@/lib/auth-middleware";

export const metadata: Metadata = {
  title: "TN Film Locations | Tennessee Film Location Scouting",
  description: "Discover and manage film locations across Tennessee. Find the perfect setting for your next production with our comprehensive location database.",
};

// Mark layout as dynamic since we use cookies for authentication
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authCheck = await checkAuth();
  const isLoggedIn = !!authCheck.user;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Antonio:wght@100..700&family=Open+Sans:wght@300..800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer isLoggedIn={isLoggedIn} />
      </body>
    </html>
  );
}
