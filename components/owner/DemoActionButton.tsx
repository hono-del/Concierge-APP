"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ButtonProps } from "@/components/ui/Button";

interface DemoActionButtonProps extends Omit<ButtonProps, "onClick"> {
  message: string;
}

/**
 * モックのため実際の遷移・送信を行わないCTAボタン。
 * クリック時にデモである旨のメッセージを表示する。
 */
export function DemoActionButton({ message, children, ...props }: DemoActionButtonProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button
        {...props}
        onClick={() => {
          setVisible(true);
          window.setTimeout(() => setVisible(false), 3000);
        }}
      >
        {children}
      </Button>
      <p
        role="status"
        aria-live="polite"
        className={`mt-2 text-xs text-secondary transition-opacity ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {visible ? message : ""}
      </p>
    </div>
  );
}
