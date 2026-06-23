import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "../components/Navbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Project Matchmaker",
  description: "Find teammates for hackathons, projects and startups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}