import type { SVGProps } from "react";

/**
 * 依存ライブラリなしで提供する最小限のアイコンセット。
 * 線画（stroke）ベースでコンシェルジュAPPのミニマルなトーンに合わせる。
 */
export type IconName =
  | "home"
  | "car"
  | "door"
  | "search"
  | "switch"
  | "bolt"
  | "bell"
  | "sparkles"
  | "shield-check"
  | "chat"
  | "chevron-left"
  | "chevron-right"
  | "check-circle"
  | "alert-triangle"
  | "menu"
  | "close"
  | "headset"
  | "chart-bar"
  | "users"
  | "book"
  | "gift"
  | "refresh"
  | "arrow-right"
  | "video";

type IconGlyphProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

const commonProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconPaths({ name }: { name: IconName }) {
  switch (name) {
    case "home":
      return (
        <>
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10.5V20h12v-9.5" />
          <path d="M10 20v-6h4v6" />
        </>
      );
    case "car":
      return (
        <>
          <path d="M4 16.5V13l2-4.5h12l2 4.5v3.5" />
          <path d="M4 16.5h16" />
          <path d="M7.5 8.5 9 4.5h6l1.5 4" />
          <circle cx="7.5" cy="17.5" r="1.5" />
          <circle cx="16.5" cy="17.5" r="1.5" />
        </>
      );
    case "door":
      return (
        <>
          <rect x="6" y="3" width="12" height="18" rx="1" />
          <circle cx="14" cy="12" r="0.8" fill="currentColor" stroke="none" />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="M15 15l5 5" />
        </>
      );
    case "switch":
      return (
        <>
          <rect x="3" y="8" width="18" height="8" rx="4" />
          <circle cx="15" cy="12" r="2.5" fill="currentColor" stroke="none" />
        </>
      );
    case "bolt":
      return <path d="M13 3 6 14h5l-1 7 7-11h-5l1-7Z" />;
    case "bell":
      return (
        <>
          <path d="M6 10a6 6 0 1 1 12 0c0 3 1 4.5 1.5 5.5H4.5C5 14.5 6 13 6 10Z" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </>
      );
    case "sparkles":
      return (
        <>
          <path d="M12 3v4M12 17v4M4 12h4M16 12h4" />
          <path d="M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2" />
        </>
      );
    case "shield-check":
      return (
        <>
          <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3Z" />
          <path d="M9 12l2 2 4-4" />
        </>
      );
    case "chat":
      return (
        <>
          <path d="M4 5h16v10H9l-4 4v-4H4V5Z" />
        </>
      );
    case "chevron-left":
      return <path d="M15 5 8 12l7 7" />;
    case "chevron-right":
      return <path d="M9 5l7 7-7 7" />;
    case "check-circle":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5.5" />
        </>
      );
    case "alert-triangle":
      return (
        <>
          <path d="M12 4 3 20h18L12 4Z" />
          <path d="M12 10v4" />
          <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
        </>
      );
    case "menu":
      return <path d="M4 7h16M4 12h16M4 17h16" />;
    case "close":
      return <path d="M6 6l12 12M18 6 6 18" />;
    case "headset":
      return (
        <>
          <path d="M4 13a8 8 0 1 1 16 0" />
          <rect x="3" y="13" width="4" height="6" rx="1.5" />
          <rect x="17" y="13" width="4" height="6" rx="1.5" />
          <path d="M19 19v1a3 3 0 0 1-3 3h-2" />
        </>
      );
    case "chart-bar":
      return (
        <>
          <path d="M4 20V10M11 20V4M18 20v-7" />
          <path d="M3 20h18" />
        </>
      );
    case "users":
      return (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
          <circle cx="17" cy="9" r="2.3" />
          <path d="M15.5 14.2c2.4.3 4 2 4.5 4.3" />
        </>
      );
    case "book":
      return (
        <>
          <path d="M4 5.5A2 2 0 0 1 6 4h6v16H6a2 2 0 0 1-2-2V5.5Z" />
          <path d="M20 4h-6v16h6" />
        </>
      );
    case "gift":
      return (
        <>
          <rect x="4" y="9" width="16" height="11" rx="1" />
          <path d="M4 13h16" />
          <path d="M12 9v11" />
          <path d="M12 9C10 6 6 6 6 8.5S9 9 12 9c3 0 6-1.5 6-.5S14 9 12 9Z" />
        </>
      );
    case "refresh":
      return (
        <>
          <path d="M4 10a8 8 0 0 1 14-4.5M20 14a8 8 0 0 1-14 4.5" />
          <path d="M18 3v4h-4M6 21v-4h4" />
        </>
      );
    case "arrow-right":
      return <path d="M4 12h16M14 6l6 6-6 6" />;
    case "video":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" stroke="none" />
        </>
      );
    default:
      return null;
  }
}

export function IconGlyph({ name, size = 20, ...rest }: IconGlyphProps) {
  return (
    <svg
      {...commonProps}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <IconPaths name={name} />
    </svg>
  );
}
