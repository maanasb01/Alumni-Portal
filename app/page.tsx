import { poppins } from "@/lib/fonts";
import Link from "next/link";


export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-between p-24 bg-gradient-to-r from-orange-50 to-slate-100">
      

      <div className={`${poppins.className} text-5xl relative  flex justify-center text-center`}>
        Welcome to Alumni Portal
      </div>

      <div className="mb-32 ">
        <Link
          href="/register"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Get Started{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>

          </h2>
          <p className="px-1 m-0 max-w-[30ch] text-sm opacity-50">
            Register Here
          </p>
        </Link>

        
      </div>
    </main>
  );
}
