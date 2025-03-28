import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kanban Board with Backend",
  description:
    "A kanban board application with authentication and backend functionality",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 mx-24">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
