import type { ReactNode } from "react";
import { AgentHeader } from "@/components/layout/AgentHeader";

export default function AgentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <AgentHeader />
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
