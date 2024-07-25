import { SideBar } from "@/components/sidebar";

export default function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex md:flex-col lg:flex-row h-full overflow-hidden">
      {/* Keep overflow-hidden. Only show for medium and bigger screens */}
      <div className="w-1/4 overflow-hidden hidden md:block">
        <SideBar />
      </div>
      {/* Only show for small screens */}
      <div className="block md:hidden">
        <SideBar />
      </div>
      <div className="   w-full  overflow-y-auto bg-gradient-to-r from-slate-100 to-slate-300 h-full">
        {children}
      </div>{" "}
      {/* This div now has normal auto overflow */}
    </div>
  );
}
