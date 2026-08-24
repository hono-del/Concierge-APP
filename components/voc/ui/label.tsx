import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/voc/cn";

export function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn("text-xs font-semibold uppercase tracking-wide text-slate-500", className)}
      {...props}
    />
  );
}
