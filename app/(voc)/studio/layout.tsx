import type { ReactNode } from "react";
import { StudioSubNav } from "@/components/voc/studio/StudioSubNav";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-5">
      <StudioSubNav />
      {children}
    </div>
  );
}
