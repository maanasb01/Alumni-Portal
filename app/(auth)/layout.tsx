

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex md:flex-col lg:flex-row ">

      <div className=" w-full pt-5 pb-10  overflow-y-auto  h-full bg-gradient-to-r from-slate-50 to-slate-300">
        {children}
      </div>{" "}
     
    </div>
  );
}
