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
      <body className={`${inter.className} overflow-hidden flex flex-col`}>
        <AppBar />
        
        <div className="flex md:flex-col lg:flex-row">
          {/* Keep overflow-hidden. Only show for medium and bigger screens */}
          <div className="w-1/4 h-screen overflow-hidden hidden md:block"> 
            <SideBar />
          </div>
          {/* Only show for small screens */}
          <div className="block md:hidden"><SideBar /></div>
          <div className=" pb-32 px-2 pt-4 w-full h-screen overflow-y-auto bg-gray-200">{children}</div> {/* This div now has normal auto overflow */}
        </div>
      </body>
    </html>
  );
}

