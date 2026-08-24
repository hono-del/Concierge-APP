import { HelpCircle } from "lucide-react";
import { Button } from "@/components/voc/ui/button";
import { Card } from "@/components/voc/ui/card";

interface UnknownCardProps {
  reason: string;
  askedExpert?: boolean;
  onAskExpert: () => void;
}

/** Unknown Detection（要件 #13, #14）：確信度の低い回答を無理に出さず、Expert Communityへつなぐ */
export function UnknownCard({ reason, askedExpert, onAskExpert }: UnknownCardProps) {
  return (
    <Card className="max-w-xl border-slate-200 p-4">
      <div className="flex items-start gap-2">
        <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        <div className="flex-1">
          <p className="text-sm font-semibold leading-relaxed text-slate-900">{reason}</p>
          <p className="mt-2 text-sm text-slate-600">詳しい人に聞いてみますか？</p>
          <Button
            className="mt-3"
            size="sm"
            onClick={onAskExpert}
            disabled={askedExpert}
          >
            {askedExpert ? "質問済みです" : "Expert Communityに質問する"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
