import { Card, CardBody } from "@/components/ui/Card";
import { IconGlyph, type IconName } from "@/components/ui/IconGlyph";

interface MetricCardProps {
  label: string;
  value: string;
  icon: IconName;
  tone?: "neutral" | "success" | "attention" | "danger";
}

const toneClasses: Record<Required<MetricCardProps>["tone"], string> = {
  neutral: "bg-primary/10 text-primary",
  success: "bg-emerald-50 text-success",
  attention: "bg-amber-50 text-attention",
  danger: "bg-red-50 text-danger",
};

export function MetricCard({ label, value, icon, tone = "neutral" }: MetricCardProps) {
  return (
    <Card>
      <CardBody className="flex items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-full ${toneClasses[tone]}`}>
          <IconGlyph name={icon} size={20} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{label}</p>
          <p className="text-2xl font-bold text-text">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}
