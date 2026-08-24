"use client";
import { useRouter } from "next/navigation";
import { IconGlyph } from "@/components/ui/IconGlyph";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="前の画面へ戻る"
      className="flex h-9 w-9 items-center justify-center rounded-full text-text hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <IconGlyph name="chevron-left" size={20} />
    </button>
  );
}
