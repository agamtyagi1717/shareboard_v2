import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProvider,
} from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShareBoard",
  description: "Effortlessly Share Files 🌐, Establish Direct Connections 🤝, and Engage in Instant Messaging 💬 with ShareBoard!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
