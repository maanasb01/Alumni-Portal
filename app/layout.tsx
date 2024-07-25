import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppBar } from "@/components/app-bar";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alumni Portal",
  description: "Alumni Portal for Alumni to Stay Connected",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col h-dvh`}>
        <div className="grow-0"><AppBar /></div>
        <div className="flex-grow overflow-auto"> {children}</div>
        
        </body>
    </html>
  );
}

