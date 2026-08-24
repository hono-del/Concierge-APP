import { Battery, BatteryWarning, Bluetooth, DoorOpen, Volume2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface QuickQuestionDef {
  label: string;
  icon: LucideIcon;
}

/** Quick Questions（要件 #9） */
export const quickQuestions: QuickQuestionDef[] = [
  { label: "後席ドアが開かない", icon: DoorOpen },
  { label: "Bluetoothがつながらない", icon: Bluetooth },
  { label: "警告灯が消えない", icon: BatteryWarning },
  { label: "バッテリーが上がった", icon: Battery },
  { label: "異音がする", icon: Volume2 },
];
