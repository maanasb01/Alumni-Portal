import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppBar } from "@/components/app-bar";
import { SideBar } from "@/components/sidebar";

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
      <body className={`${inter.className} overflow-hidden`}>
        <AppBar />
        
        <div className="flex flex-col lg:flex-row">
          <div className="w-1/4 h-screen overflow-hidden"> {/* Keep overflow-hidden here */}
            <SideBar />
          </div>
          <div className=" pb-32 px-2 pt-4 w-full h-screen overflow-y-auto bg-gray-200">{children}</div> {/* This div now has normal auto overflow */}
        </div>
      </body>
    </html>
  );
}

