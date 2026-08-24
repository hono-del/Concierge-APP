import type { ReactNode } from "react";
import { ManufacturerHeader } from "@/components/layout/ManufacturerHeader";

export default function ManufacturerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <ManufacturerHeader />
      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
