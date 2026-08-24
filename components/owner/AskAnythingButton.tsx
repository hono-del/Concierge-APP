import Link from "next/link";
import { IconGlyph } from "@/components/ui/IconGlyph";

export function AskAnythingButton() {
  return (
    <Link
      href="/owner/support/new"
      className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <IconGlyph name="chat" size={20} />
      困りごとを相談する
    </Link>
  );
}
