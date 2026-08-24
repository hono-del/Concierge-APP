import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Vehicle } from "@/types";

const statusMeta = {
  normal: { label: "All Good", variant: "success" as const, icon: "check-circle" as const },
  attention: { label: "ご確認ください", variant: "attention" as const, icon: "alert-triangle" as const },
  warning: { label: "警告", variant: "danger" as const, icon: "alert-triangle" as const },
};

interface VehicleStatusCardProps {
  vehicle: Vehicle;
}

export function VehicleStatusCard({ vehicle }: VehicleStatusCardProps) {
  const meta = statusMeta[vehicle.status];

  return (
    <Card className="relative min-h-36 overflow-hidden bg-black text-white sm:min-h-44">
      {vehicle.imageUrl ? (
        <Image
          src={vehicle.imageUrl}
          alt={`${vehicle.model} ${vehicle.modelYear}年式`}
          fill
          className="object-contain object-right-bottom"
          priority
        />
      ) : (
        <span
          className="absolute bottom-3 right-4 text-5xl"
          aria-hidden="true"
        >
          {vehicle.imageEmoji}
        </span>
      )}

      {/* 左側グラデーションオーバーレイ（テキスト可読性確保） */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-transparent" />

      {/* テキストコンテンツ */}
      <div className="absolute inset-0 flex flex-col justify-center px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
          My Car
        </p>
        <p className="mt-1 text-2xl font-bold">{vehicle.model}</p>
        <p className="text-xs text-white/70">{vehicle.modelYear}年式</p>
        <Badge variant={meta.variant} icon={meta.icon} className="mt-3 self-start">
          {meta.label}
        </Badge>
        {(vehicle.ownershipMonths !== undefined || vehicle.nextMaintenanceDate) ? (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5">
            {vehicle.ownershipMonths !== undefined && (
              <p className="text-xs text-white/70">
                オーナー歴{vehicle.ownershipMonths}か月
              </p>
            )}
            {vehicle.nextMaintenanceDate && (
              <p className="text-xs text-white/70">
                次回の整備｜{vehicle.nextMaintenanceDate}
              </p>
            )}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
