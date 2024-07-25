import { auth } from "@/auth";
import { SideBar } from "@/components/sidebar";

export default async function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  const user = session?.user;

  if (!user) return <div>Unauthorized</div>;
  return (
    <div className="flex md:flex-col lg:flex-row h-full overflow-hidden">
      {/* Keep overflow-hidden. Only show for medium and bigger screens */}
      <div className="w-1/4 overflow-hidden hidden md:block">
        <SideBar user={user} />
      </div>
      {/* Only show for small screens */}
      <div className="block md:hidden">
        <SideBar user={user} />
      </div>
      <div className="   w-full  overflow-y-auto bg-gradient-to-r from-slate-100 to-slate-300 h-full">
        {children}
      </div>{" "}
      {/* This div now has normal auto overflow */}
    </div>
  );
}
