import { IconGlyph } from "./IconGlyph";

interface WarningBannerProps {
  children: string;
}

export function WarningBanner({ children }: WarningBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-attention"
    >
      <IconGlyph name="alert-triangle" size={18} className="mt-0.5 shrink-0" />
      <p>{children}</p>
    </div>
  );
}
