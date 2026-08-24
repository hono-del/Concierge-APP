import type { ReactNode } from "react";

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 sm:flex sm:justify-center sm:py-8">
      <div className="min-h-screen w-full bg-background pb-16 sm:min-h-[calc(100vh-4rem)] sm:max-w-[430px] sm:rounded-[2rem] sm:border sm:border-slate-200 sm:pb-10 sm:shadow-xl">
        {children}
      </div>
    </div>
  );
}
