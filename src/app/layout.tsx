import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpsCopilot",
  description: "AI Operations Manager for SMBs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
